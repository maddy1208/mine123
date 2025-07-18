#!/bin/bash

set -e
set -o pipefail

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "==========================================="
echo " 🔍 Domain Takeover Scanner"
echo "==========================================="

# Input
# -------------- Input Check --------------
if [[ $# -ne 1 || ! -f $1 ]]; then
    echo -e "${red}[✘] Usage: $0 domains.txt${reset}"
    exit 1
fi

DOMAINS="$1"
if [[ ! -f "$DOMAINS" ]]; then
  echo -e "${RED}[!] File not found: $DOMAINS${NC}"
  exit 1
fi

# Output files
CNAME_OUT="cname_found.txt"
POTENTIAL_TAKEOVER="potential_takeover.txt"
HTTPX_404="httpx_404.txt"

# Clean previous output
> "$CNAME_OUT"
> "$POTENTIAL_TAKEOVER"
> "$HTTPX_404"

# Step 1: Check for CNAME using dig
echo "[*] Checking CNAME records..."
while read -r sub; do
    cname=$(dig +short CNAME "$sub" | tr -d '\r')
    if [[ -n "$cname" ]]; then
        echo "$sub -> $cname" | tee -a "$CNAME_OUT"
    fi
done < "$DOMAINS"

# Step 2: Check for 404 or unusual responses with httpx
echo "[*] Probing HTTP responses using httpx..."
httpx -silent -status-code -content-length -follow-redirects -no-color -mc 404 -l "$DOMAINS" | tee "$HTTPX_404"

# Step 3: Match subs with both CNAME + 404 (possible takeover)
echo "[*] Filtering potential takeover candidates..."
while read -r line; do
    sub=$(echo "$line" | awk '{print $1}' | sed 's/https\?:\/\///')
    if grep -q "$sub" "$CNAME_OUT"; then
        echo -e "${RED}[!!] Possible Takeover: $sub${NC}" | tee -a "$POTENTIAL_TAKEOVER"
    fi
done < "$HTTPX_404"

echo "==========================================="
echo -e "${GREEN}[✓] Scan Complete${NC}"
echo "Saved:"
echo "- CNAMEs: $CNAME_OUT"
echo "- 404s: $HTTPX_404"
echo "- Potential Takeovers: $POTENTIAL_TAKEOVER"
