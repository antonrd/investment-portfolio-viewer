var ParseStocks = {

  parse: function(filename, callback) {
    var self = this;
    SimpleCSVParser.parse(filename, function(stocks) {
      callback(stocks.map(self.enhance_stock));
    });
  },

  enhance_stock: function(stock) {
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
