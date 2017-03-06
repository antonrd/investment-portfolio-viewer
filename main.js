class Main {

  run(do_filter) {
    let parseStocks = new ParseStocks(Constants.STOCKS_FILE, (stocks) => {
      let parseTrades = new ParseTrades(Constants.TRADES_FILE, (trades) => {
        let parseDividends = new ParseDividends(Constants.DIVIDENDS_FILE, (dividends) => {
          this.computeAndShow(dividends, stocks, trades, do_filter);
        });
        parseDividends.parse();
      });
      parseTrades.parse();
    });
    parseStocks.parse();
  }

  computeAndShow(dividends, stocks, trades, do_filter){
    let filtered_stocks = stocks;

    if (do_filter) {
      let filterStocks = new FilterStocks(stocks);
      filtered_stocks = filterStocks.filter(stocks);
    }

    let filters = new ShowFilters(stocks, filtered_stocks.map( (value) => {
      return value.symbol;
    }));
    let showFilters = filters.show();

    let computeSummaries = new ComputeSummaries(filtered_stocks, trades, dividends);
    let stockSummaries = computeSummaries.getStockSummaries();

    let showStockSummaries = new ShowStockSummaries(stockSummaries);
    let showSummaries = showStockSummaries.show();

    let computeBreakdowns = new ComputeBreakdowns(stockSummaries, filtered_stocks);
    let stockBreakdowns = computeBreakdowns.getStockBreakdowns();

    let showStockBreakdowns = new ShowStockBreakdowns(stockBreakdowns);
    let showBreakdowns = showStockBreakdowns.show();

    let computeNextTrades = new ComputeNextTrades(stockBreakdowns);
    let nextTrades = computeNextTrades.computeTrades();

    let showNextTrades = new ShowNextTrades(nextTrades);
    let showTrades = showNextTrades.show();
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

  let main = new Main();
  main.run(false);
})();
