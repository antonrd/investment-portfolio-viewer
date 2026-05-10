class ShowStockChart {

  constructor(symbol, trades, currency) {
    this.symbol = symbol;
    this.currency = currency;
    this.trades = trades.filter(t => t.symbol === symbol && t.action !== Constants.SPLIT);
  }

  render(canvasId) {
    const labels = [];
    const barData = [];
    const lineData = [];
    const pointMeta = [];

    let sharesHeld = 0;

    for (let trade of this.trades) {
      const value = trade.amount * trade.price * Constants.CURRENCIES[this.currency];
      const label = trade.date.toISOString().slice(0, 10);

      if (trade.action === Constants.BUY) {
        sharesHeld += trade.amount;
        barData.push(value);
      } else if (trade.action === Constants.SELL) {
        sharesHeld -= trade.amount;
        barData.push(-value);
      }

      labels.push(label);
      lineData.push(sharesHeld * trade.price * Constants.CURRENCIES[this.currency]);
      pointMeta.push({
        action: trade.action,
        amount: trade.amount,
        price: trade.price,
        sharesHeld: sharesHeld,
      });
    }

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Invested / withdrawn (' + Constants.DISPLAY_CURRENCY + ')',
            data: barData,
            backgroundColor: barData.map(v => v >= 0 ? 'rgba(66, 133, 244, 0.7)' : 'rgba(234, 67, 53, 0.7)'),
            yAxisID: 'y',
            order: 2,
          },
          {
            type: 'line',
            label: 'Position value (' + Constants.DISPLAY_CURRENCY + ')',
            data: lineData,
            borderColor: 'rgba(52, 168, 83, 1)',
            backgroundColor: 'rgba(52, 168, 83, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            fill: false,
            yAxisID: 'y',
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { ticks: { maxTicksLimit: 12 } },
          y: { title: { display: true, text: Constants.DISPLAY_CURRENCY } },
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              afterBody: (items) => {
                const i = items[0].dataIndex;
                const m = pointMeta[i];
                return [
                  `${m.action}: ${m.amount} shares @ $${MathHelpers.round2(m.price)}`,
                  `Shares held after: ${MathHelpers.round2(m.sharesHeld)}`,
                ];
              },
            },
          },
        },
      },
    });
  }
}
