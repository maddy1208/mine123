import requests
import time
import urllib.parse
import sys

def load_dorks(filename):
    dorks = []
    with open(filename, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                dorks.append(line)
    return dorks

def load_tokens(token_file):
    with open(token_file, "r") as f:
        return [token.strip() for token in f if token.strip()]

def search_github_code(dork, token):
    headers = {"Authorization": f"token {token}"}
    encoded_dork = urllib.parse.quote(dork)
    url = f"https://api.github.com/search/code?q={encoded_dork}&per_page=30"
    response = requests.get(url, headers=headers)

    if response.status_code == 403:
        return None  # Rate limited or abuse detected

    elif response.status_code != 200:
        print(f"[!] Error {response.status_code} for dork: {dork}")
        return []

    return response.json().get("items", [])

def save_result_line(dork, result_count, file_path):
    with open(file_path, "a") as f:
        f.write(f"Dork: {dork} | Results: {result_count}\n")

def save_dork_url(dork, file_path):
    github_url = f"https://github.com/search?q={urllib.parse.quote(dork)}"
    with open(file_path, "a") as f:
        f.write(github_url + "\n")

def main():
    if len(sys.argv) != 3:
        print(f"Usage: python3 {sys.argv[0]} <dorks.txt> <tokens.txt>")
        sys.exit(1)

    dorks_file = sys.argv[1]
    tokens_file = sys.argv[2]
    output_results = "github_dork_results.txt"
    output_urls = "github_dork_urls.txt"

    dorks = load_dorks(dorks_file)
    tokens = load_tokens(tokens_file)

    if not tokens:
        print("[!] No tokens loaded. Exiting.")
        sys.exit(1)

    token_index = 0
    current_token = tokens[token_index]
    total_dorks = len(dorks)

    for idx, dork in enumerate(dorks, start=1):
        success = False
        while not success:
            print(f"[>] Dork {idx}/{total_dorks}: {dork}")
            results = search_github_code(dork, current_token)

            if results is None:
                print("[!] Rate limited or forbidden. Rotating token...")
                token_index += 1
                if token_index >= len(tokens):
                    print("[!] All tokens exhausted. Sleeping for 10 seconds...")
                    time.sleep(10)
                    token_index = 0
                current_token = tokens[token_index]
                time.sleep(0.8)
            else:
                result_count = len(results)
                if result_count > 0:
                    save_result_line(dork, result_count, output_results)
                    save_dork_url(dork, output_urls)
                    print(f"[+] Dork: {dork} | Results: {result_count}")
                else:
                    print(f"[-] Dork: {dork} | No results")
                success = True
                time.sleep(0.8)

    print(f"[+] Done. Non-zero results saved to {output_results} and {output_urls}")

if __name__ == "__main__":
    main()

