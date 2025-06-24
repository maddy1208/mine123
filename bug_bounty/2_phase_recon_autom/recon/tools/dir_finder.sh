#!/bin/bash

# ----------------------- COLORS -----------------------
blue='\033[1;34m'
green='\033[1;32m'
yellow='\033[1;33m'
red='\033[1;31m'
reset='\033[0m'

# -------------------- INPUT CHECK ---------------------
input_file="$1"
if [[ ! -f "$input_file" ]]; then
    echo -e "${red}[✘] Usage: $0 <live_domains.txt>${reset}"
    exit 1
fi

# -------------------- OUTPUT SETUP --------------------
outdir="dirs_out"
mkdir -p "$outdir"

# ------------------- WORDLISTS SETUP ------------------
wordlists=(
    "/home/maddy/techiee/bug_bounty/bin_deps/fuzz_onelistforallshort"
    "/home/maddy/techiee/bug_bounty/bin_deps/db.txt"
    "/home/maddy/techiee/bug_bounty/bin_deps/my_research_dirs.txt"
    "/home/maddy/techiee/bug_bounty/bin_deps/SecLists/Discovery/Web-Content/quickhits.txt"
    "/home/maddy/techiee/bug_bounty/bin_deps/SecLists/Discovery/Web-Content/common.txt"
    "/home/maddy/techiee/bug_bounty/bin_deps/common.txt"
)

# -------------------- FFUF Loop ----------------------
while read -r url; do
    domain=$(echo "$url" | awk -F/ '{print $3}')
    dirpath="$outdir/$domain"
    mkdir -p "$dirpath"

    echo -e "\n${yellow}[*] Starting FFUF directory scan on $url${reset}"
    echo -e "${blue}[i] Output folder: $dirpath${reset}"

    if [[ ! "$url" =~ ^https?:// ]]; then
        echo -e "${red}[✘] Invalid URL format: $url${reset}"
        continue
    fi

    for wordlist in "${wordlists[@]}"; do
        if [[ ! -f "$wordlist" ]]; then
            echo -e "${red}[✘] Wordlist not found: $wordlist${reset}"
            continue
        fi

        name=$(basename "$wordlist")
        echo -e "${yellow}[-] FFUF: Loading wordlist → $name${reset}"

        ffuf -u "$url/FUZZ" -w "$wordlist" -t 200 -fc 404 \
        -of html -o "$dirpath/ffuf_${name}.html" \
        -of csv -o "$outdir/ffuf_${domain}_${name}.csv" \
        -e .php,.html,.txt,.bak,.zip,.old,.inc,.json,.env,.log,.sql \
        -H "User-Agent: Mozilla/5.0" -H "X-Forwarded-For: 127.0.0.1" < /dev/null

        [[ $? -eq 0 ]] && \
            echo -e "${green}[✔] FFUF done with $name → ffuf_${name}.csv${reset}" || \
            echo -e "${red}[✘] FFUF failed with $name${reset}"
    done
done < "$input_file"

echo -e "${yellow}[-] Combining all FFUF csv files...${reset}"
cat "$outdir"/*.csv > "$outdir/all_csv_out"
rm -f "$outdir"/*.csv

awk -F',' '
BEGIN {
    printf "%-30s %-80s %-10s\n", "Payload", "URL", "Status"
    print "---------------------------------------------------------------------------------------------------------------"
}
{
    printf "%-30s %-80s %-10s\n", $1, $2, $5
}' "$outdir/all_csv_out" > "$outdir/ffuf_all_report.txt"

echo -e "${green}[✔] FFUF output saved to $outdir/ffuf_all_report.txt${reset}"

# ------------------------ Dirsearch ------------------------
echo -e "${yellow}[-] Starting Dirsearch...${reset}"

python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/dirsearch/dirsearch.py \
    -l "$input_file" -t 50 --random-agent -x 404 --delay 0.5 \
    -e php,html,txt,bak,zip,old,inc,json,env,log,sql --follow-redirects \
    -f -o "$outdir/dirsearch.txt" < /dev/null

echo -e "${green}[✔] Dirsearch output → $outdir/dirsearch.txt${reset}"

# ------------------------ Redirects ------------------------
input_ffuf_file="$outdir/ffuf_all_report.txt"
input_dir_file="$outdir/dirsearch.txt"

echo "[+] Extracting redirected URLs..."

awk '$NF ~ /^30[1278]$/ {print $(NF-1)}' "$input_ffuf_file" > "$outdir/redirected_urls_ffuf.txt"
awk '$1 ~ /^30[1278]$/ {print $3}' "$input_dir_file" > "$outdir/redirected_urls_dirsearch.txt"
cat "$outdir"/redirected_urls_*.txt | sort -u > "$outdir/all_redirected_urls"

echo "[+] Resolving redirects with httpx..."
httpx -l "$outdir/all_redirected_urls" -follow-redirects \
  -mc 200,202,203,204,205,206,207,208 -o "$outdir/redirect_results"

# ------------------------ Collect All 2xx URLs ------------------------
echo "[+] Collecting all 2XX response URLs for Arjun..."

awk '$NF ~ /^20[0-8]$/ {print $(NF-1)}' "$input_ffuf_file" > "$outdir/ffuf_2xx_urls.txt"
awk '$1 ~ /^20[0-8]$/ {print $3}' "$input_dir_file" > "$outdir/dirsearch_2xx_urls.txt"
grep -oP '\[\K[^\]]+' "$outdir/redirect_results" > "$outdir/redirect_2xx_urls.txt"

cat "$outdir"/ffuf_2xx_urls.txt "$outdir"/dirsearch_2xx_urls.txt "$outdir"/redirect_2xx_urls.txt \
    | grep -E '^https?://' \
    | grep -Ev '\.(js|css|ico|png|jpg|svg|woff|ttf|eot|gif|mp4|zip|tar|gz|pdf|exe|json)$' \
    | sort -u > "$outdir/all_2xx_clean.txt"

rm -f "$outdir"/dirsearch_2xx_urls.txt "$outdir"/ffuf_2xx_urls.txt "$outdir"/redirect_2xx_urls.txt \
       "$outdir"/redirected_urls_ffuf.txt "$outdir"/redirected_urls_dirsearch.txt

# # ------------------------ Arjun Scan ------------------------
# echo "[*] Running Arjun to find hidden parameters..."
# while read -r url; do
#   echo "[$(date '+%T')] Scanning: $url" | tee -a "$outdir/hidden_params.txt"
#   echo "==== URL: $url ====" >> "$outdir/hidden_params.txt"
#   arjun -u "$url" -oT - >> "$outdir/hidden_params.txt"
#   echo -e "\n" >> "$outdir/hidden_params.txt"
#   sleep 2
# done < "$outdir/all_2xx_clean.txt"

# echo -e "${green}[✔] Arjun scan complete. Results in $outdir/hidden_params.txt${reset}"
