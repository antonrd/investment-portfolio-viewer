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
      for (let key_info of matching_keys) {
        this._addToKey(key_info, value);
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
    if (stock.is_us > 0.0) {
      yield {key: "US", ratio: stock.is_us};
      yield {key: "US" + stock.stock_type, ratio: stock.is_us};
    }

    if (stock.is_us < 1.0) {
      yield {key: "INT", ratio: 1 - stock.is_us};
      yield {key: "INT" + stock.stock_type, ratio: 1 - stock.is_us};
    }

    yield {key: stock.stock_type, ratio: 1.0};
    yield {key: Constants.STOCK_ALL, ratio: 1.0};
  }

  _addToKey(key_info, stock_summary) {
    if (this.breakdown_totals.has(key_info.key)) {
      this.breakdown_totals.get(key_info.key).buy_price += stock_summary.buy_price;
      this.breakdown_totals.get(key_info.key).total_value += stock_summary.total_value * key_info.ratio;
      this.breakdown_totals.get(key_info.key).unrealized_pl += stock_summary.unrealized_pl * key_info.ratio;
      if (!isNaN(stock_summary.realized_pl)){
        if ('realized_pl' in this.breakdown_totals.get(key_info.key)){
          this.breakdown_totals.get(key_info.key).realized_pl += stock_summary.realized_pl * key_info.ratio;
        } else {
          this.breakdown_totals.get(key_info.key).realized_pl = stock_summary.realized_pl * key_info.ratio;
        }
      }
    } else {
      this.breakdown_totals.set(key_info.key, {
        buy_price: stock_summary.buy_price,
        total_value: stock_summary.total_value * key_info.ratio,
        unrealized_pl: stock_summary.unrealized_pl * key_info.ratio
      });
      if (!isNaN(stock_summary.realized_pl)){
        this.breakdown_totals.get(key_info.key).realized_pl = stock_summary.realized_pl * key_info.ratio;
      }
    }
  }
};
