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
outdir="dirs"
mkdir -p "$outdir"

# ------------------- WORDLISTS SETUP ------------------
wordlists=(
    "/usr/share/dirb/wordlists/common.txt"
    "/home/maddy/techiee/bug_bounty/bin_deps/fuzz_onelistforallshort"
    "/home/maddy/techiee/bug_bounty/bin_deps/db.txt"
    "/home/maddy/techiee/bug_bounty/bin_deps/dirs.txt"
    "/home/lolita/hacking/bug_bounty/tools_dep/SecLists/Discovery/Web-Content/quickhits.txt"
    "/home/lolita/hacking/bug_bounty/tools_dep/SecLists/Discovery/Web-Content/common.txt"
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

        ffuf -u "$url/FUZZ" -w "$wordlist" -t 200 -fc 404 -of html -o "$dirpath/ffuf_${name}.html" -v

        if [[ $? -eq 0 ]]; then
            echo -e "${green}[✔] FFUF done with $name → ffuf_${name}.txt${reset}"
        else
            echo -e "${red}[✘] FFUF failed with $name${reset}"
        fi
    done

    # Run Dirsearch
    echo -e "${yellow}[-] Starting Dirsearch on $url${reset}"
    dirsearch -u "$url" -t 150 --random-agent -x 404 -o "$dirpath/dirsearch.txt"
    echo -e "${green}[✔] Dirsearch done → dirsearch.txt${reset}"

    echo -e "${blue}[i] Completed all scans for $url${reset}"
done < "$input_file"

echo -e "\n${green}[✔] All directory brute-force results saved in '${outdir}' folder.${reset}"

