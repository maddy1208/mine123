##!/bin/bash

## ----------------------- COLORS -----------------------
blue='\033[1;34m'
green='\033[1;32m'
yellow='\033[1;33m'
red='\033[1;31m'
reset='\033[0m'

## -------------------- INPUT CHECK ---------------------
input_file="$1"
if [[ ! -f "$input_file" ]]; then
    echo -e "${red}[✘] Usage: $0 <live_domains.txt>${reset}"
    exit 1
fi

## -------------------- OUTPUT SETUP --------------------
outdir="dirs_out"
mkdir -p "$outdir"

## ------------------- WORDLISTS SETUP ------------------
wordlists=(
    "/home/maddy/techiee/bug_bounty/bin_deps/SecLists/Discovery/Web-Content/common.txt"
)

## -------------------- FFUF Loop ----------------------
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

        ffuf -u "$url/FUZZ" -w "$wordlist" -t 150 -fc 404 \
  -of html -o "$dirpath/ffuf_${name}.html" \
  -of csv -o "$outdir/ffuf_${domain}_${name}.csv" \
  -e .php,.html,.txt,.bak,.zip,.old,.inc,.json,.env,.log,.sql,.csv \
  -H "User-Agent: Mozilla/5.0" \
  -H "X-Forwarded-For: 127.0.0.1" < /dev/null

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

## ------------------------ Dirsearch ------------------------
###echo -e "${yellow}[-] Starting Dirsearch...${reset}"

###python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/dirsearch/dirsearch.py \
   ### #-l "$input_file"  --random-agent -x 404 --delay 0.5 \
    ###-e php,html,txt,bak,zip,old,inc,json,env,log,sql --follow-redirects \
    ###-f -o "$outdir/dirsearch.txt" < /dev/null
###touch "$outdir/dirsearch.txt"
###echo -e "${green}[✔] Dirsearch output → $outdir/dirsearch.txt${reset}"

## ------------------------ Redirects ------------------------
input_ffuf_file="$outdir/ffuf_all_report.txt"
###input_dir_file="$outdir/dirsearch.txt"

echo "[+] Extracting redirected URLs..."

awk '$NF ~ /^30[1278]$/ {print $(NF-1)}' "$input_ffuf_file" |  sort -u > "$outdir/redirected_urls_ffuf.txt"
###awk '$1 ~ /^30[1278]$/ {print $3}' "$input_dir_file" > "$outdir/redirected_urls_dirsearch.txt"
###cat "$outdir"/redirected_urls_*.txt | sort -u > "$outdir/all_redirected_urls"

echo "[+] Resolving redirects with httpx..."
httpx -l "$outdir/redirected_urls_ffuf.txt" -follow-redirects \
  -mc 200,202,203,204,205,206,207,208 -o "$outdir/redirect_results"

## ------------------------ Collect All 2xx URLs ------------------------
echo "[+] Collecting all 2XX response URLs ..."

awk '$NF ~ /^20[0-8]$/ {print $(NF-1)}' "$input_ffuf_file" | grep -Ev 'js|css|ico|png|jpg|svg|woff|ttf|eot|gif|mp4' > "$outdir/ffuf_2xx_urls.txt"
###awk '$1 ~ /^20[0-8]$/ {print $3}' "$input_dir_file" > "$outdir/dirsearch_2xx_urls.txt"
grep -oP '\[\K[^\]]+'  "$outdir/redirect_results" | grep -Ev 'js|css|ico|png|jpg|svg|woff|ttf|eot|gif|mp4' > "$outdir/redirect_2xx_analyze.txt"
###rm -f  "$outdir"/redirected_urls_ffuf.txt  


## ## ------------------------ Arjun Scan ------------------------
## echo "[*] Running Arjun in parallel to find hidden parameters..."
## echo -e "${yellow}[*] Total URLs to scan with Arjun: $(wc -l < "$outdir/all_2xx_clean.txt")${reset}"
## if [[ ! -s "$outdir/all_2xx_clean.txt" ]]; then
##   echo -e "${red}[✘] No valid 2XX URLs found for Arjun scan.${reset}"
##   exit 1
## fi
## ## Ensure a clean folder for individual outputs
## mkdir -p "$outdir/arjun_tmp"

## ## Export outdir so it's available in subshells
## export outdir

## ## Threaded Arjun execution (5 at a time)
## cat "$outdir/all_2xx_clean.txt" | xargs -P 5 -I {} bash -c '
##   url="{}"
##   filename=$(echo "$url" | sed "s|https\?://||; s|[/:]|_|g")
##   echo "[Arjun] Scanning: $url"
##   echo "==== URL: $url ====" > "$outdir/arjun_tmp/$filename.txt"
##   arjun -u "$url" -oT - >> "$outdir/arjun_tmp/$filename.txt"
## '

## ## Combine results
## cat "$outdir/arjun_tmp/"*.txt > "$outdir/hidden_params.txt"
## rm -rf "$outdir/arjun_tmp"

## echo -e "${green}[✔] Arjun scan complete. Output saved to $outdir/hidden_params.txt${reset}"
