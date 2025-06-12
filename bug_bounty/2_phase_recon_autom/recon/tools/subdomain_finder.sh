#!/bin/bash

# Colors
blue='\033[1;34m'
green='\033[1;32m'
yellow='\033[1;33m'
red='\033[1;31m'
reset='\033[0m'

# Enable nullglob to avoid glob expansion issues
shopt -s nullglob

if [[ $# -ne 1 || ! -f $1 ]]; then
    echo -e "${red}[✘] Usage: $0 domains_file${reset}"
    exit 1
fi

gtoken="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"
crtoken="RyTprtzMEf7bkA5Lv2pswtUgk3er0tHa"
input_file=$1
cleaned_file="cleaned_domains.txt"
summary_file="sub_output/summary_report.txt"
mkdir -p sub_output
# Clean URLs: remove protocol, paths, empty lines, duplicates
echo -e "${yellow}[*] Cleaning input domains...${reset}"
sed -E 's#https?://##' "$input_file" | cut -d '/' -f1 | awk NF | sort -u > "$cleaned_file"
echo -e "${green}[✔] Cleaned domains saved to $cleaned_file${reset}"

mkdir -p sub_output

while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" || "$domain" =~ ^# ]] && continue 

    echo -e "${blue}========== Starting recon for $domain ==========${reset}"
    echo -e "Recon Summary Report - $(date)\n" >> "$summary_file"
    echo -e "\n=== $domain ===" >> "$summary_file"
    domain_dir="sub_output/$domain"
    mkdir -p "$domain_dir"

    ####################### FAVICON + HASH #######################
    echo -e "${yellow}[*] Extracting favicon hash from https://$domain ...${reset}"
    full_url="https://$domain"
    favicon_output="$domain_dir/favicon_output"

    hash=$(python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/favienum.py "$full_url" | tee "$favicon_output" | grep -oP 'Hash: \K\S+')

    if [[ -n "$hash" ]]; then
        echo "$hash" > "$domain_dir/favicon_hash"
        echo -e "${green}[✔] Favicon hash: $hash${reset}"
        echo "Favicon hash: $hash" >> "$summary_file"
    else
        echo -e "${red}[✘] Favicon hash not found.${reset}"
        echo "Favicon hash: not found" >> "$summary_file"
    fi

    if [[ -f favicon.ico ]]; then
        mv favicon.ico "$domain_dir/"
        echo -e "${green}[✔] Saved favicon.ico${reset}"
    else
        echo -e "${yellow}[!] favicon.ico not downloaded.${reset}"
    fi

    ####################### SUBDOMAIN ENUM #######################
    echo -e "${yellow}[*] Running subdomain enumeration tools for $domain...${reset}"
  #  Uncomment if needed
    echo -e "${yellow}[*] Running amass active tools for $domain...${reset}"
    amass enum -active -d "$domain" | awk '{print $1}' >> "$domain_dir/amass_active.txt"
    echo -e "${yellow}[*] Running  amass passive for $domain...${reset}"
    amass enum -passive -d "$domain" | awk '{print $1}' >>  "$domain_dir/amass_passive.txt"
    echo -e "${yellow}[*] Running subfinder for $domain...${reset}"
    subfinder -d "$domain" -all -recursive -o "$domain_dir/subfinder.txt"
    echo -e "${yellow}[*] Running assetfinder for $domain...${reset}"
    assetfinder --subs-only "$domain" > "$domain_dir/assetfinder.txt"
    echo -e "${yellow}[*] Running sublist3r for $domain...${reset}"
    sublist3r -d "$domain" -o "$domain_dir/sublist3r.txt"
    echo -e "${yellow}[*] Running findomain for $domain...${reset}"
    findomain -t "$domain" -u "$domain_dir/findomain.txt" &
    echo -e "${yellow}[*] Running github for $domain...${reset}"
    github-subdomains -d "$domain" -t $gtoken -o "$domain_dir/github.txt" &
    echo -e "${yellow}[*] Running crt.sh for $domain...${reset}"
    curl -s "https://crt.sh/?q=%25.${domain}&output=json" |  jq -r '.[].name_value' |  sed 's/\*\.//g' |  sort -u |  sed 's/^/https:\/\//' > "$domain_dir/crtsh.txt"
    echo -e "${yellow}[*] Running st for $domain...${reset}"
    curl -s -H "APIKEY: $crtoken" "https://api.securitytrails.com/v1/domain/$domain/subdomains" | jq -r '.subdomains[]' > "$domain_dir/securitytrails_output.txt"
    cat "$domain_dir/securitytrails_output" | sed  -e "s/^/https:\/\//" -e "s/\$/.${domain}/" > "$domain_dir/security_trials_domains.txt"

    ####################### COMBINE SUBDOMAINS #######################
    echo -e "${yellow}[*] Combining subdomain results for $domain...${reset}"
    sub_files=("$domain_dir"/*.txt)

    if [[ ${#sub_files[@]} -gt 0 ]]; then
        cat "${sub_files[@]}" | sort -u > "$domain_dir/all_subdomains.txt"
        cat "$domain_dir/all_subdomains.txt" | sort -u -o "$domain_dir/all_subdomains.txt"
        total_subs=$(wc -l < "$domain_dir/all_subdomains.txt")
        echo -e "${green}[✔] Total unique subdomains found: $total_subs${reset}"
        total_subs=$(wc -l < "$domain_dir/all_subdomains.txt")
        echo "Total subdomains: $total_subs" >> "$summary_file"

    else
        echo "Total subdomains: 0" >> "$summary_file"
        echo -e "${yellow}[!] No subdomain files found for $domain.${reset}"
        # Do NOT continue here — let it continue to probe if you manually give domains
        touch "$domain_dir/all_subdomains.txt"
    fi


    ####################### LIVE SUBDOMAINS #######################
    echo -e "${yellow}[*] Probing live subdomains with httpx for $domain...${reset}"
    if [[ -s "$domain_dir/all_subdomains.txt" ]]; then
        time /usr/local/bin/httpx -l "$domain_dir/all_subdomains.txt" --timeout 2 -threads 200 -silent -o "$domain_dir/live_subdomains.txt" < /dev/null
         live_count=$(wc -l < "$domain_dir/live_subdomains.txt")
         echo -e "${green}[✔] Live subdomains: $live_count${reset}"
         echo "Live subdomains: $live_count" >> "$summary_file"
    else
        echo "Live subdomains: 0" >> "$summary_file"
        echo -e "${red}[✘] No subdomains to probe. Skipping httpx.${reset}"
        fi
    echo "[+] combining to all subdomians..."
    touch sub_output/all_live_subdomains.txt
    if [[ -s "$domain_dir/live_subdomains.txt" ]]; then
    cat "$domain_dir/live_subdomains.txt" >> sub_output/all_live_subdomains.txt
        fi

    ####################### IP EXTRACTION #######################
    echo "[+] ip address extraction..."
     if [[ -s "$domain_dir/live_subdomains.txt" ]]; then
         echo -e "${yellow}[*] Extracting IPs using dnsx for $domain...${reset}"
         dnsx -l "$domain_dir/live_subdomains.txt" -resp-only < /dev/null| tee "$domain_dir/ip.txt" 
         ip_count=$(wc -l < "$domain_dir/ip.txt")
         echo -e "${green}[✔] IPs extracted: $ip_count${reset}"
         echo "Extracted IPs: $ip_count" >> "$summary_file"
     else
         echo "Extracted IPs: No live subdomains found, skipping IP extraction." >> "$summary_file"
         echo -e "${yellow}[!] No live subdomains found, skipping IP extraction.${reset}"
         echo -e "${red}[x] IPs not extracted.."

     fi



    echo -e "${blue}========== Finished recon for $domain ==========\n${reset}"
    echo "--------------------------------------" >> "$summary_file"
    echo -e "${green}[✔] Summary saved to ${summary_file}${reset}"

done < "$cleaned_file"

echo -e "${green}[✔] Recon finished for all domains. Check the sub_output/ folder.${reset}"
