class ComputeBreakdowns {

  constructor(stock_summaries, stocks) {
    this.total_portfolio_value = 0.0;
    this.total_weighted_cost = 0.0;
    this.total_dividends = 0.0;
    this.total_cost_of_sold_shares = 0.0;
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

    for (let [key, value] of this.stock_summaries) {
      this.total_portfolio_value += value.total_value;
      this.total_weighted_cost += value.weighted_cost;
      this.total_dividends += value.dividends_total;
      this.total_cost_of_sold_shares += value.cost_of_sold_shares;

      let matching_keys = this._getMatchingKeys(this.stock_details.get(key))
      for (let key of matching_keys) {
        this._addToKey(key, value);
      }
    }

    for (let [key, value] of this.breakdown_totals) {
      value.portion = value.total_value * 100.0 / this.total_portfolio_value;
    }

    this.breakdown_totals.get(Constants.STOCK_ALL).weighted_cost = this.total_weighted_cost;
    this.breakdown_totals.get(Constants.STOCK_ALL).total_dividends = this.total_dividends;
    this.breakdown_totals.get(Constants.STOCK_ALL).total_cost_of_sold_shares = this.total_cost_of_sold_shares;
  }

  *_getMatchingKeys(stock) {
    let key = "";
    if (stock.is_us) {
      key = "US";
    } else {
      key = "INT";
    }

    yield key;
    yield stock.stock_type;
    yield (key + stock.stock_type);
    yield Constants.STOCK_ALL;

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
