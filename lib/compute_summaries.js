class ComputeSummaries {

  constructor(stocks, trades, dividends) {
    this.stocks = stocks;
    this.trades = trades;
    this.dividends = dividends;
    this.total_portfolio_value = 0.0;
    this.today = new Date();


    this.stock_buys = new Map();
    this.stock_sells = new Map();
    this.stock_summary = new Map();
    this.stock_events = new Map();
    this.stock_details = new Map();
  }

  getStockSummaries() {
    this._collectStockDetails(this.stocks);
    this._collectStockEvents(this.dividends, this.trades);
    this._computeSummaries();
    return this.stock_summary;
  }

  _computeSummaries(){
    for (let trade of this.trades) {
      if (trade.action == Constants.BUY) {
        this._add_amount(trade.symbol, this.stock_buys, trade.amount, trade.price, trade.fees, trade.date);
      } else if (trade.action == Constants.SELL) {
        this._add_amount(trade.symbol, this.stock_sells, trade.amount, trade.price, -1 * trade.fees, trade.date);
      } else {
        console.error(`Unknown trade action: ${trade.action}`);
      }
    }

    this._computeDividendStats();

    for (let [key, value] of this.stock_details) {
      let buy_price = this._getStockBuyPrice(key);
      let buy_amount = this._getStockBuyAmount(key);
      let buy_price_days = this._getStockBuyPriceDays(key);
      let sell_price = this._getStockSellPrice(key);
      let sell_amount = this._getStockSellAmount(key);
      let sell_price_days = this._getStockSellPriceDays(key);
      if (buy_price == 0) {
        continue;
      }

      let avg_buy_price = buy_price / buy_amount;
      let avg_sell_price = sell_price / sell_amount;
      let realized_pl = (avg_sell_price - avg_buy_price) * sell_amount;
      let realized_pl_perc = realized_pl * 100 / (sell_amount * avg_buy_price);

      let left_amount = buy_amount - sell_amount;
      let unrealized_pl = left_amount * (value.price - avg_buy_price);
      let unrealized_pl_perc = unrealized_pl * 100 / (left_amount * avg_buy_price);

      let total_value = left_amount * value.price;
      let weighted_cost = (buy_price_days - sell_price_days) / 365.0;
      let weighted_pl = unrealized_pl * 100 / weighted_cost;

      let value_date = value.price_date;
      let description = value.description;
      let current_price = value.price;
      let dividends_total = this.stock_events.get(key).dividends_total;
      let average_return = this.stock_events.get(key).average_return;
      let current_amount = left_amount;

      this.stock_summary.set(key, {
        description,
        current_price,
        avg_buy_price,
        avg_sell_price,
        realized_pl,
        realized_pl_perc,
        unrealized_pl,
        unrealized_pl_perc,
        current_amount,
        total_value,
        value_date,
        weighted_cost,
        weighted_pl,
        dividends_total,
        average_return
      });

      this.total_portfolio_value += this.stock_summary.get(key).total_value;
    }

    for (let [key, value] of this.stock_summary) {
      value.portion = value.total_value * 100 / this.total_portfolio_value;
    }
  }

  _add_amount(symbol, collection, amount, price, fees, date) {
    let days_passed = (this.today - date) / (1000 * 60 * 60 * 24);
    if (collection.has(symbol)) {
      collection.get(symbol).amount += amount;
      collection.get(symbol).price += amount * price + fees;
      collection.get(symbol).price_days += (amount * price + fees) * days_passed;
    } else {
      collection.set(symbol, {
        amount: amount,
        price: amount * price + fees,
        price_days: (amount * price + fees) * days_passed
      });
    }
  }

  _getStockBuyAmount(symbol) {
    if (this.stock_buys.has(symbol)) {
      return this.stock_buys.get(symbol).amount;
    } else {
      return 0;
    }
  }

  _getStockBuyPrice(symbol) {
    if (this.stock_buys.has(symbol)) {
      return this.stock_buys.get(symbol).price;
    } else {
      return 0;
    }
  }

  _getStockBuyPriceDays(symbol) {
    if (this.stock_buys.has(symbol)) {
      return this.stock_buys.get(symbol).price_days;
    } else {
      return 0;
    }
  }

  _getStockSellAmount(symbol) {
    if (this.stock_sells.has(symbol)) {
      return this.stock_sells.get(symbol).amount;
    } else {
      return 0;
    }
  }

  _getStockSellPrice(symbol) {
    if (this.stock_sells.has(symbol)) {
      return this.stock_sells.get(symbol).price;
    } else {
      return 0;
    }
  }

  _getStockSellPriceDays(symbol) {
    if (this.stock_sells.has(symbol)) {
      return this.stock_sells.get(symbol).price_days;
    } else {
      return 0;
    }
  }

  _sortEvents(a,b) {
    return a.date - b.date;
  }

  _collectStockEvents() {
    for (let dividend of this.dividends){
      if (this.stock_events.has(dividend.symbol)) {
        this.stock_events.get(dividend.symbol).push(dividend);
      } else {
        console.log(`${dividend.symbol} was not found in the portfolio!`);
      }
    }

    for (let trade of this.trades) {
      if (this.stock_events.has(trade.symbol)){
        this.stock_events.get(trade.symbol).push(trade);
      }
    }
  }

  _collectStockDetails() {
    for (let stock of this.stocks) {
      this.stock_details.set(stock.symbol, stock);
      this.stock_events.set(stock.symbol, []);
    }
  }

  _computeDividendStats() {
    for (let [key, value] of this.stock_events){
      value.sort(this._sortEvents);
      let stock_amount = 0;
      let dividends_total = 0;
      let today = this.today;
      let events = value;
      let first_buy = events.find(this.getFirsBuy);

      for (let event of events){
        if (event.hasOwnProperty('action')){
          if (event.action == Constants.BUY) {
            stock_amount += event.amount;
          } else if (event.action == Constants.SELL){
            stock_amount -= event.amount;
          }
        } else {
          if (event.hasOwnProperty('dividend_amount')){
            dividends_total += stock_amount * event.dividend_amount;
          }
        }
      }
      let average_return = this._computeAverageReturn(today, first_buy, dividends_total);
      value.dividends_total = dividends_total;
      value.average_return = average_return;
    }
  }

  _computeAverageReturn(today, first_buy, dividends_total) {
    let days_passed = (today - first_buy.date) / (1000 * 60 * 60 * 24);
    let years = days_passed / 365;
    if (years < 1 || dividends_total == 0) {
      return 'N/A';
    } else {
      return dividends_total / years;
    }
  }

  getFirsBuy(event) {
    return event.action == "BUY";
  }
};
