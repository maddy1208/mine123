#!/bin/bash

# ---------------- Colors ----------------
green='\033[1;32m'
red='\033[1;31m'
blue='\033[1;34m'
reset='\033[0m'

# Check if the script is being run as root
if [ "$EUID" -ne 0 ]; then
  echo "[!] Please run this script using sudo: sudo ./recon.sh"
  exit 1
fi

echo "[*] Running with root privileges..."
# -------------- Input Check --------------
if [[ $# -ne 1 || ! -f $1 ]]; then
    echo -e "${red}[✘] Usage: $0 domains.txt${reset}"
    exit 1
fi

DOMAINS_FILE="$1"
TOOL1_OUTPUT="sub_output"

echo -e "${blue}[i] Running TOOL1 on $DOMAINS_FILE...${reset}"
# -------- TOOL 1 --------
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/tools/subdomain_finder.sh "$DOMAINS_FILE"

# Check TOOL1 success
if [[ ! -d "$TOOL1_OUTPUT" ]]; then
    echo -e "${red}[✘] TOOL1 failed or $TOOL1_OUTPUT not found.${reset}"
    exit 1
fi

# -------- Process Each Domain Folder --------
for domain_folder in "$TOOL1_OUTPUT"/*; do
    # Skip if it's one of the known global files
    basename="$(basename "$domain_folder")"
    if [[ "$basename" == "summary_report.txt" || "$basename" == "all_live_subdomains.txt" ]]; then
        continue
    fi

    # Skip non-directories just in case
    if [[ ! -d "$domain_folder" ]]; then
        continue
    fi

    domain="$basename"
    domain_output_dir="./$domain"
    mkdir -p "$domain_output_dir"

    # Copy live_domains.txt
    if [[ -f "$domain_folder/live_subdomains.txt" ]]; then
        cp "$domain_folder/live_subdomains.txt" "$domain_output_dir/"
    else
        echo -e "${red}[!] live_domains.txt missing for $domain. Skipping...${reset}"
        continue
    fi

    echo -e "${green}[+] Starting tools for $domain...${reset}"

    # -------- Navigate and Run Tools --------
     cd "$domain_output_dir" || continue

    echo -e "${blue}[*] Running httpx...${reset}"
    /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/tools/httpx.sh "live_subdomains.txt"

    echo -e "${blue}[*] Running url enum & filtering...${reset}"
    /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/tools/urlfinder.sh "live_subdomains.txt"

    echo -e "${blue}[*] Running dir bruteforce...${reset}"
    /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/tools/dir_finder.sh "live_subdomains.txt"
    
    echo -e "${blue}[*] Running JS recon...${reset}"
    cp ./urls_out/urls/all_urls.txt ./all_urls.txt

    sudo /home/maddy/techiee/bug_bounty/2_phase_recon_autom/recon/js_recon/recon.sh 
    
    

    echo -e "${green}[✓] Completed $domain${reset}"
    
    echo "--------------------------------------------------------------------------------------------------------------------------------"
    echo "------------------------------------------AUTOMATION STARTS--------------------------------------------------------------------------------------"
    
    echo -e "${blue}[*] Running cves testing...${reset}"
    /home/maddy/techiee/bug_bounty/2_phase_recon_autom/general/cves/cve.sh "live_subdomains.txt"
    
    mkdir aut1_res
    cp live_subdomains.txt aut1_res/
    cd aut1_res
    echo -e "${blue}[+] Automation 1 starting...${reset}"
    /home/maddy/techiee/bug_bounty/2_phase_recon_autom/automation/k_automation/testing.sh  ../live_subdomains.txt 
    
    cd ../
    cp ./jsrecon/livejs.txt ./livejs.txt
    echo -e "${blue} [+] original automation starts....${reset}"
    /home/maddy/techiee/bug_bounty/2_phase_recon_autom/automation/automation.sh
    echo -e "${blue} [+] original automation completed....${reset}"
    
    #remove files

    echo "[+] removing unwanted files..."
    find ./ -type f -empty
    find ./ -type f -empty -delete
    sudo rm -rf ../config ../cleaned_domains.txt geckodriver.log

    
   
done

echo -e "${green}[✓] Recon Complete for all domains.${reset}"

