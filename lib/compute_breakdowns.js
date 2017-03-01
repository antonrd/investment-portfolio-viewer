class ComputeBreakdowns {

  constructor(stock_summaries, stocks) {
    this.stock_details = {};
    this.breakdown_totals = {};
    this.total_portfolio_value = 0.0;
    this.total_weighted_cost = 0.0;
    this.stock_summaries = stock_summaries;
    this.stocks = stocks;
  }

  getStockBreakdowns() {
    this._computeBreakdowns();
    return this.breakdown_totals;
  }

  _computeBreakdowns() {
    for (var i = 0; i < this.stocks.length; i++) {
      var stock = this.stocks[i];
      this.stock_details[stock.symbol] = stock;
    }

    for (var symbol in this.stock_summaries) {
      let matching_keys = this._getMatchingKeys(this.stock_details[symbol])
      this.total_portfolio_value += this.stock_summaries[symbol].total_value;
      this.total_weighted_cost += this.stock_summaries[symbol].weighted_cost;
      for (var i = 0; i < matching_keys.length; i++) {
        let key = matching_keys[i];
        this._addToKey(key, this.stock_summaries[symbol]);
      }
    }

    for (var symbol in this.breakdown_totals) {
      this.breakdown_totals[symbol].portion = this.breakdown_totals[symbol].total_value * 100.0 / this.total_portfolio_value;
    }
    if (this.breakdown_totals[Constants.STOCK_ALL] === undefined){
      this.breakdown_totals[Constants.STOCK_ALL] = { weighted_cost: this.total_weighted_cost };
    } else {
      this.breakdown_totals[Constants.STOCK_ALL].weighted_cost = this.total_weighted_cost;
    }
  }

  _getMatchingKeys(stock) {
    var keys = [];
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
      if (key in this.breakdown_totals) {
        this.breakdown_totals[key].total_value += stock_summary.total_value;
        this.breakdown_totals[key].unrealized_pl += stock_summary.unrealized_pl;
        if (!isNaN(stock_summary.realized_pl)){
          if (("realized_pl" in this.breakdown_totals[key])){
            this.breakdown_totals[key].realized_pl += stock_summary.realized_pl;
          } else {
            this.breakdown_totals[key].realized_pl = stock_summary.realized_pl;
          }
        }
      } else {
        this.breakdown_totals[key] = {
          total_value: stock_summary.total_value,
          unrealized_pl: stock_summary.unrealized_pl,
        }
        if (!isNaN(stock_summary.realized_pl)){
          this.breakdown_totals[key].realized_pl = stock_summary.realized_pl;
        }
      }
  }
};
