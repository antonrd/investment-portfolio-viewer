var ParseTrades = {
  parse: function(filename, callback) {
    var self = this;
    SimpleCSVParser.parse(filename, function(trades) {
      callback(trades.map(self.enhance_trade));
    });
  },

  enhance_trade: function(trade) {
    return {
      action: trade.action,
      symbol: trade.symbol,
      exchange: trade.exchange,
      date: new Date(Date.parse(trade.date)),
      amount: parseInt(trade.amount),
      price: parseFloat(trade.price),
      fees: parseFloat(trade.fees)
    };
  }
};
