class ComputeBreakdowns {

  constructor(stock_summaries, stocks) {
    this.total_portfolio_value = 0.0;
    this.total_weighted_cost = 0.0;
    this.stock_summaries = stock_summaries;
    this.stocks = stocks;

    this.stock_details = new Map();
    this.breakdown_totals = new Map();
  }

  getStockBreakdowns() {
    this._computeBreakdowns();
    return this.breakdown_totals;
  }

  _computeBreakdowns() {
    for (let stock of this.stocks) {
      this.stock_details.set(stock.symbol, stock);
    }

    for (let symbol in this.stock_summaries) {
      let matching_keys = this._getMatchingKeys(this.stock_details.get(symbol))
      this.total_portfolio_value += this.stock_summaries[symbol].total_value;
      this.total_weighted_cost += this.stock_summaries[symbol].weighted_cost;
      for (let key of matching_keys) {
        this._addToKey(key, this.stock_summaries[symbol]);
      }
    }

    for (let [key, value] of this.breakdown_totals) {
      value.portion = value.total_value * 100.0 / this.total_portfolio_value;
    }

    this.breakdown_totals.get(Constants.STOCK_ALL).weighted_cost = this.total_weighted_cost;
  }

  _getMatchingKeys(stock) {
    let keys = [];
    if (stock.is_us) {
      keys.push("US");
    } else {
      keys.push("INT");
    }

    keys.push(stock.stock_type);
    keys.push(keys[0] + keys[1]);
    keys.push(Constants.STOCK_ALL);

    return keys;
  }

  _addToKey(key, stock_summary) {
    if (this.breakdown_totals.has(key)) {
      this.breakdown_totals.get(key).total_value += stock_summary.total_value;
      this.breakdown_totals.get(key).unrealized_pl += stock_summary.unrealized_pl;
      if (!isNaN(stock_summary.realized_pl)){
        if ('realized_pl' in this.breakdown_totals.get(key)){
          this.breakdown_totals.get(key).realized_pl += stock_summary.realized_pl;
        } else {
          this.breakdown_totals.get(key).realized_pl = stock_summary.realized_pl;
        }
      }
    } else {
      this.breakdown_totals.set(key, {
        total_value: stock_summary.total_value,
        unrealized_pl: stock_summary.unrealized_pl
      });
      if (!isNaN(stock_summary.realized_pl)){
        this.breakdown_totals.get(key).realized_pl = stock_summary.realized_pl;
      }
    }
  }
};
