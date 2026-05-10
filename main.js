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

    let showPortfolioCharts = new ShowPortfolioCharts(stockSummaries, trades, dividends);
    showPortfolioCharts.show();

    let showStockSummaries = new ShowStockSummaries(stockSummaries, trades);
    let showSummaries = showStockSummaries.show();

    let computeBreakdowns = new ComputeBreakdowns(stockSummaries, filtered_stocks);
    let stockBreakdowns = computeBreakdowns.getStockBreakdowns();

    let showStockBreakdowns = new ShowStockBreakdowns(stockBreakdowns);
    let showBreakdowns = showStockBreakdowns.show();

    let computeNextTrades = new ComputeNextTrades(stockBreakdowns);
    let nextTrades = computeNextTrades.computeTrades();

    let showNextTrades = new ShowNextTrades(nextTrades);
    let showTrades = showNextTrades.show();

    let computeInvestmentsDividends = new ComputeInvestedAmountsDividends(trades, dividends);
    let investmentsDividendsByPeriod = computeInvestmentsDividends.getSummaries();
    console.log(investmentsDividendsByPeriod);

    let showInvsDivsPerPeriod = new ShowInvsDivsPerPeriod(investmentsDividendsByPeriod);
    showInvsDivsPerPeriod.show();
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

  const foreignCurrencies = Object.keys(Constants.CURRENCIES).filter(c => c !== Constants.DISPLAY_CURRENCY);

  fetch(`https://api.frankfurter.dev/v1/latest?from=${Constants.DISPLAY_CURRENCY}&to=${foreignCurrencies.join(',')}`)
    .then(r => r.json())
    .then(data => {
      for (const [cur, rate] of Object.entries(data.rates)) {
        Constants.CURRENCIES[cur] = 1 / rate;
      }
      _showCurrencyInfo(true, data.date);
      new Main().run(false);
    })
    .catch(() => {
      _showCurrencyInfo(false, null);
      new Main().run(false);
    });

  function _showCurrencyInfo(fromApi, date) {
    const source = fromApi
      ? `live rates from Frankfurter API (${date})`
      : `fallback rates from constants.js (API unavailable)`;
    const rates = Object.entries(Constants.CURRENCIES)
      .filter(([c]) => c !== Constants.DISPLAY_CURRENCY)
      .map(([c, r]) => `1 ${c} = ${MathHelpers.round2(r)} ${Constants.DISPLAY_CURRENCY}`)
      .join(' &nbsp;|&nbsp; ');
    $('#currency-info').html(`Currency rates: ${rates} &nbsp;&mdash;&nbsp; ${source}`);
  }

})();
