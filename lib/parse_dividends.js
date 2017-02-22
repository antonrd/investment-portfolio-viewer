var ParseDividends = {
  parse: function(filename, callback) {
    var self = this;
    SimpleCSVParser.parse(filename, function(dividends) {
      callback(dividends.map(self.enhance_dividend));
    });
  },

  enhance_dividend: function(dividend){
    return {
      symbol: dividend.symbol,
      date: new Date(Date.parse(dividend.payment_date)),
      dividend_amount: parseFloat(dividend.amount),
      tax_amount: parseFloat(dividend.tax_amount)
    };
  }
};
