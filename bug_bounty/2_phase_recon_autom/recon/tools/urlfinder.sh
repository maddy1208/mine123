#!/bin/bash

# Function to print messages in color
print_msg() {
    local color="$1"
    local msg="$2"
    case "$color" in
        "green") echo -e "\033[0;32m$msg\033[0m" ;;
        "blue") echo -e "\033[0;34m$msg\033[0m" ;;
        "yellow") echo -e "\033[1;33m$msg\033[0m" ;;
        "red") echo -e "\033[0;31m$msg\033[0m" ;;
        "bold") echo -e "\033[1m$msg\033[0m" ;;
        *) echo "$msg" ;;
    esac
}


# ------------------- INPUT CHECK ----------------------
live_domains="$1"
if [[ ! -f "$live_domains" ]]; then
    echo -e "${red}[✘] Usage: $0 <"live_domains.txt">${reset}"
    exit 1
fi


# Create output directories
OUTPUT_DIR="urls_out"
URLS_FILE="$OUTPUT_DIR/urls/all_urls.txt"
FILTERED_DIR="$OUTPUT_DIR/filtered"
mkdir -p "$OUTPUT_DIR/urls"
mkdir -p "$FILTERED_DIR"


# Passive URL Enumeration
function passive_enumeration() {
    print_msg "blue" "🔍 Starting Passive URL Enumeration..."

    #Waymore
    print_msg "yellow" "Running waymore..."
    waymore -i "$live_domains" -mode U -oU "$OUTPUT_DIR/urls/waymore_output.txt"
    print_msg "green" "Waymore finished. URLs saved to waymore_output.txt."

    # GAU
    print_msg "yellow" "Running GAU..."
    cat "$live_domains" | gau | anew "$OUTPUT_DIR/urls/gau_urls.txt"
    print_msg "green" "GAU finished. URLs saved to gau_urls.txt."

    # Waybackurls
    print_msg "yellow" "Running Waybackurls..."
    cat "$live_domains" | waybackurls | anew "$OUTPUT_DIR/urls/wayback_urls.txt"
    print_msg "green" "Waybackurls finished. URLs saved to wayback_urls.txt."

    #URLFinder
    print_msg "yellow" "Running URLFinder..."
    cat "$live_domains" |sed 's~https\?://~~' | xargs -I {} urlfinder -d {} -o "$OUTPUT_DIR/urls/urlfinder_urls.txt"
    print_msg "green" "URLFinder finished. URLs saved to urlfinder.txt."
 }

# Active URL Crawling
function active_crawling() {
    print_msg "blue" "🛠 Starting Active Crawling..."

    # Gospider
    print_msg "yellow" "Running Gospider..."
    gospider -S "$live_domains" -o "$OUTPUT_DIR/urls/gospider_output" -d 3 -c 10 --js < /dev/null
    print_msg "green" "Gospider finished. URLs saved to gospider_output/ per domain."

    # Katana
    print_msg "yellow" "Running Katana..."
    cat "$live_domains" | katana -list -d 5 -o "$OUTPUT_DIR/urls/katana1_urls.txt"
    cat "$live_domains" | katana -list -jc -d 5 -o "$OUTPUT_DIR/urls/katana2_urls.txt"

    print_msg "green" "Katana finished. URLs saved to katana1_urls.txt and katana2_urls.txt."
    
    # hakrawler
    print_msg "yellow" "Running hakrawler..."
    cat "$live_domains" | hakrawler -subs >>"$OUTPUT_DIR/urls/hakrawler_urls.txt"
    print_msg "green" "hakrawler finished. URLs saved to hakrawler_urls.txt"
    
      # gauplus
    print_msg "yellow" "Running gauplus..."
    cat "$live_domains" | gauplus >>"$OUTPUT_DIR/urls/gauplus_urls.txt"
    print_msg "green" "gauplus finished. URLs saved to gauplus_urls.txt"
}

# Combine all URLs
function combine_urls() {
    print_msg "blue" "📌 Combining all found URLs..."

    # Combine all tools' output
    cat "$OUTPUT_DIR/urls/waymore_output.txt" \
        "$OUTPUT_DIR/urls/gau_urls.txt" \
        "$OUTPUT_DIR/urls/wayback_urls.txt" \
        "$OUTPUT_DIR/urls/urlfinder_urls.txt" \
        "$OUTPUT_DIR/urls/gauplus_urls.txt" \
        $(find "$OUTPUT_DIR/urls/gospider_output" -type f) \
        "$OUTPUT_DIR/urls/katana1_urls.txt" \
        "$OUTPUT_DIR/urls/katana2_urls.txt" \
        "$OUTPUT_DIR/urls/hakrawler_urls.txt" \
        | sort -u | anew allurls

    # Run httpx only once and save full results
    httpx -silent -status-code -no-color -threads 200 < allurls | tee "$OUTPUT_DIR/urls/full_httpx_output.txt"

    # Filter valid (non-404/500/501)
    grep -Ev "\[(404|500|501)\]" "$OUTPUT_DIR/urls/full_httpx_output.txt" \
        | cut -d " " -f1 \
        | sort -u | tee "$URLS_FILE"

    # Filter auth-protected (401/403)
    grep -E "\[(401|403)\]" "$OUTPUT_DIR/urls/full_httpx_output.txt" \
        | cut -d " " -f1 \
        | sort -u | tee "$FILTERED_DIR/auth_protected.txt"
        
    auth_count=$(wc -l < "$FILTERED_DIR/auth_protected.txt" 2>/dev/null)
    print_msg "yellow" "🔐 Auth-Protected URLs (401/403): $auth_count"

    print_msg "green" "✅ Combining finished. All URLs saved to all_urls.txt."
    total=$(wc -l < allurls 2>/dev/null)
    valid=$(wc -l < "$URLS_FILE" 2>/dev/null)
    print_msg "green" "🎯 Total URLs: $total | Valid (non-404/500/501): $valid"

    rm -f allurls 
}


# Categorizing Sensitive Info
function categorize_sensitive_info() {
    cp /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/WayBackupFinder/extensions.txt ./extensions.txt
    cat "$live_domains" | sed 's~https\?://~~' > "oi"
    script -q -c "echo -e '2\noi\ncustom\n' | python3 /home/maddy/techiee/bug_bounty/2_phase_recon_autom/tools/WayBackupFinder/wayBackupFinder.py"  "$FILTERED_DIR/wayback_finder"
    rm -rf content/ oi extensions.txt

    print_msg "blue" "🔒 Categorizing sensitive information..."

    print_msg "yellow" "Finding sensitive files..."
    cat "$URLS_FILE" | uro | grep -iE '\.(xls|xml|xlsx|json|pdf|sql|doc|docx|pptx|txt|zip|tar\.gz|tgz|bak|7z|rar|log|cache|secret|db|backup|yml|gz|config|csv|yaml|md|md5|exe|dll|bin|ini|bat|sh|tar|deb|git|env|rpm|iso|img|apk|msi|dmg|tmp|crt|pem|key|pub|asc|p12|pfx|bak1|sql\.gz)' | anew "$FILTERED_DIR/sens_files.txt"

    print_msg "yellow" "Finding LFI patterns..."
    grep -iE '=[^&]+/' "$URLS_FILE"  | anew "$FILTERED_DIR/lfi_testing.txt"
    grep -E "file=|path=|doc=|include=" "$URLS_FILE"  | anew "$FILTERED_DIR/lfi_testing.txt"

    print_msg "yellow" "Finding Open Redirect patterns..."
    grep -aiE '\|https?://[a-z0-9\.-]+\.mil/' "$URLS_FILE" | grep -i =http  | anew  "$FILTERED_DIR/open_redir_testing.txt"

    print_msg "yellow" "Finding overall juicy/sensitive matches..."
    grep -aiE 'pass(d|ord)=[^&]+' "$URLS_FILE" | anew  "$FILTERED_DIR/juicy.txt"

    print_msg "yellow" "Finding IDOR patterns..."
    grep -Ei '([a-zA-Z0-9._-]+/(user|account|profile|id|order|invoice|admin|report|dashboard)/[0-9]+|[?&](id|user|account|order|invoice|admin|profile|report)=[0-9]+)' "$URLS_FILE"  | anew  "$FILTERED_DIR/idor_testing.txt"

    print_msg "yellow" "Finding UUIDs..."
    grep -Ei '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}' "$URLS_FILE"  | anew "$FILTERED_DIR/uuids_testing.txt"

    print_msg "yellow" "Finding JWT tokens..."
    grep "eyJ" "$URLS_FILE" | anew "$FILTERED_DIR/jwt_testing.txt"

    print_msg "yellow" "Finding suspicious keys..."
    grep -Ei '([a-zA-Z0-9_\-]{8,})=([a-zA-Z0-9_\-]{20,})' "$URLS_FILE"  | anew  "$FILTERED_DIR/sus_key.txt"

    print_msg "yellow" "Finding SSNs..."
    grep -Ei '\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b' "$URLS_FILE" | anew "$FILTERED_DIR/ssn.txt"

    print_msg "yellow" "Finding Credit Card Numbers..."
    grep -Ei '\b[0-9]{13,16}\b' "$URLS_FILE"  | anew  "$FILTERED_DIR/credit.txt"

    print_msg "yellow" "Finding SessionIDs and Cookies..."
    grep -Ei '[a-zA-Z0-9]{32,}' "$URLS_FILE" | anew  "$FILTERED_DIR/possible_sess_cook.txt"

    print_msg "yellow" "Finding common tokens/secrets..."
    grep -iE 'token|role|privilege|priv|secret|auth|id=|admin|pass|pwd|passwd|password|phone|mobile|number|mail' "$URLS_FILE"  | anew  "$FILTERED_DIR/possible_sensitive_urls.txt"

    print_msg "yellow" "Finding Private IPs..."
    grep -Ei '\b(10(\.[0-9]{1,3}){3}|172\.(1[6-9]|2[0-9]|3[0-1])(\.[0-9]{1,3}){2}|192\.168(\.[0-9]{1,3}){2})\b' "$URLS_FILE"  | anew  "$FILTERED_DIR/ip_priv.txt"

    print_msg "yellow" "Finding IPv4 addresses..."
    grep -Ei '([0-9]{1,3}\.){3}[0-9]{1,3}' "$URLS_FILE" | anew  "$FILTERED_DIR/ipv4.txt"

    print_msg "yellow" "Finding IPv6 addresses..."
    grep -Ei '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}' "$URLS_FILE"  | anew "$FILTERED_DIR/ipv6.txt"

    print_msg "yellow" "Finding payment-related keywords..."
    grep -iE '(\b(payment|orderid|order_id|payid|invoice|receipt|amount|price|total|cost|paid|rupee|rs|dollar)[=:\/]{1}[ ]?[a-zA-Z0-9._%-]{3,}\b)'  "$URLS_FILE"  | anew  "$FILTERED_DIR/payment_keywords.txt"

    print_msg "green" "Sensitive information categorization finished."
}

# Execute all functions
print_msg "bold" "Starting URL Enumeration and Categorization..."
passive_enumeration
active_crawling
combine_urls
categorize_sensitive_info


print_msg "bold" "✅ Automation Complete! Check the output directories for results."
