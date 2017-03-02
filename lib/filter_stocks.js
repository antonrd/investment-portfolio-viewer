class FilterStocks {

  constructor(stocks) {
    this.stocks = stocks;
  }

  filter(){
    let checkboxes = $('.filters input[type=checkbox]');
    let checked_symbols = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checked_symbols.push(checkboxes[i].value);
      }
    }

    return this.stocks.filter(function(stock){
      return $.inArray(stock.symbol, checked_symbols) > -1;
    });
  }
};
