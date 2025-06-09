import requests
import json

API_BASE = "https://api.fda.gov/drug/label.json"

def fetch_valid_names(field):
    url = f"{API_BASE}?count=openfda.{field}.exact&limit=10000"
    response = requests.get(url)
    response.raise_for_status()
    raw_names = [item['term'] for item in response.json().get("results", [])]

    valid = []
    for name in raw_names:
        try:
            check_url = f"{API_BASE}?search=openfda.{field}:\"{name}\"&limit=1"
            r = requests.get(check_url)
            if r.status_code == 200 and r.json().get("results"):
                valid.append(name)
        except:
            continue

    return sorted(valid)

def save_to_file():
    generic = fetch_valid_names("generic_name")
    brand = fetch_valid_names("brand_name")

    with open("valid_drugs.json", "w") as f:
        json.dump({
            "generic": generic,
            "brand": brand
        }, f)

if __name__ == "__main__":
    save_to_file()
    print("✅ Saved valid_drugs.json")
