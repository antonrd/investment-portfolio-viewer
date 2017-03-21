class FilterStocks {

  constructor(stocks) {
    this.stocks = stocks;
  }

  filter(){
    let checkboxes = $('.filters input[type=checkbox]');
    let checked_symbols = new Set();
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checked_symbols.add(checkboxes[i].value);
      }
    }

    return this.stocks.filter( (stock) => {
      return checked_symbols.has(stock.symbol);
    });
  }
};
