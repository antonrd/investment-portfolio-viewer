var ShowStockSummaries = {
  show: function(stock_summaries) {
    $('.stock-summaries').empty();

    $('.stock-summaries').append("<tr><th>Symbol</th><th>Value</th><th>Amount</th><th>Date</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Realized P/L</th><th>Realized P/L %</th><th>Average buy price</th><th>Average sell price</th><th>Portion</th></tr>");

    for (var symbol in stock_summaries) {
      $('.stock-summaries').append(this.stock_row(symbol, stock_summaries[symbol]));
    }
  },

  stock_row: function(symbol, stock) {
    return "<tr><td>" + symbol +
      "</td><td>$" + MathHelpers.round2(stock.total_value) +
      "</td><td>" + stock.current_amount +
      "</td><td>" + stock.value_date.toDateString() +

      "</td><td>$" + MathHelpers.round2(stock.unrealized_pl) +
      "</td><td>" + MathHelpers.round2(stock.unrealized_pl_perc) + "%" +

      "</td><td>$" + MathHelpers.round2(stock.realized_pl) +
      "</td><td>" + MathHelpers.round2(stock.realized_pl_perc) + "%" +

      "</td><td>$" + MathHelpers.round2(stock.avg_buy_price) +
      "</td><td>$" + MathHelpers.round2(stock.avg_sell_price) +

      "</td><td>" + MathHelpers.round2(stock.portion) + "%" +

      "</td></tr>"
  }
};
