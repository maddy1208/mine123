

import base64
import requests

# === Replace with your credentials ===
email = "thechampmaddy@gmail.com"
key = "9d68ac5bb14a772489c10941715c5f68"
dork = 'title="Liferay Portal"'

# === FOFA API URL ===
query = base64.b64encode(dork.encode()).decode()
url = f"https://fofa.info/api/v1/search/all?email={email}&key={key}&qbase64={query}&fields=host,ip,port&size=100"

# === Make the request ===
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    results = data.get("results", [])
    print(f"[+] Found {len(results)} results:\n")
    for entry in results:
        print(entry[0])  # Only domain (host)
else:
    print(f"[-] Error: {response.status_code} - {response.text}")
