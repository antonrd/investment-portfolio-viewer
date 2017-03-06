class ShowFilters {

  constructor(stocks, checked_symbols) {
    this.stocks = stocks;
    this.checked_symbols = checked_symbols;
  }

  show() {
    $('.filters').empty();
    $('.filters').append("<b>Show stocks:</b>");
    for (let i = 0; i < this.stocks.length; i++) {
      $('.filters').append(this._build_checkbox(this.stocks[i].symbol));
    }
    $('.filters').append("<button type=\"button\" class=\"btn btn-primary btn-xs trigger-filter\">Filter stocks</button>");
    $('.trigger-filter').click( () => {
      let main = new Main();
      main.run(true);
    });
  }

  _build_checkbox(symbol) {
    let is_checked = false;
    if (this.checked_symbols === undefined || $.inArray(symbol, this.checked_symbols) > -1) {
      is_checked = true;
    }
    let result = "<label><input type=\"checkbox\" name=\"stock_filter\" value=\"" +
            symbol + "\"";
    if (is_checked) {
      result += " checked";
    }

    result += ">" + symbol + "</label>";

    return result;
  }
};
