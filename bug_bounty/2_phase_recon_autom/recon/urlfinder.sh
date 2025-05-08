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

# Create output directories
OUTPUT_DIR="output"
URLS_FILE="$OUTPUT_DIR/urls/all_urls.txt"
FILTERED_DIR="$OUTPUT_DIR/filtered"
mkdir -p "$OUTPUT_DIR/urls"
mkdir -p "$FILTERED_DIR"

# Passive URL Enumeration
function passive_enumeration() {
    print_msg "blue" "🔍 Starting Passive URL Enumeration..."

    # Waymore
    print_msg "yellow" "Running waymore..."
    waymore -i live-domains.txt -mode U -oU "$OUTPUT_DIR/urls/waymore_output.txt"
    print_msg "green" "Waymore finished. URLs saved to waymore_output.txt."

    # GAU
    print_msg "yellow" "Running GAU..."
    cat live-domains.txt | gau | anew "$OUTPUT_DIR/urls/gau_urls.txt"
    print_msg "green" "GAU finished. URLs saved to gau_urls.txt."

    # Waybackurls
    print_msg "yellow" "Running Waybackurls..."
    cat live-domains.txt | waybackurls | anew "$OUTPUT_DIR/urls/wayback_urls.txt"
    print_msg "green" "Waybackurls finished. URLs saved to wayback_urls.txt."

    # URLFinder
    print_msg "yellow" "Running URLFinder..."
    cat live-domains.txt | xargs -I {} urlfinder -d {} -o "$OUTPUT_DIR/urls/urlfinder.txt"
    print_msg "green" "URLFinder finished. URLs saved to urlfinder.txt."
}

# Active URL Crawling
function active_crawling() {
    print_msg "blue" "🛠 Starting Active Crawling..."

    # Gospider
    print_msg "yellow" "Running Gospider..."
    cat live-domains.txt | xargs -I {} gospider -S {} -o "$OUTPUT_DIR/urls/gospider_output" -d 3 -c 10 --js
    print_msg "green" "Gospider finished. URLs saved to gospider_output."

    # Katana
    print_msg "yellow" "Running Katana..."
    cat live-domains.txt | xargs -I {} katana -u https://{} -d 5 -o "$OUTPUT_DIR/urls/katana1_urls.txt"
    cat live-domains.txt | xargs -I {} katana -u https://{} -jc -d 5 -o "$OUTPUT_DIR/urls/katana2_urls.txt"
    print_msg "green" "Katana finished. URLs saved to katana1_urls.txt and katana2_urls.txt."
}

# Combine all URLs
function combine_urls() {
    print_msg "blue" "📌 Combining all found URLs..."

    cat "$OUTPUT_DIR/urls/waymore_output.txt" "$OUTPUT_DIR/urls/gau_urls.txt" "$OUTPUT_DIR/urls/wayback_urls.txt" \
        "$OUTPUT_DIR/urls/gospider_output" "$OUTPUT_DIR/urls/katana1_urls.txt" "$OUTPUT_DIR/urls/katana2_urls.txt" \
        | sort -u | anew "$URLS_FILE"

    print_msg "green" "Combining finished. All URLs saved to all_urls.txt."
}

# Categorizing Sensitive Info
function categorize_sensitive_info() {
    print_msg "blue" "🔒 Categorizing sensitive information..."

    print_msg "yellow" "Finding sensitive files..."
    cat "$URLS_FILE" | uro | grep -E '\.xls|\.xml|\.xlsx|\.json|\.pdf|\.sql|\.doc|\.docx|\.pptx|\.txt|\.zip|\.tar\.gz|\.tgz|\.bak|\.7z|\.rar|\.log|\.cache|\.secret|\.db|\.backup|\.yml|\.gz|\.config|\.csv|\.yaml|\.md|\.md5|\.exe|\.dll|\.bin|\.ini|\.bat|\.sh|\.tar|\.deb|\.git|\.env|\.rpm|\.iso|\.img|\.apk|\.msi|\.dmg|\.tmp|\.crt|\.pem|\.key|\.pub|\.asc' >> "$FILTERED_DIR/sens_files.txt"

    print_msg "yellow" "Finding LFI patterns..."
    grep -iE '=[^&]+/' "$URLS_FILE" >> "$FILTERED_DIR/lfi_testing.txt"
    grep -E "file=|path=|doc=|include=" "$URLS_FILE" >> "$FILTERED_DIR/lfi_testing.txt"

    print_msg "yellow" "Finding Open Redirect patterns..."
    grep -aiE '\|https?://[a-z0-9\.-]+\.mil/' "$URLS_FILE" | grep -i =http >> "$FILTERED_DIR/open_redir_testing.txt"

    print_msg "yellow" "Finding overall juicy/sensitive matches..."
    grep -aiE 'pass(d|ord)=[^&]+' "$URLS_FILE" >> "$FILTERED_DIR/juicy.txt"

    print_msg "yellow" "Finding IDOR patterns..."
    grep -Ei '([a-zA-Z0-9._-]+/(user|account|profile|id|order|invoice|admin|report|dashboard)/[0-9]+|[?&](id|user|account|order|invoice|admin|profile|report)=[0-9]+)' "$URLS_FILE" >> "$FILTERED_DIR/idor_testing.txt"

    print_msg "yellow" "Finding UUIDs..."
    grep -Ei '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}' "$URLS_FILE" | sort -u >> "$FILTERED_DIR/uuids_testing.txt"

    print_msg "yellow" "Finding JWT tokens..."
    grep "eyJ" "$URLS_FILE" >> "$FILTERED_DIR/jwt_testing.txt"

    print_msg "yellow" "Finding suspicious keys..."
    grep -Ei '([a-zA-Z0-9_-]{20,})' "$URLS_FILE" >> "$FILTERED_DIR/sus_key.txt"

    print_msg "yellow" "Finding SSNs..."
    grep -Ei '\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b' "$URLS_FILE" >> "$FILTERED_DIR/ssn.txt"

    print_msg "yellow" "Finding Credit Card Numbers..."
    grep -Ei '\b[0-9]{13,16}\b' "$URLS_FILE" >> "$FILTERED_DIR/credit.txt"

    print_msg "yellow" "Finding SessionIDs and Cookies..."
    grep -Ei '[a-zA-Z0-9]{32,}' "$URLS_FILE" >> "$FILTERED_DIR/sess_cook.txt"

    print_msg "yellow" "Finding common tokens/secrets..."
    grep -iE 'token|code|role|privilege|priv|secret|auth|id|admin|pass|pwd|passwd|password|phone|mobile|number|mail' "$URLS_FILE" >> "$FILTERED_DIR/possible_sensitive_urls.txt"

    print_msg "yellow" "Finding Private IPs..."
    grep -Ei '((10|172\.(1[6-9]|2[0-9]|3[0-1])|192\.168)\.[0-9]{1,3}\.[0-9]{1,3})' "$URLS_FILE" >> "$FILTERED_DIR/ip_priv.txt"

    print_msg "yellow" "Finding IPv4 addresses..."
    grep -Ei '([0-9]{1,3}\.){3}[0-9]{1,3}' "$URLS_FILE" >> "$FILTERED_DIR/ipv4.txt"

    print_msg "yellow" "Finding IPv6 addresses..."
    grep -Ei '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}' "$URLS_FILE" >> "$FILTERED_DIR/ipv6.txt"

    print_msg "yellow" "Finding payment-related keywords..."
    grep -iE 'payment|orderid|order|payid|invoice|pay|receipt|rupee|rs|dollar|amount' "$URLS_FILE" >> "$FILTERED_DIR/payment_keywords.txt"

    print_msg "green" "Sensitive information categorization finished."
}

# Execute all functions
print_msg "bold" "Starting URL Enumeration and Categorization..."
passive_enumeration
active_crawling
combine_urls
categorize_sensitive_info

print_msg "bold" "✅ Automation Complete! Check the output directories for results."

