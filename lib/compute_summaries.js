var ComputeSummaries = {

  stock_buys: {},
  stock_sells: {},
  stock_summary: {},

  stock_details: {},
  total_portfolio_value: 0.0,

  today: new Date(),

  init: function(stocks, trades) {
    this.stock_buys = {};
    this.stock_sells = {};
    this.stock_summary = {};

    this.stock_details = {};
    this.total_portfolio_value = 0.0;

    for (var i = 0; i < trades.length; i++) {
      var trade = trades[i];
      if (trade.action == Constants.BUY) {
        this.add_amount(trade.symbol, this.stock_buys, trade.amount, trade.price, trade.fees, trade.date);
      } else if (trade.action == Constants.SELL) {
        this.add_amount(trade.symbol, this.stock_sells, trade.amount, trade.price, -1 * trade.fees, trade.date);
      } else {
        console.error('Unknown trade action: ' + trade.action);
      }
    }

    for (var i = 0; i < stocks.length; i++) {
      var stock = stocks[i];
      this.stock_details[stock.symbol] = stock;
    }

    for (var symbol in this.stock_details) {
      var buy_price = this.getStockBuyPrice(symbol);
      var buy_amount = this.getStockBuyAmount(symbol);
      var buy_price_days = this.getStockBuyPriceDays(symbol);
      var sell_price = this.getStockSellPrice(symbol);
      var sell_amount = this.getStockSellAmount(symbol);
      var sell_price_days = this.getStockSellPriceDays(symbol);

      if (buy_price == 0) {
        continue;
      }

      var avg_buy_price = buy_price / buy_amount;
      var avg_sell_price = sell_price / sell_amount;
      var realized_pl = (avg_sell_price - avg_buy_price) * sell_amount;
      var realized_pl_perc = realized_pl * 100 / (sell_amount * avg_buy_price);

      var left_amount = buy_amount - sell_amount;
      var unrealized_pl = left_amount * (this.stock_details[symbol].price - avg_buy_price);
      var unrealized_pl_perc = unrealized_pl * 100 / (left_amount * avg_buy_price);

      var total_value = left_amount * this.stock_details[symbol].price;
      var weighted_cost = (buy_price_days - sell_price_days) / 365.0;
      var weighted_pl = unrealized_pl * 100 / weighted_cost;

      this.stock_summary[symbol] = {
        avg_buy_price: avg_buy_price,
        avg_sell_price: avg_sell_price,
        realized_pl: realized_pl,
        realized_pl_perc: realized_pl_perc,
        unrealized_pl: unrealized_pl,
        unrealized_pl_perc: unrealized_pl_perc,
        current_amount: left_amount,
        total_value: total_value,
        value_date: this.stock_details[symbol].price_date,
        weighted_cost: weighted_cost,
        weighted_pl: weighted_pl
      }

      this.total_portfolio_value += this.stock_summary[symbol].total_value;
    }

    for (var symbol in this.stock_summary) {
      this.stock_summary[symbol].portion = this.stock_summary[symbol].total_value * 100 / this.total_portfolio_value;
    }
  },

  add_amount: function(symbol, collection, amount, price, fees, date) {
    days_passed = (this.today - date) / (1000 * 60 * 60 * 24);
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
  },

  getStockBuyAmount: function(symbol) {
    if (symbol in this.stock_buys) {
      return this.stock_buys[symbol].amount;
    } else {
      return 0;
    }
  },

  getStockBuyPrice: function(symbol) {
    if (symbol in this.stock_buys) {
      return this.stock_buys[symbol].price;
    } else {
      return 0;
    }
  },

  getStockBuyPriceDays: function(symbol) {
    if (symbol in this.stock_buys) {
      return this.stock_buys[symbol].price_days;
    } else {
      return 0;
    }
  },

  getStockSellAmount: function(symbol) {
    if (symbol in this.stock_sells) {
      return this.stock_sells[symbol].amount;
    } else {
      return 0;
    }
  },

  getStockSellPrice: function(symbol) {
    if (symbol in this.stock_sells) {
      return this.stock_sells[symbol].price;
    } else {
      return 0;
    }
  },

  getStockSellPriceDays: function(symbol) {
    if (symbol in this.stock_sells) {
      return this.stock_sells[symbol].price_days;
    } else {
      return 0;
    }
  },

  getStockSummaries: function() {
    return this.stock_summary;
  }
};
