#!/bin/bash
set -e

# === Configurable Inputs ===
INPUT1="${1:-nuclei.txt}"                 # Default input: nuclei.txt
OUTPUT="${2:-nuclei-output-all.txt}"          # Default output: nuclei-output-all.txt
TEMP_DIR=$(mktemp -d)

# === Paths ===
INPUT="$TEMP_DIR/sorted_nuclei.txt"
TO_CHECK="$TEMP_DIR/for_check.txt"
TO_KEEP="$TEMP_DIR/skipped.txt"
URLS="$TEMP_DIR/check_urls.txt"
LIVE="$TEMP_DIR/live.txt"
FINAL_SORTED="$TEMP_DIR/sorted_final.txt"
LOG_FILE="nuclei_filter_log.txt"

# ✅ Vuln types for which 404 check should be performed
CHECK_VULNS=(
    "[CVE-2021-28164"
    "[CVE-2021-44848"
    "[akaunting-ssti"
    "[graphite-browser-default-credential"
    "[iis-shortname"
    "[jsbe"
    "[CVE-2016-6601"
    "[Express-LFR-GET"
    "[tongda_sqli2022"
    "[swagger-ui-config-url-injection-Extensive"
    "[jira-unauthenticated-user-picker"
    "[custom-splunk-info-disclose-detect"
    "[graphite-browser-default-credential"
    "[LFI"
    "[listserv-endpoint-detection"
    "[seaCMS-sqli"
    "[Shipped100-sqli"
    "[tongda_sqli2022"
    "[open-redirect-bypass"

)

# === Reset temp files ===
> "$TO_CHECK"
> "$TO_KEEP"
> "$URLS"
> "$LOG_FILE"

echo "[*] Sorting and processing input..."
sort -u "$INPUT1" > "$INPUT"

# === Phase 1: Split checkable vs non-checkable lines ===
echo "[*] Scanning lines for 404 check candidates..."
while IFS= read -r line; do
    first_field=$(echo "$line" | awk '{print $1}')  # e.g., [CVE-2021-28164:extra]

    matched=0
    for vuln in "${CHECK_VULNS[@]}"; do
        if [[ "$first_field" == "$vuln"* ]]; then
            matched=1
            break
        fi
    done

    if [[ $matched -eq 1 ]]; then
        echo "$line" >> "$TO_CHECK"
        echo "$line" | awk '{print $4}' >> "$URLS"
        echo "🔍 CHECK  $first_field → URL will be tested" | tee -a "$LOG_FILE"
    else
        echo "$line" >> "$TO_KEEP"
        echo "⚠️  SKIP   $first_field → kept without checking" | tee -a "$LOG_FILE"
    fi
done < "$INPUT"

# === Phase 2: Probe URLs ===
echo -e "\n[*] Probing unique URLs using httpx..."
sort -u "$URLS" | httpx -silent -mc 200,403,401,302,500,301  > "$LIVE"

# === Phase 3: Filter results ===
echo -e "\n[*] Filtering final results..."
> "$OUTPUT"
cat "$TO_KEEP" >> "$OUTPUT"

while IFS= read -r line; do
    url=$(echo "$line" | awk '{print $4}')
    if grep -Fxq "$url" "$LIVE"; then
        echo "✅ VALID  $url → keeping" | tee -a "$LOG_FILE"
        echo "$url"  | tee -a "$LOG_FILE"
        echo "$line" >> "$OUTPUT"
    else
        echo "❌ 404    $url → removing" | tee -a "$LOG_FILE"
        echo "$url"  | tee -a "$LOG_FILE"
    fi
done < "$TO_CHECK"

# Final sort to deduplicate output
sort -u "$OUTPUT" > "$FINAL_SORTED"
mv "$FINAL_SORTED" "$OUTPUT"

# === Final Summary ===
echo -e "\n[✓] Final cleaned output saved to: $OUTPUT"
echo "[📝] Log saved to: $LOG_FILE"

echo -e "\n[📊] Summary:"
echo "  🔍 Checked for 404 : $(wc -l < "$TO_CHECK")"
echo "  ✅ Valid URLs kept : $(grep -c '✅' "$LOG_FILE")"
echo "  ❌ 404s removed    : $(grep -c '❌' "$LOG_FILE")"
echo "  ⚠️  Skipped lines    : $(wc -l < "$TO_KEEP")"

# Cleanup
rm -rf "$TEMP_DIR"

