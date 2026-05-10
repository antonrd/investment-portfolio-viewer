#!/usr/bin/env python3
"""
Fetches current prices from Yahoo Finance for all actively held stocks
and updates stocks.csv in place. Positions with net zero holdings
(all bought shares have been sold) are skipped — their existing price
and date are preserved.

Usage:
    python tools/update_prices.py
    python tools/update_prices.py --stocks stocks.csv --trades trades.csv
"""

import argparse
import csv
import datetime
import time
import urllib.request
import json
import sys
from collections import defaultdict


def parse_args():
    p = argparse.ArgumentParser(description="Update stock prices in stocks.csv via Yahoo Finance")
    p.add_argument("--stocks", default="stocks.csv")
    p.add_argument("--trades", default="trades.csv")
    return p.parse_args()


def held_symbols(trades_file):
    """Return the set of symbols that still have a net positive position."""
    holdings = defaultdict(float)
    with open(trades_file, newline="") as f:
        for row in csv.DictReader(f):
            action = row["action"].strip().upper()
            symbol = row["symbol"].strip()
            amount = float(row["amount"])
            if action == "BUY":
                holdings[symbol] += amount
            elif action == "SELL":
                holdings[symbol] -= amount
    return {s for s, qty in holdings.items() if qty > 0}


def fetch_price(symbol):
    """Fetch the latest closing price from Yahoo Finance. Returns (price, date) or None."""
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=5d"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        result = data["chart"]["result"][0]
        closes = result["indicators"]["quote"][0]["close"]
        timestamps = result["timestamp"]
        for price, ts in zip(reversed(closes), reversed(timestamps)):
            if price is not None:
                date = datetime.date.fromtimestamp(ts).isoformat()
                return round(price, 2), date
    except Exception as e:
        print(f"  WARNING: could not fetch {symbol}: {e}", file=sys.stderr)
    return None


def update_stocks(stocks_file, active):
    rows = []
    with open(stocks_file, newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    updated = 0
    skipped = 0
    failed = 0

    for row in rows:
        symbol = row["symbol"].strip()
        if symbol not in active:
            skipped += 1
            continue

        print(f"  Fetching {symbol} ...", end=" ", flush=True)
        result = fetch_price(symbol)
        if result:
            price, date = result
            row["price"] = price
            row["price_date"] = date
            print(f"{price} ({date})")
            updated += 1
        else:
            print("FAILED — keeping existing price")
            failed += 1

        time.sleep(0.3)  # be gentle with the API

    with open(stocks_file, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return updated, skipped, failed


def main():
    args = parse_args()
    print(f"Reading trades from {args.trades} ...")
    active = held_symbols(args.trades)
    print(f"  {len(active)} symbols currently held: {', '.join(sorted(active))}\n")

    print(f"Updating prices in {args.stocks} ...")
    updated, skipped, failed = update_stocks(args.stocks, active)

    print(f"\nDone: {updated} updated, {skipped} skipped (not held), {failed} failed.")


if __name__ == "__main__":
    main()
