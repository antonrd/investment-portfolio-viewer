class ShowPortfolioCharts {

  constructor(stockSummaries, trades, dividends) {
    this.stockSummaries = stockSummaries;
    this.trades = trades;
    this.dividends = dividends;
    this._bubbleChart = null;
  }

  show() {
    const $section = $('#portfolio-charts-section');
    const $toggle = $('#portfolio-charts-toggle');

    $toggle.on('click', () => {
      if ($section.is(':visible')) {
        $section.hide();
        $toggle.text('Show Portfolio Charts');
        return;
      }
      $section.show();
      $toggle.text('Hide Portfolio Charts');
      if (!$section.data('rendered')) {
        this._bubbleChart = this._renderBubbleChart('bubble-chart-canvas', false);
        this._renderYearlyChart('yearly-chart-canvas');
        $section.data('rendered', true);

        $('#bubble-active-only').on('change', (e) => {
          this._bubbleChart.data.datasets = this._buildBubbleDatasets(e.target.checked);
          this._bubbleChart.update();
        });
      }
    });
  }

  // --- Bubble chart ---

  _buildBubbleDatasets(activeOnly) {
    const datasets = [];

    for (let [symbol, s] of this.stockSummaries) {
      if (activeOnly && s.current_amount === 0) continue;

      const costBasis = s.left_shares_buy_cost + s.cost_of_sold_shares;
      if (costBasis <= 0) continue;

      const dividends_perc = s.dividends_total > 0 ? s.dividends_total * 100 / costBasis : 0;
      const totalReturn = (s.unrealized_pl + (s.realized_pl || 0) + s.dividends_total) * 100 / costBasis;

      const r = Math.max(4, Math.min(40, Math.sqrt(costBasis / 100)));
      const active = s.current_amount > 0;
      const alpha = active ? 0.65 : 0.25;
      const color = totalReturn >= 0
        ? `rgba(52, 168, 83, ${alpha})`
        : `rgba(234, 67, 53, ${alpha})`;

      datasets.push({
        label: symbol,
        data: [{
          x: MathHelpers.round2(s.avg_holding_years),
          y: MathHelpers.round2(totalReturn),
          r: r,
        }],
        backgroundColor: color,
        borderColor: color.replace(String(alpha), '1'),
        borderWidth: active ? 1 : 2,
        borderDash: active ? [] : [4, 3],
        _meta: {
          symbol, costBasis, active,
          unrealized_pl: s.unrealized_pl, unrealized_pl_perc: s.unrealized_pl_perc,
          realized_pl: s.realized_pl || 0, realized_pl_perc: s.realized_pl_perc || 0,
          dividends: s.dividends_total, dividends_perc,
        },
      });
    }

    return datasets;
  }

  _renderBubbleChart(canvasId, activeOnly) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
      type: 'bubble',
      data: { datasets: this._buildBubbleDatasets(activeOnly) },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => {
                const m = item.dataset._meta;
                const cost = MathHelpers.round2(m.costBasis);
                const cur = Constants.DISPLAY_CURRENCY;
                const totalDollars = MathHelpers.round2(m.unrealized_pl + m.realized_pl + m.dividends);
                return [
                  `${m.symbol}${m.active ? '' : ' (liquidated)'}`,
                  `Holding: ${item.raw.x} yrs`,
                  `Cost basis: ${cur} ${cost}`,
                  ``,
                  `Total return: ${cur} ${totalDollars} (${item.raw.y}%)`,
                  `  Unrealized: ${cur} ${MathHelpers.round2(m.unrealized_pl)} (${MathHelpers.round2(m.unrealized_pl_perc)}%)`,
                  `  Realized:   ${cur} ${MathHelpers.round2(m.realized_pl)} (${MathHelpers.round2(m.realized_pl_perc)}%)`,
                  `  Dividends:  ${cur} ${MathHelpers.round2(m.dividends)} (${MathHelpers.round2(m.dividends_perc)}%)`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'Avg holding period (years)' },
            min: 0,
          },
          y: {
            title: { display: true, text: 'Total return %' },
            grid: {
              color: (ctx) => ctx.tick.value === 0 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)',
            },
          },
        },
      },
    });
  }

  // --- Yearly bar chart ---

  _renderYearlyChart(canvasId) {
    const stats = new ComputeYearlyStats(
      this.trades, this.dividends, this.stockSummaries, Constants.CURRENCIES
    ).getYearlyStats();

    const labels = Array.from(stats.keys()).map(String);
    const invested  = labels.map(yr => MathHelpers.round2(stats.get(parseInt(yr)).invested));
    const realized  = labels.map(yr => MathHelpers.round2(stats.get(parseInt(yr)).realized_pl));
    const dividends = labels.map(yr => MathHelpers.round2(stats.get(parseInt(yr)).dividends));

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: `Invested (${Constants.DISPLAY_CURRENCY})`,
            data: invested,
            backgroundColor: 'rgba(66, 133, 244, 0.7)',
            stack: 'a',
          },
          {
            label: `Realized P/L (${Constants.DISPLAY_CURRENCY})`,
            data: realized,
            backgroundColor: 'rgba(251, 188, 4, 0.7)',
            stack: 'b',
          },
          {
            label: `Dividends (${Constants.DISPLAY_CURRENCY})`,
            data: dividends,
            backgroundColor: 'rgba(52, 168, 83, 0.7)',
            stack: 'b',
          },
        ],
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              footer: (items) => {
                const re = items.find(i => i.dataset.label.startsWith('Realized'))?.parsed.y || 0;
                const dv = items.find(i => i.dataset.label.startsWith('Dividends'))?.parsed.y || 0;
                return `Total return: ${MathHelpers.round2(re + dv)} ${Constants.DISPLAY_CURRENCY}`;
              },
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Year' } },
          y: { title: { display: true, text: Constants.DISPLAY_CURRENCY } },
        },
      },
    });
  }
}
