#!/bin/bash

set -e
set -o pipefail

# Define input files
LIVEDOMAINS="live_subdomains.txt"
JSURLS="livejs.txt"


# Define output folders
OUTDIR="auto_out"
NUCLEI_OUT="$OUTDIR/nuclei"
JAELES_OUT="$OUTDIR/jaeles"
PARAM_OUT="$OUTDIR/params"
mkdir -p "$NUCLEI_OUT" "$JAELES_OUT" "$PARAM_OUT"
ALLPARAMS="$PARAM_OUT/all_params.txt"

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
    nuclei -l "$LIVEDOMAINS" -s critical,high,medium,low,info -o "$NUCLEI_OUT/nuclei_domain1_out" -stats
    nuclei -l "$LIVEDOMAINS" -t "$DOWNLOADED_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain2_out" -stats
    nuclei -l "$LIVEDOMAINS" -t "$LOSTSEC_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain3_out" -stats
    nuclei -l "$LIVEDOMAINS" -t /home/maddy/nuclei-templates/http/misconfiguration -o "$NUCLEI_OUT/nuclei_domain4_out" -stats

    echo "[+] Running Jaeles on $LIVEDOMAINS ..."
    cat "$LIVEDOMAINS" | jaeles scan  -c 50  -o "$JAELES_OUT/jaeles_domain_out"
else
    echo "[!] $LIVEDOMAINS not found or empty. Skipping domain scans."
fi

## === 2. SCAN JS FILES ===
if [[ -s "$JSURLS" ]]; then
    echo "[+] Running Nuclei on JS URLs ..."
    nuclei -l "$JSURLS" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_js1_out" -stats
    nuclei -l "$JSURLS" -t "$DOWNLOADED_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_js2_out" -stats
    nuclei -l "$JSURLS" -t "$LOSTSEC_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_js3_out" -stats
    nuclei -l "$JSURLS" -t /home/maddy/nuclei-templates/javascript -o "$NUCLEI_OUT/nuclei_js4_out" -stats
    nuclei -l "$JSURLS" -t /home/maddy/nuclei-templates/http/exposures -o "$NUCLEI_OUT/nuclei_js5_out" -stats

    echo "[+] Running Jaeles on JS URLs ..."
    cat "$JSURLS" | jaeles scan  -c 50 -o "$JAELES_OUT/jaeles_js_out"
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
cat results/* regex.txt loxs_param.txt | sort -u > "$ALLPARAMS"

 ## === 4. SCAN PARAMETERIZED URLS ===
 if [[ -s "$ALLPARAMS" ]]; then
    echo "[+] Running Nuclei on Parameterized URLs ..."
    nuclei -l "$ALLPARAMS" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_param1_out" -stats
    nuclei -l "$ALLPARAMS" -t "$DOWNLOADED_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_param2_out" -stats
    nuclei -l "$ALLPARAMS" -t "$LOSTSEC_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_param3_out" -stats
    nuclei -l "$ALLPARAMS" -t /home/maddy/nuclei-templates/dast -s critical,high,medium,low -dast -o "$NUCLEI_OUT/nuclei_param4_out" -stats

    echo "[+] Running Jaeles on Parameterized URLs ..."
    cat "$ALLPARAMS" | jaeles scan -c 50  -o "$JAELES_OUT/jaeles_params_out"
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
while read url; do
    echo "[+] Scanning for hidden params: $url" | tee -a "$OUTDIR/hidden_params.txt"
    arjun --stable -u "$url" -oT - >> "$OUTDIR/hidden_params.txt"
    echo -e "\n" >>"$OUTDIR/hidden_params.txt"
    sleep 2
done < "$ALLPARAMS"

#----------------------------------------------
#1. SQL Injection (SQLi)
#----------------------------------------------

echo "[*] Testing for SQLi using  sqlmap..."

script -q -c " python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/sqlmap/sqlmap.py -m "$ALLPARAMS" --level 5 --risk 3 --batch --dbs --tamper=between --random-agent" sqlmap_output.txt

echo "[*] Testing for SQLi using nuclei..."

nuclei -tags sqli,injection,error,blind,time,post,database,mysql,postgresql,mssql,azure-sql,google-cloud-sql,dast \
   -l "$ALLPARAMS" --rate-limit 200 --retries 2 -o "$OUTDIR/sqli_results.txt" -stats

# ----------------------------------------------
# 2. Cross Site Scripting (XSS)
# ----------------------------------------------
echo "[*] Testing for reflected XSS using xssstrike..."
while read -r url; do     python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/XSStrike/xsstrike.py -u "$url" | tee -a  "$OUTDIR/xss_xssstrike_out"; done < "$ALLPARAMS"

echo "[*] Testing for XSS using dalfox..."
dalfox file "$ALLPARAMS" --output  "$OUTDIR/xss_dalfox_out" --output-all

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
cat "$ALLPARAMS" | qsreplace 'https://<your-oast-here>.oast.fun' | tee  "$OUTDIR/ssrf_urls_ffuf"

echo "[*] Running FFUF for SSRF URLs..."
ffuf -c -w ssrf_urls_ffuf -u FUZZ | tee  "$OUTDIR/ssrf_ffuf_output.txt"

echo "[*] SSRF Nuclei testing (Blind SSRF and Response SSRF)..."
cat "$ALLPARAMS" | nuclei -t ~/nuclei-templates/dast/vulnerabilities/ssrf/blind-ssrf.yaml --retries 2 --dast -o  "$OUTDIR/ssrf_nuclei_blind.txt" -stats
cat "$ALLPARAMS" | nuclei -t ~/nuclei-templates/dast/vulnerabilities/ssrf/response-ssrf.yaml --retries 2 --dast -o  "$OUTDIR/ssrf_nuclei_response.txt" -stats

# ----------------------------------------------
# 4. Open Redirect
# ----------------------------------------------

echo "[*] Filtering potential redirect parameters..."
cat all_urls.txt "$ALLPARAMS" | grep -iE "=[^ ]*(http|https):\/\/|returnUrl=|redirect|continue=|next=|url=|uri=|dest=|target=|=http|returnUrl=|continue=|dest=|destination=|forward=|go=|goto=|login\?to=|login_url=|logout=|next=|next_page=|out=|g=|redir=|redirect=|redirect_to=|redirect_uri=|redirect_url=|return=|returnTo=|return_path=|return_to=|return_url=|rurl=|site=|target=|to=|uri=|url=|qurl=|rit_url=|jump=|jump_url=|originUrl=|origin=|Url=|desturl=|u=|Redirect=|location=|ReturnUrl=|redirect_url=|redirect_to=|forward_to=|forward_url=|destination_url=|jump_to=|go_to=|goto_url=|target_url=|redirect_link=" | tee  "$OUTDIR/redirect_params.txt"

echo "[*] Open Redirect using HTTPX..."
cat redirect_params.txt | qsreplace "https://evil.com" | httpx -silent -fr -status-code | grep "\[3" >>  "$OUTDIR/open_httpx_out.txt"

echo "[*] Open Redirect using curl..."
cat redirect_params.txt | qsreplace "https://evil.com" | xargs -I {} curl -s -o /dev/null -w "%{url_effective} -> %{redirect_url}\n" {} | tee  "$OUTDIR/open_curl_out.txt"

echo "[*] Open Redirect using nuclei..."
cat redirect_params.txt | qsreplace "https://evil.com" | nuclei -tags redirect -c 30 -o  "$OUTDIR/open_nuclei_out.txt"

# ----------------------------------------------
# 5. Subdomain Takeover
# ----------------------------------------------

echo "[*] Testing for Subdomain Takeover with nuclei..."
nuclei -l live_subdomains.txt -t ~/nuclei-templates/http/takeovers -o  "$OUTDIR/takeover_out1.txt" -stats
nuclei -profile ~/nuclei-templates/profiles/subdomain-takeovers.yml -l live_subdomains.txt -o  "$OUTDIR/takeover_out2.txt" -stats

echo "[*] Testing for Subdomain Takeover with subzy..."
subzy run --targets live_subdomains.txt | tee  "$OUTDIR/takeover_out3.txt"

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
nuclei -l live_subdomains.txt -tags cors -o  "$OUTDIR/nuclei_cors.txt" -stats

# ----------------------------------------------
# 8. CRLF Injection
# ----------------------------------------------

echo "[*] CRLF Injection with crlfi..."
crlfi -i live_subdomains.txt -o  "$OUTDIR/crlf_crlfi.txt"

echo "[*] CRLF Injection with crlfuzz (domains)..."
crlfuzz -l live_subdomains.txt | tee -a  "$OUTDIR/crlf_crlfuzz.txt"

echo "[*] CRLF Injection with crlfsuite..."
crlfsuite -iT live_subdomains.txt -oN  "$OUTDIR/crlf_crlfsuite.txt"

echo "[*] CRLF Injection using nuclei templates..."
nuclei -t ~/nuclei-templates/dast/vulnerabilities/crlf/ -l live_subdomains.txt -dast -o  "$OUTDIR/crlf_nuclei_out1.txt" -stats
nuclei -t ~/nuclei-templates/http/vulnerabilities/generic/crlf-injection-generic.yaml -l live_subdomains.txt -o  "$OUTDIR/crlf_nuclei_out2.txt" -stats
nuclei -t ~/nuclei-templates/http/vulnerabilities/other/viewlinc-crlf-injection.yaml -l live_subdomains.txt -o  "$OUTDIR/crlf_nuclei_out3.txt" -stats


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

while read -r ip port; do
    # Get all domains that map to this IP, join by underscore
    domains=$(grep " $ip$" portscan/domain_ip_map.txt | awk '{print $1}' | tr '\n' '_' | sed 's/_$//')
    if [ -z "$domains" ]; then
        domains="unknown_domain"
    fi

    echo "[*] Scanning $ip:$port (domains: $domains)..."
    nmap -p "$port" -sV -T4 -oN "portscan/nmap/nmap_detailed_${domains}_${ip}.txt" "$ip"
done < portscan/ip_port_list.txt

echo "[*] Starting Nmap port scans this might take long time......"
nmap -p- --open -sV -T4 -oN portscan/nmap_results.txt -iL portscan/cleaned_domains.txt


echo "All scans completed."

echo "Finished portscanning....."

echo "============================================"
echo "[+] Automation Completed!..keep pushing maddyyy!"
echo "============================================"
