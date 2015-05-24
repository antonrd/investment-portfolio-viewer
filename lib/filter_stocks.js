var FilterStocks = {
  filter: function(stocks) {
    var checkboxes = $('.filters input[type=checkbox]');
    var checked_symbols = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checked_symbols.push(checkboxes[i].value);
      }
    }

    return stocks.filter(function(stock){
      return $.inArray(stock.symbol, checked_symbols) > -1;
    });
  }
};
