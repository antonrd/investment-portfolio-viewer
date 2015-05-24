var Main = {
  run: function(do_filter) {
    ParseStocks.parse(Constants.STOCKS_FILE, function(stocks) {
      ParseTrades.parse(Constants.TRADES_FILE, function(trades) {
        var filtered_stocks = stocks;

        if (do_filter) {
          filtered_stocks = FilterStocks.filter(stocks);
        }

        ShowFilters.show(stocks, filtered_stocks.map(function(value) {
          return value.symbol;
        }));

        ComputeSummaries.init(filtered_stocks, trades);
        var stock_summaries = ComputeSummaries.getStockSummaries();

        ShowStockSummaries.show(stock_summaries);

        ComputeBreakdowns.init(stock_summaries, filtered_stocks);
        var stock_breakdowns = ComputeBreakdowns.getStockBreakdowns();

        ShowStockBreakdowns.show(stock_breakdowns);
      });
    });
  }
};

(function() {

  if(typeof(String.prototype.trim) === "undefined")
  {
      String.prototype.trim = function()
      {
          return String(this).replace(/^\s+|\s+$/g, '');
      };
  }

  Main.run(false);
})();
