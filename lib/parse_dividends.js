class ParseDividends {

  constructor(filename, callback){
    this.filename = filename;
    this.callback = callback;
  }

  parse() {
    let self = this;
    let simpleCSVParser = new SimpleCSVParser(this.filename, function(dividends) {
      self.callback(dividends.map(self.enhance_dividend));
    });
    simpleCSVParser.parse();
  }

  enhance_dividend(dividend){
    return {
      symbol: dividend.symbol,
      date: new Date(Date.parse(dividend.payment_date)),
      dividend_amount: parseFloat(dividend.amount),
      tax_amount: parseFloat(dividend.tax_amount)
    };
  }
};
