#!/bin/bash

# Get absolute path of the directory containing this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Input files
all_urls="$SCRIPT_DIR/all_urls.txt"
live_subdomains="$SCRIPT_DIR/live_subdomains.txt"

# Output folder
output_dir="$SCRIPT_DIR/jsrecon"
mkdir -p "$output_dir"

echo "[+] Extracting JS URLs from all_urls.txt using regex"
grep -Eo 'https?://[^ ]+\.js([?#][^ ]*)?' "$all_urls" | sort -u > "$output_dir/crawled_jsfiles.txt"
echo "[+] Finished JS URLs from all_urls.txt using regex"

echo "[+] Extracting JS URLs from live_subdomains.txt using katana"
katana -silent -jc -list "$live_subdomains" >> "$output_dir/katana_all.txt"
grep -Eo 'https?://[^ ]+\.js([?#][^ ]*)?' "$output_dir/katana_all.txt"| sort -u > "$output_dir/katana_jsfiles.txt"
echo "[+] Finished JS URLs from live_subdomains.txt using katana"

echo "[+] Extracting JS links with subjs"
cat "$live_subdomains" | subjs >>"$output_dir/subjs_jsfiles.txt"
echo "[+] subjs finished for domains..."
echo "[+] subjs started for all urls..."
cat "$all_urls" | subjs  >>"$output_dir/subjs_jsfiles.txt"
echo "[+] Finished JS links with subjs"

echo "[+] Combining and sorting JS URLs"
cat "$output_dir/crawled_jsfiles.txt" "$output_dir/katana_jsfiles.txt" "$output_dir/subjs_jsfiles.txt" | sort -u > "$output_dir/alljs.txt"


echo "[+] Probing for live JS URLs using httpx"
cat "$output_dir/alljs.txt" | httpx -silent -mc 200 -t 60 >> "$output_dir/livejs.txt"
echo "[+] Finished Probing  using httpx"

output_dir1="$SCRIPT_DIR/jsrecon/js_downloads"
mkdir -p "$output_dir1"
echo "[+] Downloading JS ..."
cat livejs.txt | xargs -I {} wget --content-disposition -q -P "$output_dir1" {}
echo "[+] Finished Downloading JS ..."

# JS analysis
echo "[+] -----------------JS Analysis----------------------"
#------------------------------------------------------LINK FINDER----------------------------------------------------
echo "[+] Running LinkFinder"
linkfinder_out="$output_dir/linkfinder"
mkdir -p "$linkfinder_out"
echo "[+] Scanning downloaded files with LinkFinder "

echo "[+] Scanning alldomains with LinkFinder "
while read domain; do
   echo "[+] Scanning $domain";   python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/LinkFinder/linkfinder.py -i "$domain" -d -o cli >> "$linkfinder_out/cli_result_domains.txt";
   done <  "$live_subdomains"
   
while read domain; do
   echo "[+] Scanning $domain";   python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/LinkFinder/linkfinder.py -i "$domain" -d -o "$linkfinder_out/html_result_domains";
   done <  "$live_subdomains"
echo "[+] Finished alldomains with LinkFinder "
echo "[+] Scanning downloaded js with LinkFinder "
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/LinkFinder/linkfinder.py -i '/home/maddy/sam/sam/jsrecon/js_downloads/*' -o cli | tee "$linkfinder_out/cli_result_alljs.txt"
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/LinkFinder/linkfinder.py -i '/home/maddy/sam/sam/jsrecon/js_downloads/*' -o "$linkfinder_out/html_result_alljs.txt"
echo "[+] Finished alldomains with LinkFinder "
echo "[+] Finished Linkfinder successfully.... "

#------------------------------------------------------SECRET FINDER----------------------------------------------------
echo "[+] Running SecretFinder"
secretfinder_out="$output_dir/secretfinder"
mkdir -p "$secretfinder_out"

# 1. SecretFinder on raw URLs
echo "[+] Running SecretFinder on downloaded js"
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/SecretFinder/SecretFinder.py -i '/home/maddy/sam/sam/jsrecon/js_downloads/*' -o cli | tee "$secretfinder_out/cli_output_alljs.txt"
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/SecretFinder/SecretFinder.py -i '/home/maddy/sam/sam/jsrecon/js_downloads/*' -o "$secretfinder_out/html_output_alljs.html"
echo "[+] Finished SecretFinder on downloaded js"

echo "[+] Running SecretFinder on alldomains"
while read -r url; do
    python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/SecretFinder/SecretFinder.py -i "$url" -o cli >> "$secretfinder_out/cli_output_domains.txt"
    done < "$live_subdomains"

while read -r url; do
    python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/SecretFinder/SecretFinder.py -i "$url" -o  "$secretfinder_out/html_output_domains.txt"
    done < "$live_subdomains"
echo "[+] Finished SecretFinder on alldomains"
#------------------------------------------------------GREP ----------------------------------------------------
grep_out="$output_dir/grep"
mkdir -p "$grep_out"

echo "[+] Running Grep.."

echo "[*] Extracting probable API endpoints from JS..."
grep -EHo "/api/[a-zA-Z0-9_/-]+" "$SCRIPT_DIR"/jsrecon/js_downloads/*  | sort -u | tee "$grep_out/api_endpoints.txt"


echo "[*] Searching for long alphanumeric strings (possible secrets)..."
grep -EHo '([A-Za-z0-9_]{15,})' "$SCRIPT_DIR"/jsrecon/js_downloads/* | tee "$grep_out/long_strings.txt"

echo "[*] Searching for long alphanumeric strings (possible secrets)..."
grep -EHo '([a-z0-9.-]+)\.s3.*\.amazonaws\.com' jsrecon/js_downloads/* | tee "$grep_out/s3_buc.txt"


echo "[*] Finding potential Basic Auth tokens..."
grep -EHi 'Basic[\s\-_A-Za-z0-9]*[:=][\s\-_A-Za-z0-9]{10,}' "$SCRIPT_DIR"/jsrecon/js_downloads/*  | tee "$grep_out/auth_tokens.txt"


echo "[*] Grepping sensitive keywords (tokens, keys, creds)..."
KEYWORDS='api[_-]?key|aws_access_key|innertext|inner|internal|localhost|aws_secret_key|api key|passwd|pwd|heroku|slack|firebase|swagger|aws key|password|ftp password|jdbc|db|sql|secret jet|config|admin|json|gcp|htaccess|.env|ssh key|.git|access key|secret token|oauth_token|oauth_token_secret|secret|token|fetch|axios|debug|eval|authorization|env|bearer|client[_-]?id|client[_-]?secret|jwt|pass(word)?|cred(entials)?'

# Save raw output
grep -Poir --exclude='*.min.js' --binary-files=without-match \
  -e ".{0,15}($KEYWORDS).{0,15}" "$SCRIPT_DIR/jsrecon/js_downloads/" | tee "$grep_out/sens.txt" | \
# Pipe to sed and save colorized
sed -E "s/($KEYWORDS)/\x1b[31m\1\x1b[0m/Ig" | tee "$grep_out/sens_colored.txt"
echo "[*] Finished grepping potential Basic Auth tokens..."


# #---------------------------------------------------MANTRA---------------------------------------------------------
mantra_out="$output_dir/mantra"
mkdir -p  "$mantra_out"

echo "[+] Running Mantra"
cat "$SCRIPT_DIR/jsrecon/livejs.txt" | mantra | tee "$mantra_out/mantra_results.txt"

# #------------------------------------------------------NUCLEI----------------------------------------------------
nuclei_out="$output_dir/nuclei"
mkdir -p  "$nuclei_out"

echo "[+] Running nuclei for JavaScript specific templates"
nuclei -list "$live_subdomains" -t ~/nuclei-templates/javascript/ -o "$nuclei_out/nuclei1_javascript.txt" -stats
nuclei -list "$live_subdomains" -t ~/nuclei-templates/exposures -o "$nuclei_out/nuclei2_exposures.txt" -stats
nuclei -l "$live_subdomains"  -t ~/nuclei-templates/   -severity low,medium,high,critical -o "$nuclei_out/nuclei3_general.txt" -rate-limit 150   -stats
echo "[+] Finished nuclei..."


# #------------------------------------------------------S3----------------------------------------------------
echo "[*] Starting S3 Bucket Enumeration..."

s3_out="$output_dir/s3"
mkdir -p "$s3_out"

# Step 1: Extract potential S3 bucket URLs from JavaScript files
cat "$SCRIPT_DIR/jsrecon/livejs.txt" | xargs -I% curl -sk "%" |
  grep -Eo '([a-z0-9.-]+)\.s3.*\.amazonaws\.com' |
  sort -u > "$s3_out/s3_buckets_raw.txt"

echo "[*] Found $(wc -l < "$s3_out/s3_buckets_raw.txt") raw S3 bucket URLs."

# Step 2: Extract bucket names from URLs
cat "$s3_out/s3_buckets_raw.txt" |
  sed -E 's~.*://~~; s~\.s3.*\.amazonaws\.com.*~~' |
  sort -u > "$s3_out/s3_bc_names.txt"

echo "[*] Extracted $(wc -l < "$s3_out/s3_bc_names.txt") unique bucket names."

#---------------------------------------------------LAZYEGG---------------------------------------------------------
lazyegg_out="$output_dir/lazyegg"
mkdir -p "$lazyegg_out"

echo "[+] Running Lazyegg"

while read -r url; do
  domain=$(echo "$url" | sed -E 's~https?://([^/]+).*~\1~')

  (
    cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/lazyegg || exit 1
    echo -e "\n========== Target: $domain ==========\n" | tee -a output_domains.txt
    python3 lazyegg.py "$url" | tee -a output_domains.txt
  )
done < "$live_subdomains"

cat "$SCRIPT_DIR/jsrecon/livejs.txt" | xargs -I{} bash -c '
  echo -e "\n[+] Target: {}\n" | tee -a "'"$lazyegg_out"'/output_alljs.txt"
  (
    cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/lazyegg || exit 1
    python3 lazyegg.py "{}" --js_urls --domains --ips --leaked_creds | tee -a output_alljs.txt
  )
'

# Move generated outputs to your output directory (if they exist)
mv /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/lazyegg/output_domains.txt "$lazyegg_out/output_domains.txt" 2>/dev/null || true
mv /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/lazyegg/output_alljs.txt "$lazyegg_out/output_alljs.txt" 2>/dev/null || true

echo "[+] Finished Lazyegg"


#---------------------------------------------------JSFSCAN---------------------------------------------------------
jsfscan_out="$output_dir/jsfscan"
mkdir -p "$jsfscan_out"

echo "[+] Running JSFScan...oi"
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/JSFScan.sh
(
  cd /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/JSFScan.sh &&
  ./JSFScan.sh -l "$live_subdomains" --all -r -o report
)
mv /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/JSFScan.sh/report "$jsfscan_out/report"
echo "[+] Finished JSFScan"

echo "[+] JS Recon Completed. Results saved in $output_dir"
