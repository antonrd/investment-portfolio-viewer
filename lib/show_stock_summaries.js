class ShowStockSummaries {

  constructor(stock_summaries, trades){
    this.stock_summaries = stock_summaries;
    this.trades = trades;
  }

  show() {
    $('.stock-summaries').empty();

    $('.stock-summaries').append(`<tr><th>Symbol</th><th>Value ${Constants.DISPLAY_CURRENCY}</th><th>Amount</th><th>Date</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Realized P/L</th><th>Realized P/L %</th><th>Price</th><th>Average buy price</th><th>Average sell price</th><th>Dividends total</th><th>Yield</th><th>Portion</th></tr>`);

    let nonsold_count = 0;
    for (let [key, value] of this.stock_summaries) {
      if (value.current_amount > 0) {
        $('.stock-summaries').append(this._stock_row(key, value));
        ++nonsold_count;
      }
    }

    let sold_count = 0;
    let soldRows = '';
    for (let [key, value] of this.stock_summaries) {
      if (value.current_amount == 0) {
        soldRows += this._stock_row(key, value);
        ++sold_count;
      }
    }

    const colCount = 14;
    $('.stock-summaries').append(`
      <tbody>
        <tr class="soldout-toggle-row" id="soldout-toggle">
          <td colspan="${colCount}">&#9654; Sold out positions (${sold_count}) &#8212; click to expand</td>
        </tr>
      </tbody>
      <tbody class="soldout-rows" id="soldout-rows" style="display:none">${soldRows}</tbody>
    `);

    $('#soldout-toggle').on('click', function() {
      const $rows = $('#soldout-rows');
      const expanded = $rows.is(':visible');
      $rows.toggle();
      $(this).find('td').html(
        (expanded ? '&#9654;' : '&#9660;') +
        ` Sold out positions (${sold_count}) — click to ${expanded ? 'expand' : 'collapse'}`
      );
    });

    $('.stock-counts').append("Active: " + nonsold_count + ". Sold out: " + sold_count);

    $('[data-toggle="tooltip"]').tooltip();

    const trades = this.trades;
    $('.stock-summaries').on('click', '.stock-chart-toggle', function() {
      const symbol = $(this).data('symbol');
      const currency = $(this).data('currency');
      const panelId = 'chart-panel-' + symbol.replace(/[^a-zA-Z0-9]/g, '_');
      const canvasId = 'chart-canvas-' + symbol.replace(/[^a-zA-Z0-9]/g, '_');
      const $panel = $('#' + panelId);

      if ($panel.is(':visible')) {
        $panel.hide();
        return;
      }

      $panel.show();

      if (!$panel.data('rendered')) {
        const chart = new ShowStockChart(symbol, trades, currency);
        chart.render(canvasId);
        $panel.data('rendered', true);
      }
    });
  }

  _stock_row(symbol, stock) {
    const panelId = 'chart-panel-' + symbol.replace(/[^a-zA-Z0-9]/g, '_');
    const canvasId = 'chart-canvas-' + symbol.replace(/[^a-zA-Z0-9]/g, '_');
    const colCount = 14;
    return `<tr><td>${this._stock_symbol_field(symbol, stock)}
      ${ (stock.currency != Constants.DISPLAY_CURRENCY) ? "("+stock.currency+")" : "" }
      </td><td>${MathHelpers.round2(stock.total_value)}
      </td><td>${stock.current_amount}
      </td><td>${stock.value_date.toDateString()}

      </td><td>$${MathHelpers.round2(stock.unrealized_pl)}
      </td><td>${MathHelpers.round2(stock.unrealized_pl_perc)}%

      </td><td>$${MathHelpers.round2(stock.realized_pl)}
      </td><td>${MathHelpers.round2(stock.realized_pl_perc)}%

      </td><td>$${MathHelpers.round2(stock.current_price)}
      </td><td>$${MathHelpers.round2(stock.avg_buy_price)}
      </td><td>$${MathHelpers.round2(stock.avg_sell_price)}
      </td><td>$${MathHelpers.round2(stock.dividends_total)}
      </td><td>${MathHelpers.round2(stock.annual_yield)}%

      </td><td>${MathHelpers.round2(stock.portion)}%

      </td></tr>
      <tr id="${panelId}" style="display:none"><td colspan="${colCount}">
        <canvas id="${canvasId}" height="80"></canvas>
      </td></tr>`
  }

  _stock_symbol_field(symbol, stock) {
    return `<span data-toggle="tooltip" data-placement="right" title="${stock.description}"> ${symbol} </span>
      <span class="stock-chart-toggle" data-symbol="${symbol}" data-currency="${stock.currency}" style="cursor:pointer; color:#4285f4; font-size:0.85em;">&#9660;</span>`
  }
};
