#!/bin/bash

# ------------------- COLORS -------------------
blue='\033[1;34m'
green='\033[1;32m'
yellow='\033[1;33m'
red='\033[1;31m'
reset='\033[0m'

# ------------------ CHECK ARGS ----------------
if [[ $# -ne 1 || ! -f $1 ]]; then
    echo -e "${red}[✘] Usage: $0 domains.txt${reset}"
    exit 1
fi

domain_file=$1
summary_file="subdomains/summary_report.txt"
mkdir -p subdomains
echo -e "Recon Summary Report - $(date)\n" > "$summary_file"

# ------------------ MAIN LOOP ------------------
while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" || "$domain" == \#* ]] && continue

    echo -e "${blue}========== Recon for $domain ==========${reset}"
    echo -e "\n=== $domain ===" >> "$summary_file"

    timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    outdir="subdomains/$domain/$timestamp"
    mkdir -p "$outdir"
    cd "$outdir" || exit

    # -------- Subdomain Enumeration --------
    echo -e "${yellow}[*] Running Amass (active)...${reset}"
    amass enum -active -d "$domain" -nocolor -o amass_active.txt

    echo -e "${yellow}[*] Running Subfinder...${reset}"
    subfinder -d "$domain" -all -recursive -o subfinder.txt

    echo -e "${yellow}[*] Running Assetfinder...${reset}"
    assetfinder --subs-only "$domain" | tee assetfinder.txt

    echo -e "${yellow}[*] Running Amass (passive)...${reset}"
    amass enum -passive -d "$domain" -o amass_passive.txt

    echo -e "${yellow}[*] Running favienum (--run-amass)...${reset}"
    python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/favienum.py "https://$domain" --run-amass

# Move results to proper location
if [[ -f amass_results.txt ]]; then
    mv amass_results.txt favienum_amass_subs.txt
    echo -e "${green}[✔] Extra subdomains saved to favienum_amass_subs.txt${reset}"
else
    echo -e "${red}[✘] amass_results.txt not found. Something went wrong with favienum.${reset}"
fi


    # -------- Combine All Subdomains --------
    cat *.txt | sort -u > all_subdomains.txt
    total_subs=$(wc -l < all_subdomains.txt)
    echo -e "${green}[✔] Total unique subdomains: $total_subs${reset}"
    echo "Total subdomains: $total_subs" >> "$summary_file"

# -------- Favicon Hash --------
echo -e "${yellow}[*] Extracting favicon hash...${reset}"
full_url="https://$domain"
hash=$(python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/favienum.py "$full_url" | tee favicon_output.txt | grep -oP 'Hash: \K\S+')
if [[ -n "$hash" ]]; then
    echo "$hash" > favicon_hash.txt
    echo -e "${green}[✔] Favicon hash: $hash${reset}"
    echo "Favicon hash: $hash" >> "$summary_file"
else
    echo -e "${red}[✘] Hash not found.${reset}"
    echo "Favicon hash: Not found" >> "$summary_file"
fi

    # -------- Live Subdomains --------
    echo -e "${yellow}[*] Probing live subdomains with httpx...${reset}"
    /usr/local/bin/httpx -l all_subdomains.txt -threads 200 --timeout 3 -silent -o live_subdomains.txt
    live_count=$(wc -l < live_subdomains.txt)
    echo -e "${green}[✔] Live subdomains: $live_count${reset}"
    echo "Live subdomains: $live_count" >> "$summary_file"

    # -------- IP Extraction --------
    echo -e "${yellow}[*] Extracting IPs using dnsx...${reset}"
    dnsx -l live_subdomains.txt -resp-only | tee ip.txt
    ip_count=$(wc -l < ip.txt)
    echo -e "${green}[✔] IPs extracted: $ip_count${reset}"
    echo "Extracted IPs: $ip_count" >> "$summary_file"

    echo -e "${blue}========== Done with $domain ==========\n${reset}"
    echo "Output: $outdir" >> "$summary_file"
    echo "--------------------------------------" >> "$summary_file"

    cd - >/dev/null || exit

done < "$domain_file"

# ---------------- Final Note ----------------
echo -e "${green}[✔] Summary saved to ${summary_file}${reset}"

