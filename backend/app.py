from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "aBb2CgCd6fvaUm2HEQLrPeX55IaZwbzMlZpsqB0y"
API_BASE = "https://api.fda.gov/drug/label.json"

# Load drug list from local cache
with open("valid_drugs.json", "r") as f:
    drug_data = json.load(f)

# ✅ Serve pre-validated generic names
@app.route('/api/drugs')
def get_generic_drugs():
    return jsonify(drug_data.get("generic", []))

# ✅ Serve pre-validated brand names
@app.route('/api/brands')
def get_brand_names():
    return jsonify(drug_data.get("brand", []))

# ✅ Use live OpenFDA API for full drug info
@app.route('/api/drug/<name>')
def get_drug_info(name):
    try:
        # Use full query string (not just generic_name)
        url = f"{API_BASE}?search={name}&limit=1&api_key={API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        results = response.json().get("results")
        if results:
            return jsonify(results[0])
        return jsonify({"error": "No information found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Ensure it runs on port 5000