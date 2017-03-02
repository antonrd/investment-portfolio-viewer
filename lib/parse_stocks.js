class ParseStocks {

  constructor(filename, callback){
    this.filename = filename;
    this.callback = callback;
  }

  parse() {
    var self = this;
    let simpleCSVParser = new SimpleCSVParser(this.filename, function(stocks) {
      self.callback(stocks.map(self.enhance_stock));
    });
    simpleCSVParser.parse();
  }

  enhance_stock(stock) {
    return {
      symbol: stock.symbol,
      is_us: stock.is_us == "1",
      stock_type: stock.stock_type,
      fund_manager: stock.fund_manager,
      description: stock.description,
      price: parseFloat(stock.price),
      price_date: new Date(Date.parse(stock.price_date))
    };
  }
};
