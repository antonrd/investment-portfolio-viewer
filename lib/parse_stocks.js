class ParseStocks {

  constructor(filename, callback){
    this.filename = filename;
    this.callback = callback;
  }

  parse() {
    let simpleCSVParser = new SimpleCSVParser(this.filename, (stocks) => {
      this.callback(stocks.map(this.enhance_stock));
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
