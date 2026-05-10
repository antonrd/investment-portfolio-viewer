// Used to compute the amounts invested per quarter/year and the received dividends
class ComputeInvestedAmountsDividends {

  constructor(trades, dividends) {
    this.trades = trades;
    this.dividends = dividends;
    this.today = new Date();


    this.investments_per_period = new Map();
  //   this.stock_buys = new Map();
  //   this.stock_sells = new Map();
  //   this.stock_summary = new Map();
  //   this.stock_events = new Map();
  //   this.stock_details = new Map();
  }

  getSummaries() {
    for (let trade of this.trades) {
      if (trade.action == 'SPLIT') continue;
      let quarter_key = this._getQuarterDateKey(trade.date);
      let spent_on_trade = trade.amount * trade.price;
      if (trade.action == 'SELL') spent_on_trade *= -1;
      this._updateWithKey(quarter_key, spent_on_trade, 0);

      let year_key = this._getYearDateKey(trade.date);
      this._updateWithKey(year_key, spent_on_trade, 0);
    }

    for (let dividend of this.dividends) {
      let quarter_key = this._getQuarterDateKey(dividend.date);
      this._updateWithKey(quarter_key, 0, dividend.dividend_amount);

      let year_key = this._getYearDateKey(dividend.date);
      this._updateWithKey(year_key, 0, dividend.dividend_amount);
    }

    return this.investments_per_period;
  }

  _getQuarterDateKey(trade_date) {
    return (trade_date.getYear() - 100) * 4 + Math.floor(trade_date.getMonth() / 3);
  }

  _getYearDateKey(trade_date) {
    return trade_date.getYear() + 1000;
  }

  _updateWithKey(key, spent, dividend) {
    if (this.investments_per_period.has(key)) {
      this.investments_per_period.get(key).total_spent += spent;
      this.investments_per_period.get(key).dividends += dividend;
    } else {
      this.investments_per_period.set(key, {
        total_spent: spent,
        dividends: dividend
      });
    }
  }
};
