class ShowStockSummaries {

  constructor(stock_summaries){
    this.stock_summaries = stock_summaries;
  }

  show() {
    $('.stock-summaries').empty();

    $('.stock-summaries').append("<tr><th>Symbol</th><th>Value</th><th>Amount</th><th>Date</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Realized P/L</th><th>Realized P/L %</th><th>Price</th><th>Average buy price</th><th>Average sell price</th><th>Dividends total</th><th>Average return per year</th><th>Portion</th></tr>");

    for (var symbol in this.stock_summaries) {
      $('.stock-summaries').append(this._stock_row(symbol, this.stock_summaries[symbol]));
    }

    $('[data-toggle="tooltip"]').tooltip();
  }

  _stock_row(symbol, stock) {
    return "<tr><td>" + this._stock_symbol_field(symbol, stock) +
      "</td><td>$" + MathHelpers.round2(stock.total_value) +
      "</td><td>" + stock.current_amount +
      "</td><td>" + stock.value_date.toDateString() +

      "</td><td>$" + MathHelpers.round2(stock.unrealized_pl) +
      "</td><td>" + MathHelpers.round2(stock.unrealized_pl_perc) + "%" +

      "</td><td>$" + MathHelpers.round2(stock.realized_pl) +
      "</td><td>" + MathHelpers.round2(stock.realized_pl_perc) + "%" +

      "</td><td>$" + MathHelpers.round2(stock.current_price) +
      "</td><td>$" + MathHelpers.round2(stock.avg_buy_price) +
      "</td><td>$" + MathHelpers.round2(stock.avg_sell_price) +
      "</td><td>$" + MathHelpers.round2(stock.dividends_total) +
      "</td><td>$" + MathHelpers.round2(stock.average_return) +

      "</td><td>" + MathHelpers.round2(stock.portion) + "%" +

      "</td></tr>"
  }

  _stock_symbol_field(symbol, stock) {
    return "<span data-toggle=\"tooltip\" data-placement=\"right\" title=\"" + stock.description + "\">" + symbol + "</span>"
  }
};
