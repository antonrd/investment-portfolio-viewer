var ShowFilters = {
  show: function(stocks, checked_symbols) {
    $('.filters').empty();
    $('.filters').append("<b>Show stocks:</b>");
    for (var i = 0; i < stocks.length; i++) {
      $('.filters').append(this.build_checkbox(stocks[i].symbol, checked_symbols));
    }
    $('.filters').append("<button type=\"button\" class=\"btn btn-primary btn-xs trigger-filter\">Filter stocks</button>");
    $('.trigger-filter').click(function() { Main.run(true); });
  },

  build_checkbox: function(symbol, checked_symbols) {
    var is_checked = false;
    if (checked_symbols === undefined || $.inArray(symbol, checked_symbols) > -1) {
      is_checked = true;
    }
    var result = "<label><input type=\"checkbox\" name=\"stock_filter\" value=\"" +
            symbol + "\"";
    if (is_checked) {
      result += " checked";
    }

    result += ">" + symbol + "</label>";

    return result;
  }
};
