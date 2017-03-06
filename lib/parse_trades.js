class ParseTrades {

  constructor(filename, callback){
    this.filename = filename;
    this.callback = callback;
  }

  parse() {
    let simpleCSVParser = new SimpleCSVParser(this.filename, (trades) => {
      this.callback(trades.map(this.enhance_trade));
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
