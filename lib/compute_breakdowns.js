var ComputeBreakdowns = {
  stock_details: {},
  breakdown_totals: {},
  total_portfolio_value: 0.0,
  total_weighted_cost: 0.0,

  init: function(stock_summaries, stocks) {
    this.stock_details = {};
    this.breakdown_totals = {};
    this.total_portfolio_value = 0.0;
    this.total_weighted_cost = 0.0;

    for (var i = 0; i < stocks.length; i++) {
      var stock = stocks[i];
      this.stock_details[stock.symbol] = stock;
    }

    for (var symbol in stock_summaries) {
      matching_keys = this.getMatchingKeys(this.stock_details[symbol])
      this.total_portfolio_value += stock_summaries[symbol].total_value;
      this.total_weighted_cost += stock_summaries[symbol].weighted_cost;
      for (var i = 0; i < matching_keys.length; i++) {
        key = matching_keys[i];
        this.addToKey(key, stock_summaries[symbol]);
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
  },

  getMatchingKeys: function(stock) {
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
  },

  addToKey: function(key, stock_summary) {
      if (key in this.breakdown_totals) {
        console.log(this.breakdown_totals);
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
  },

  getStockBreakdowns: function() {
    return this.breakdown_totals;
  }
};
