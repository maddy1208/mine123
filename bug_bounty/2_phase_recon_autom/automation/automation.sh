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
httpx -l "$LIVE_INPUT" -silent -no-color -status-code -fr \
  | grep -Ev "\[(401|404|501|502)\]" \
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
      
    echo "[+] Running Jaeles on $LIVEDOMAINS ..."
    cat "$LIVEDOMAINS" | jaeles scan  -c 50  -o "$JAELES_OUT/jaeles_domain_out"
    
    echo "[+] Running Nuclei on $LIVEDOMAINS ..."
    nuclei -l "$LIVEDOMAINS" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain1_out" -stats -retries 2 
    nuclei -l "$LIVEDOMAINS" -t "$DOWNLOADED_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain2_out" -stats -retries 2 
    nuclei -l "$LIVEDOMAINS" -t "$LOSTSEC_TEMP" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain3_out" -stats  -retries 2 
    nuclei -l "$LIVEDOMAINS" -t /home/maddy/nuclei-templates/http/misconfiguration -o "$NUCLEI_OUT/nuclei_domain4_out" -stats  -retries 2 
 
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
  -t /home/maddy/nuclei-templates/javascript \
  -s critical,high,medium,low \
  -o "$NUCLEI_OUT/nuclei_js_1" \
  -stats -retries 2 
    nuclei -l clean_js.txt \
   -t /home/maddy/nuclei-templates/http/exposures \
  -s critical,high,medium,low \
  -o "$NUCLEI_OUT/nuclei_js_2" \
  -stats -retries 2 
    rm clean_js.txt

else
    echo "[!] $JSURLS not found or empty. Skipping JS URL scans."
fi

=== 3. PARAMETERIZED URLS ENUM ===
echo "[+] Running ParamSpider..."
paramspider -l "$LIVEDOMAINS" 


echo "[+] regex urls..."
cat all_urls.txt | grep -E '\?[^=]+=.+$' > regex.txt 


echo "[+] Extracting parameterized URLs from all_urls.txt ..."
echo "[+] Running LostFuzzer..."
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/lostfuzzer.sh | tee -a "$NUCLEI_OUT/nuclei_lostfuzzer_out"
mv filtered_urls.txt loxs_param.txt


echo "[+] Combining all parameterized URLs..."
cat results/* regex.txt loxs_param.txt | grep -E '\?.+=.+' | grep -Ev '^https?://[^?]+\.(woff2|ttf|svg|eot|css|js|png|jpeg|gif|ico|mp4|webp|bmp|json|xml)(\?|$)'  | grep -Ev 'cdn|cloudflare|googletag|googleapis|bootstrapcdn|jquery|fonts|addthis|facebook|linkedin|twitter|gstatic|optimizely|newrelic|akamai|doubleclick|bing|jsdelivr|youtube|ytimg'  | sort -u  > sam.txt

cat results/* regex.txt loxs_param.txt | grep -E '([?&](image|file|url)=)' >> sam.txt || true
cat sam.txt | sort -u -o   "$ALLPARAMS"
rm sam.txt

# === 4. SCAN PARAMETERIZED URLS ===
if [[ -s "$ALLPARAMS" ]]; then
    echo "[+] Running dast scan on Parameterized URLs ..."
    nuclei -l "$ALLPARAMS" -dast -c 1000  -retries 2 -o "$NUCLEI_OUT/dast_out.txt" -stats

echo "[+] Running Jaeles on Parameterized URLs ..."

##making temp directory for param templates
mkdir -p ~/jaeles-templates/param-only

grep -rilE 'xss|sqli|ssrf|ssti|rce' /home/maddy/.jaeles/base-signatures/ --include="*.yaml" \
| xargs -I{} cp {} ~/jaeles-templates/param-only/

cat "$ALLPARAMS" | jaeles scan -c 50 -s ~/jaeles-templates/param-only/  -o "$JAELES_OUT/jaeles_params_out"

echo "[+] removing temp directory..."
rm -rf  ~/jaeles-templates/param-only

else
    echo "[!] No parameterized URLs found. Skipping parameter scans."
fi

echo "✅ Automation  1 ..Complete! All outputs saved in: $OUTDIR"


# ------------------------------------------------PART 2------------------------------------------------


echo "============================================"
echo "[*] Starting General Bug Automation Recon"
echo "============================================"

#----------------------------------------------
#1. SQL Injection (SQLi)
#----------------------------------------------

# echo "[*] Testing for SQLi using  sqlmap..."
# script -q -c " python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/sqlmap/sqlmap.py -m "$ALLPARAMS" --level 5 --risk 3 --batch --dbs --tamper=between --random-agent" "$OUTDIR/sqlmap_output.txt"


echo "[*] Testing for SQLi using nuclei..."
nuclei -tags sqli,injection,error,blind,time,post,database,mysql,postgresql,mssql,azure-sql,google-cloud-sql,dast \
   -l "$ALLPARAMS" --rate-limit 200 --retries 2 -o "$OUTDIR/sqli_results.txt" -stats  -retries 2 

# ----------------------------------------------
# 2. Cross Site Scripting (XSS)
# ----------------------------------------------
echo "[*] Testing using xss vibes..."
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/xss_vibes/main.py -f "$ALLPARAMS" -o "$OUTDIR/xss_vibes_out" 

# echo "[*] Testing for XSS using dalfox..."
# dalfox file "$ALLPARAMS" --skip-bav --silence -o "$OUTDIR/dalfox_xss.txt"

# ----------------------------------------------
# 3. Server-Side Request Forgery (SSRF)
# ----------------------------------------------

echo "[*] SSRF Test: Replacing parameters with Collaborator URL..."
cat "$ALLPARAMS" | qsreplace 'https://eocl5oschaqcy19.m.pipedream.net/' | tee  -a "$OUTDIR/ssrf_urls_ffuf"
cat "$ALLPARAMS" | qsreplace 'https://ahz0j4r17hwqqfdo3ibmaa5nl.canarytokens.com' | tee  -a "$OUTDIR/ssrf_urls_ffuf"


echo "[*] Running FFUF for SSRF URLs..."
ffuf -c -w "$OUTDIR/ssrf_urls_ffuf" -u FUZZ | tee -a "$OUTDIR/ssrf_ffuf_output.txt"

echo "[*] SSRF Nuclei testing (Blind SSRF and Response SSRF)..."
cat "$ALLPARAMS" | nuclei -t ~/nuclei-templates/dast/vulnerabilities/ssrf/blind-ssrf.yaml --retries 2 --dast -o  "$OUTDIR/ssrf_nuclei_blind.txt" -stats
cat "$ALLPARAMS" | nuclei -t ~/nuclei-templates/dast/vulnerabilities/ssrf/response-ssrf.yaml --retries 2 --dast -o  "$OUTDIR/ssrf_nuclei_response.txt" -stats

# ----------------------------------------------
# 4. Open Redirect
# ----------------------------------------------

echo "[*] Filtering potential redirect parameters..."
cat all_urls.txt "$ALLPARAMS" | grep -iE "=[^ ]*(http|https):\/\/|returnUrl=|redirect|continue=|next=|url=|uri=|dest=|target=|=http|returnUrl=|continue=|dest=|destination=|forward=|go=|goto=|login\?to=|login_url=|logout=|next=|next_page=|out=|g=|redir=|redirect=|redirect_to=|redirect_uri=|redirect_url=|return=|returnTo=|return_path=|return_to=|return_url=|rurl=|site=|target=|to=|uri=|url=|qurl=|rit_url=|jump=|jump_url=|originUrl=|origin=|Url=|desturl=|u=|Redirect=|location=|ReturnUrl=|redirect_url=|redirect_to=|forward_to=|forward_url=|destination_url=|jump_to=|go_to=|goto_url=|target_url=|redirect_link=" | tee -a  "$OUTDIR/redirect_params.txt"

echo "[*] Open Redirect using HTTPX..."
cat "$OUTDIR/redirect_params.txt" | qsreplace "https://evil.com" | httpx -silent -fr -no-color -status-code | grep "\[3" >>  "$OUTDIR/open_httpx_out.txt"


echo "[*] Open Redirect using nuclei..."
cat "$OUTDIR/redirect_params.txt" | qsreplace "https://evil.com" | nuclei -tags redirect -c 30 -o  "$OUTDIR/open_nuclei_out.txt" -retries 2 -stats 


# ----------------------------------------------
# 5. Subdomain Takeover
# ----------------------------------------------

echo "[*] Testing for Subdomain Takeover with nuclei..."
nuclei -l live_subdomains.txt -t ~/nuclei-templates/http/takeovers -o  "$OUTDIR/takeover_out1.txt" -stats -retries 2 
nuclei -profile ~/nuclei-templates/profiles/subdomain-takeovers.yml -l live_subdomains.txt -o  "$OUTDIR/takeover_out2.txt" -stats -retries 2 

echo "[*] Testing for Subdomain Takeover with subzy..."
subzy run --targets live_subdomains.txt | tee -a "$OUTDIR/takeover_out3.txt"

# ----------------------------------------------
# 6. WordPress Vulnerabilities
# ----------------------------------------------

echo "[*] Detecting WordPress vulnerabilities with nuclei..."
nuclei -l live_subdomains.txt -t ~/nuclei-templates/http/vulnerabilities/wordpress -o  "$OUTDIR/wordpress_vuln.txt" -stats -retries 2 
nuclei -l live_subdomains.txt -t ~/nuclei-templates/http/technologies/wordpress-detect.yaml -o  "$OUTDIR/wordpress_detect.txt" -stats -retries 2 

# ----------------------------------------------
# 7. CORS Misconfigurations
# ----------------------------------------------

echo "[*] Checking CORS configurations..."
nuclei -l live_subdomains.txt -tags cors -o  "$OUTDIR/nuclei_cors.txt" -stats 

# ----------------------------------------------
# 8. CRLF Injection
# ----------------------------------------------

echo "[*] CRLF Injection with crlfi..."
crlfi -i "$LIVEDOMAINS"  -o  "$OUTDIR/crlf_crlfi.txt"

echo "[*] CRLF Injection with crlfuzz (domains)..."
crlfuzz -l "$LIVEDOMAINS"  | tee -a  "$OUTDIR/crlf_crlfuzz.txt"

echo "[*] CRLF Injection using nuclei templates..."
nuclei -t ~/nuclei-templates/dast/vulnerabilities/crlf/ -l "$LIVEDOMAINS"  -dast -o  "$OUTDIR/crlf_nuclei_out1.txt" -stats  -retries 2 
nuclei -t ~/nuclei-templates/http/vulnerabilities/generic/crlf-injection-generic.yaml -l "$LIVEDOMAINS"  -o  "$OUTDIR/crlf_nuclei_out2.txt" -stats  -retries 2 
nuclei -t ~/nuclei-templates/http/vulnerabilities/other/viewlinc-crlf-injection.yaml -l "$LIVEDOMAINS"  -o  "$OUTDIR/crlf_nuclei_out3.txt" -stats  -retries 2 


#-------------------------------------PORT SCANNING---------------------------------

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
masscan -iL portscan/ips_domain.txt -p1-65535 --rate 300 -oG portscan/masscan_results.txt

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
  ip="$(echo {} | cut -d" " -f1)"
  port="$(echo {} | cut -d" " -f2)"
  domains=$(grep " $ip$" portscan/domain_ip_map.txt | awk "{print \$1}" | tr "\n" "_" | sed "s/_$//")
  [[ -z "$domains" ]] && domains="unknown_domain"
  nmap -p "$port" -sV -T4 -oN "portscan/nmap/nmap_detailed_${domains}_${ip}.txt" "$ip"
'

echo -e "${BLUE}[+] Running scan4all...${NC}"
scan4all -v -l  "$LIVEDOMAINS" -o "$OUTDIR/scan4all_output.txt"

#9. Hidden Parameters Discovery using Arjun
#echo "[*] Finding Hidden Parameters using Arjun..."
# while read url; do
#   echo "[$(date '+%T')] Scanning: $url" | tee -a "$OUTDIR/hidden_params.txt"
#   echo "==== URL: $url ====" >> "$OUTDIR/hidden_params.txt"
#   arjun -u "$url" -oT - >> "$OUTDIR/hidden_params.txt"
#   echo -e "\n" >>"$OUTDIR/hidden_params.txt"
#   sleep 2
# done < "$ALLPARAMS" 


echo "All scans completed."

echo "Finished portscanning....."

echo "============================================"
echo "[+] Automation Completed!..keep pushing maddyyy!"
echo "============================================"
