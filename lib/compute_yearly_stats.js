// Computes per-year: amount invested (buys - sells), realized P/L, dividends received.
class ComputeYearlyStats {

  constructor(trades, dividends, stockSummaries, currencyRates) {
    this.trades = trades;
    this.dividends = dividends;
    this.stockSummaries = stockSummaries;
    this.currencyRates = currencyRates;
  }

  getYearlyStats() {
    const years = new Map();

    const ensure = (yr) => {
      if (!years.has(yr)) {
        years.set(yr, { invested: 0, realized_pl: 0, dividends: 0 });
      }
      return years.get(yr);
    };

    // Per-symbol: track running avg buy price and remaining amount for realized P/L
    const symState = new Map();

    for (let trade of this.trades) {
      if (trade.action === Constants.SPLIT) continue;

      const summary = this.stockSummaries.get(trade.symbol);
      const rate = summary ? (this.currencyRates[summary.currency] || 1) : 1;
      const yr = trade.date.getFullYear();
      const tradeValue = trade.amount * trade.price * rate;

      if (trade.action === Constants.BUY) {
        ensure(yr).invested += tradeValue;

        if (!symState.has(trade.symbol)) {
          symState.set(trade.symbol, { totalCost: 0, totalAmount: 0 });
        }
        const st = symState.get(trade.symbol);
        st.totalCost += tradeValue;
        st.totalAmount += trade.amount;

      } else if (trade.action === Constants.SELL) {
        ensure(yr).invested -= tradeValue;

        const st = symState.get(trade.symbol);
        if (st && st.totalAmount > 0) {
          const avgBuy = st.totalCost / st.totalAmount;
          const realizedPl = (trade.price * rate - avgBuy) * trade.amount;
          ensure(yr).realized_pl += realizedPl;
          st.totalCost -= avgBuy * trade.amount;
          st.totalAmount -= trade.amount;
        }
      }
    }

    for (let dividend of this.dividends) {
      const yr = dividend.date.getFullYear();
      ensure(yr).dividends += dividend.dividend_amount;
    }

    return new Map([...years.entries()].sort());
  }
}
