# Bitcoin Price Index

In a file called `bitcoin.py`, implement a program that:

- Expects the user to specify as a command-line argument the number of Bitcoins, `n`, that they would like to buy. If that argument cannot be converted to a `float`, the program should exit via `sys.exit` with an error message. If no argument is given, also exit with an error message.
- Queries an API for the current Bitcoin price (e.g. CoinCap at `https://api.coincap.io/v2/assets/bitcoin`), which returns a JSON object whose nested keys include the current price of Bitcoin as a `float`. Be sure to catch any `requests.RequestException`.
- Outputs the current cost of `n` Bitcoins in USD to four decimal places, using `,` as a thousands separator.

> Uses the third-party `requests` module (`pip install requests`).

## How to Test

- `python bitcoin.py` → exits with `Missing command-line argument`
- `python bitcoin.py cat` → exits with `Command-line argument is not a number`
- `python bitcoin.py 1` → prints the price of 1 BTC, e.g. `$38,761.0833`

```
check50 cs50/problems/2022/python/bitcoin
```
