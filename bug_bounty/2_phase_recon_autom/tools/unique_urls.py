import urllib.parse
import sys

def normalize_url(url):
    parsed = urllib.parse.urlparse(url)

    # Normalize query parameter keys (ignore values)
    query_params = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
    query_keys = sorted(set(k for k, _ in query_params))
    query_key = '&'.join(query_keys)

    # Normalize path: replace the last segment with 'ID' (no assumptions)
    path_parts = parsed.path.strip('/').split('/')
    if path_parts:
        path_parts[-1] = 'ID'
    normalized_path = '/' + '/'.join(path_parts)

    # Create a deduplication key
    key = f"{parsed.netloc}{normalized_path}?{query_key}"
    return key

if len(sys.argv) != 2:
    print(f"Usage: python3 {sys.argv[0]} <input_file>")
    sys.exit(1)

input_file = sys.argv[1]
unique_urls = {}

with open(input_file, "r") as f:
    for line in f:
        url = line.strip()
        if not url:
            continue
        key = normalize_url(url)
        if key not in unique_urls:
            unique_urls[key] = url

with open("unique_urls.txt", "w") as f:
    for url in unique_urls.values():
        f.write(url + "\n")

print("[+] Deduplication complete. Saved to 'unique_urls.txt'")

