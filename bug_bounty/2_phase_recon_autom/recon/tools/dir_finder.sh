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

# -------------------- START LOOP ----------------------
while read -r url; do
    domain=$(echo "$url" | awk -F/ '{print $3}')
    dirpath="$outdir/$domain"
    mkdir -p "$dirpath"

    echo -e "\n${yellow}[*] Starting directory scan on $url${reset}"
    echo -e "${blue}[i] Output folder: $dirpath${reset}"

    # Ensure the URL is valid
    if [[ ! "$url" =~ ^https?:// ]]; then
        echo -e "${red}[✘] Invalid URL format: $url${reset}"
        continue
    fi

    # Run FFUF for each wordlist
    for wordlist in "${wordlists[@]}"; do
        # Ensure the wordlist exists
        if [[ ! -f "$wordlist" ]]; then
            echo -e "${red}[✘] Wordlist not found: $wordlist${reset}"
            continue
        fi

        name=$(basename "$wordlist")
        echo -e "${yellow}[-] FFUF: Loading wordlist → $name${reset}"

        ffuf -u "$url/FUZZ" -w "$wordlist" -t 200 -fc 404 \
        -of html -o "$dirpath/ffuf_${name}.html"  -of csv -o "$outdir/ffuf_${domain}_${name}.csv" -v -e .php,.html,.txt,.bak,.zip,.old,.inc,.json,.env,.log,.sql \
           -H "User-Agent: Mozilla/5.0" \
            -H "X-Forwarded-For: 127.0.0.1" \ < /dev/null

        if [[ $? -eq 0 ]]; then
            echo -e "${green}[✔] FFUF done with $name → ffuf_${name}.txt${reset}"
        else
            echo -e "${red}[✘] FFUF failed with $name${reset}"
        fi
    done
done < "$input_file"
#combining all files 
echo -e "${yellow}[-] Combining all csv files..."
cat "$outdir"/*.csv >> "$outdir/all_csv_out"
rm -rf "$outdir"/*.csv

awk -F',' '
BEGIN {
    printf "%-30s %-80s %-10s\n", "Payload", "URL", "Status"
    print "---------------------------------------------------------------------------------------------------------------"
}
{
    printf "%-30s %-80s %-10s\n", $1, $2, $5
}' "$outdir/all_csv_out" > "$outdir/ffuf_all_report.txt"

#--------------------------------------------------------------dirsearch---------------------------------------------------
echo -e "${yellow}[-] Starting Dirsearch on $url${reset}"

python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/dirsearch/dirsearch.py -l "$input_file" -t 50 --random-agent -x 404 --delay 0.5 \
   -e php,html,txt,bak,zip,old,inc,json,env,log,sql \
    -f -o "$outdir/dirsearch.txt" < /dev/null

echo -e "${green}[✔] Dirsearch done → dirsearch.txt${reset}"
echo -e "\n${green}[✔] All directory brute-force results saved in '${outdir}' folder.${reset}"
