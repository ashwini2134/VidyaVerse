import sys

import requests

if len(sys.argv) != 2:
    sys.exit("Missing command-line argument")

try:
    amount = float(sys.argv[1])
except ValueError:
    sys.exit("Command-line argument is not a number")

try:
    response = requests.get("https://api.coincap.io/v2/assets/bitcoin")
    response.raise_for_status()
    data = response.json()
    price = float(data["data"]["priceUsd"])
except requests.RequestException:
    sys.exit("Error fetching Bitcoin price")

print(f"${amount * price:,.4f}")
