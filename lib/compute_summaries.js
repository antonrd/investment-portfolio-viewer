class ComputeSummaries {

  constructor(stocks, trades, dividends) {
    this.stocks = stocks;
    this.trades = trades;
    this.dividends = dividends;
    this.total_portfolio_value = 0.0;
    this.today = new Date();


    this.stock_buys = {};
    this.stock_sells = {};
    this.stock_summary = {};
    this.stock_events = {};
    this.stock_details = {};
  }

  getStockSummaries() {
    this._collectStockDetails(this.stocks);
    this._collectStockEvents(this.dividends, this.trades);
    this._computeSummaries();
    return this.stock_summary;
  }

  _computeSummaries(){
    for (let i = 0; i < this.trades.length; i++) {
      let trade = this.trades[i];
      if (trade.action == Constants.BUY) {
        this._add_amount(trade.symbol, this.stock_buys, trade.amount, trade.price, trade.fees, trade.date);
      } else if (trade.action == Constants.SELL) {
        this._add_amount(trade.symbol, this.stock_sells, trade.amount, trade.price, -1 * trade.fees, trade.date);
      } else {
        console.error('Unknown trade action: ' + trade.action);
      }
    }

    this._computeDividendStats();

    for (let symbol in this.stock_details) {
      let buy_price = this._getStockBuyPrice(symbol);
      let buy_amount = this._getStockBuyAmount(symbol);
      let buy_price_days = this._getStockBuyPriceDays(symbol);
      let sell_price = this._getStockSellPrice(symbol);
      let sell_amount = this._getStockSellAmount(symbol);
      let sell_price_days = this._getStockSellPriceDays(symbol);
      if (buy_price == 0) {
        continue;
      }

      let avg_buy_price = buy_price / buy_amount;
      let avg_sell_price = sell_price / sell_amount;
      let realized_pl = (avg_sell_price - avg_buy_price) * sell_amount;
      let realized_pl_perc = realized_pl * 100 / (sell_amount * avg_buy_price);

      let left_amount = buy_amount - sell_amount;
      let unrealized_pl = left_amount * (this.stock_details[symbol].price - avg_buy_price);
      let unrealized_pl_perc = unrealized_pl * 100 / (left_amount * avg_buy_price);

      let total_value = left_amount * this.stock_details[symbol].price;
      let weighted_cost = (buy_price_days - sell_price_days) / 365.0;
      let weighted_pl = unrealized_pl * 100 / weighted_cost;

      let value_date = this.stock_details[symbol].price_date;
      let description = this.stock_details[symbol].description;
      let current_price = this.stock_details[symbol].price;
      let dividends_total = this.stock_events[symbol].dividends_total;
      let average_return = this.stock_events[symbol].average_return;
      let current_amount = left_amount;

      this.stock_summary[symbol] = {
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
      }

      this.total_portfolio_value += this.stock_summary[symbol].total_value;
    }

    for (let symbol in this.stock_summary) {
      this.stock_summary[symbol].portion = this.stock_summary[symbol].total_value * 100 / this.total_portfolio_value;
    }
  }

  _add_amount(symbol, collection, amount, price, fees, date) {
    let days_passed = (this.today - date) / (1000 * 60 * 60 * 24);
    if (symbol in collection) {
      collection[symbol].amount += amount;
      collection[symbol].price += amount * price + fees;
      collection[symbol].price_days += (amount * price + fees) * days_passed;
    } else {
      collection[symbol] = {
        amount: amount,
        price: amount * price + fees,
        price_days: (amount * price + fees) * days_passed
      };
    }
  }

  _getStockBuyAmount(symbol) {
    if (symbol in this.stock_buys) {
      return this.stock_buys[symbol].amount;
    } else {
      return 0;
    }
  }

  _getStockBuyPrice(symbol) {
    if (symbol in this.stock_buys) {
      return this.stock_buys[symbol].price;
    } else {
      return 0;
    }
  }

  _getStockBuyPriceDays(symbol) {
    if (symbol in this.stock_buys) {
      return this.stock_buys[symbol].price_days;
    } else {
      return 0;
    }
  }

  _getStockSellAmount(symbol) {
    if (symbol in this.stock_sells) {
      return this.stock_sells[symbol].amount;
    } else {
      return 0;
    }
  }

  _getStockSellPrice(symbol) {
    if (symbol in this.stock_sells) {
      return this.stock_sells[symbol].price;
    } else {
      return 0;
    }
  }

  _getStockSellPriceDays(symbol) {
    if (symbol in this.stock_sells) {
      return this.stock_sells[symbol].price_days;
    } else {
      return 0;
    }
  }

  _sortEvents(a,b) {
    return a.date - b.date;
  }

  _collectStockEvents() {
    for (let i = 0; i < this.dividends.length; i++){
      let dividend = this.dividends[i];
      if ( dividend.symbol in this.stock_events) {
        this.stock_events[dividend.symbol].push(dividend);
      } else {
        console.log(dividend.symbol + 'was not found in the portfolio!');
      }
    }

    for (let i = 0; i < this.trades.length; i++) {
      let trade = this.trades[i];
      if (trade.symbol in this.stock_events){
        this.stock_events[trade.symbol].push(trade);
      }
    }
  }

  _collectStockDetails() {
    for (let i = 0; i < this.stocks.length; i++) {
      let stock = this.stocks[i];
      this.stock_details[stock.symbol] = stock;
      this.stock_events[stock.symbol] = [];
    }
  }

  _computeDividendStats() {
    for (let symbol in this.stock_events){
      this.stock_events[symbol].sort(this._sortEvents);
      let stock_amount = 0;
      let dividends_total = 0;
      let buy_events = [];
      let today = this.today;
      let events = this.stock_events[symbol];

      for (let i = 0; i < events.length; i++){
        if (events[i].hasOwnProperty('action')){
          if (events[i].action == Constants.BUY) {
            stock_amount += events[i].amount;
            buy_events.push(events[i]);
          } else if (events[i].action == Constants.SELL){
            stock_amount -= events[i].amount;
          }
        } else {
          if (events[i].hasOwnProperty('dividend_amount')){
            dividends_total += stock_amount * events[i].dividend_amount;
          }
        }
      }
      let average_return = this._computeAverageReturn(today, buy_events, dividends_total);
      this.stock_events[symbol] = {dividends_total: dividends_total};
      this.stock_events[symbol].average_return = average_return;
    }
  }

  _computeAverageReturn(today, buy_events, dividends_total) {
    let days_passed = (today - buy_events[0].date) / (1000 * 60 * 60 * 24);
    let years = days_passed / 365;
    if (years < 1 || dividends_total == 0) {
      return 'N/A';
    } else {
      return dividends_total / years;
    }
  }
};
