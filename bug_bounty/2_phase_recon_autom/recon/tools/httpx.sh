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
outdir="httpx_out"
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

#------------------general analysis using screenshot---------------------

echo " capturing screenshots........"
###python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/EyeWitness/Python/EyeWitness.py  -f "$input_file" -d "$outdir/screenshot_eyewitness" --no-prompt
cat "$input_file"  | aquatone -out "$outdir/screenshot_aquatone"

# ----------------- CATEGORIZATION ---------------------
echo "[+] filtering $input_file..."
httpx -silent -status-code -no-color -threads 200 < "$input_file" | tee "$outdir/raw_httpx.txt"

# Auth-protected (401/403)
grep -E "\[(401|403)\]" "$outdir/raw_httpx.txt" \
    | cut -d " " -f1 \
    | sort -u | tee "$outdir/auth_protected.txt"

# 4xx / 5xx status
grep -E "\[(400|401|403|500|501|502)\]" "$outdir/raw_httpx.txt" \
    | cut -d " " -f1 \
    | sort -u | anew "$outdir/4xx_5xx_status.txt"

# 404s
grep "\[404\]" "$outdir/raw_httpx.txt" \
    | cut -d " " -f1 \
    | sort -u | anew "$outdir/404_status.txt" 

# 2xx / 3xx status
grep -E "\[(200|201|202|203|204|205|206|207|208|301|302|307|308)\]" "$outdir/raw_httpx.txt" \
    | cut -d " " -f1 \
    | sort -u | anew "$outdir/2xx_3xx_status.txt"

# 301/302 redirects only
grep -E "\[(301|302)\]" "$outdir/raw_httpx.txt" \
    | cut -d " " -f1 \
    | sort -u | anew "$outdir/redirects.txt"

# Important subdomains
grep -E "admin|panel|portal|secure|dashboard|internal|api|stag|dev|priv|test|sam|dash" "$outdir/raw_httpx.txt" \
    | cut -d " " -f1 \
    | sort -u | anew "$outdir/important_subdomains.txt" 
    
# ------------- BACKUP SCAN ON REDIRECTS ---------------
if [[ -s "$outdir/redirects.txt" ]]; then
    echo -e "${yellow}[*] Running Nuclei for backups on redirects...${reset}"
    nuclei -l "$outdir/redirects.txt" \
       -t /home/maddy/nuclei-templates/http/exposures/backups \
       -c 40 -rl 400 -v \
       -severity info,low,medium,high,critical \
       -o "$outdir/nuclei_results_backup.txt"
    echo -e "${green}[✔] Nuclei backup scan done → nuclei_results_backup.txt${reset}"
else
    echo -e "${blue}[i] No 301/302 domains found for backup scanning${reset}"
fi

#-----------------------------------SOURCE CODE ANALYSIS------------------------------
#!/bin/bash

INPUT="$input_file"
OUTPUT="$outdir/sources-for-401-403-500.txt"

while read -r domain; do
    echo "[*] Checking $domain..."

    # Save raw HTML and status code
    response=$(curl -skL -A "Mozilla/5.0" -H "Accept: text/html" "$domain" -o temp_raw.html -w "%{http_code}")

    if [[ "$response" =~ ^(400|401|402|403|404|500|501|502)$ ]]; then
        echo "🔍 $domain responded with $response — saving formatted source"

        # Format using xmllint
        formatted=$(xmllint --html --format temp_raw.html 2>/dev/null)

        # If xmllint failed or gave empty output, try tidy
        if [[ -z "$formatted" && -x "$(command -v tidy)" ]]; then
            formatted=$(tidy -indent -quiet yes -wrap 0 temp_raw.html 2>/dev/null)
        fi

        # Save output
        echo -e "\n\n$domain ($response):\n$formatted" >> "$OUTPUT"
    fi
done < "$INPUT"

rm -f temp_raw.html
echo "[+] Done. Saved prettified HTML to $OUTPUT"

echo "[+] Done. Formatted sources saved to $OUTPUT"


echo -e "${green}[✔] All categorized results saved in ${outdir}${reset}"