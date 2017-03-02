class ParseTrades {

  constructor(filename, callback){
    this.filename = filename;
    this.callback = callback;
  }

  parse() {
    self = this;
    let simpleCSVParser = new SimpleCSVParser(this.filename, function(trades) {
      self.callback(trades.map(self.enhance_trade));
    });
    simpleCSVParser.parse();
  }

  enhance_trade(trade) {
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
