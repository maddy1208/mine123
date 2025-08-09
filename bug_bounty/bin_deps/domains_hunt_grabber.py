from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time
from concurrent.futures import ThreadPoolExecutor

def scrape_bugcrowd(index_url_tuple):
    index, url, selector, output_dir = index_url_tuple

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    output_file = os.path.join(output_dir, f"{index+1}.txt")

    try:
        print(f"[*] Processing: {url}")
        driver.get(url)
        time.sleep(5)  # allow JS to render content

        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, selector))
            )
        except:
            print(f"[-] Timeout waiting for endpoint elements on: {url}")

        elements = driver.find_elements(By.CSS_SELECTOR, selector)

        with open(output_file, "w", encoding="utf-8") as f:
            if elements:
                for el in elements:
                    content = el.text.strip()
                    if content:
                        f.write(content + "\n")
            else:
                f.write("NO DATA\n")

        print(f"[+] Saved {len(elements)} endpoints from: {url} → {output_file}")

    except Exception as e:
        print(f"[-] Error on {url}: {e}")
        with open("bugcrowd_failed.txt", "a") as errfile:
            errfile.write(url + "\n")
    finally:
        driver.quit()

def main():
    selector = "code.cc-rewards-link-table__endpoint"
    output_dir = "bugcrowd_outputs"

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"[+] Created output dir: {output_dir}")

    with open("bugcrowd_urls.txt", "r") as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"[*] Loaded {len(urls)} Bugcrowd URLs")

    tasks = [(i, url, selector, output_dir) for i, url in enumerate(urls)]

    with ThreadPoolExecutor(max_workers=3) as executor:
        executor.map(scrape_bugcrowd, tasks)

if __name__ == "__main__":
    main()

