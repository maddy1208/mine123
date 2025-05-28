#!/bin/bash

# ----------------------- COLORS -----------------------
blue='\033[1;34m'
green='\033[1;32m'
yellow='\033[1;33m'
red='\033[1;31m'
reset='\033[0m'

# ------------------- INPUT CHECK ----------------------
input_file="$1"
if [[ ! -f "$input_file" ]]; then
    echo -e "${red}[✘] Usage: $0 <live_domains.txt>${reset}"
    exit 1
fi

# ------------------- OUTPUT SETUP ---------------------
base_name=$(basename "$input_file")
domain=$(echo "$base_name" | cut -d'.' -f1)
outdir="httpx/${domain}"
mkdir -p "$outdir"

# ------------------- WAF DETECTION --------------------
echo -e "${yellow}[*] Running WAF detection with wafw00f...${reset}"
wafw00f -i "$input_file" -o "$outdir/wafs.txt"
echo -e "${green}[✔] WAF detection complete → wafs.txt${reset}"

# ----------- HTTPX & TECH STACK ANALYSIS --------------
echo -e "${yellow}[*] Running HTTPX tech stack analysis...${reset}"
/usr/local/bin/httpx -l "$input_file" \
      -ports 80,443,8000,8009,8080,8081,8090,8180,8443,8888 \
      -threads 200 \
      -random-agent \
      -x GET,POST \
      -tech-detect \
      -status-code \
      -follow-redirects \
      -title \
      -content-length \
      -ip \
      -server \
      -wc | tee "$outdir/httpx_results.txt"

echo -e "${green}[✔] httpx scan complete → saved to httpx_results.txt${reset}"

# ----------------- DIR LISTING FIND -------------------
grep -i "Index of /" "$outdir/httpx_results.txt" | anew "$outdir/index_pages.txt" >/dev/null
if [[ -s "$outdir/index_pages.txt" ]]; then
    echo -e "${red}[!] Possible Directory Listing Found! → index_pages.txt${reset}"
fi

# ------------- BACKUP SCAN ON REDIRECTS ---------------
cat "$outdir/httpx_results.txt" | grep -E "301|302" | awk '{print $1}' | anew "$outdir/redirects.txt" >/dev/null
if [[ -s "$outdir/redirects.txt" ]]; then
    echo -e "${yellow}[*] Running Nuclei for backups on redirects...${reset}"
    nuclei -l "$outdir/redirects.txt" \
       -t /home/maddy/nuclei-templates/http/exposures/backups \
       -c 40 -rl 400 -v \
       -severity info,low,medium,high,critical \
       -o "$outdir/nuclei_results_backup.txt"
    echo -e "${green}[✔] Nuclei backup scan done → nuclei_results_backup.txt${reset}"
else
    echo -e "${blue}[i] No 301/302 redirects found for backup scanning${reset}"
fi

#------------------general analysis using screenshot---------------------

echo " capturing screenshots........"
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/EyeWitness/Python/EyeWitness.py  -f "$input_file" -d "$outdir/screenshot_eyewitness"
cat "$input_file"  | aquatone -out "$outdir/screenshot_aquatone"


# ----------------- CATEGORIZATION ---------------------
# Important subdomains
grep -E "admin|panel|portal|secure|dashboard|internal|api|stag|dev|priv|test|sam|dash" "$outdir/httpx_results.txt" \
    | anew "$outdir/important_subdomains.txt" >/dev/null
echo -e "${green}[*] Saved potentially important subdomains to important_subdomains.txt${reset}"

# 4xx / 5xx status
grep -E "4[0-9]{2}|5[0-9]{2}" "$outdir/httpx_results.txt" | awk '{print $1}' \
    | anew "$outdir/4xx_5xx_status.txt" >/dev/null

# 404s
grep -E "404" "$outdir/httpx_results.txt" | awk '{print $1}' \
    | anew "$outdir/404_status.txt" >/dev/null

# 2xx / 3xx for good responses
grep -E "2[0-9]{2}|3[0-9]{2}" "$outdir/httpx_results.txt" | awk '{print $1}' \
    | anew "$outdir/2xx_3xx_status.txt" >/dev/null

echo -e "${green}[✔] All categorized results saved in ${outdir}${reset}"

