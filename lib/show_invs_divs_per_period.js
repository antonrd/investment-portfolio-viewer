class ShowInvsDivsPerPeriod {

  constructor(data_per_period){
    this.data_per_period = data_per_period;
  }

  show() {
    $('.invs-divs-per-period').empty();
    $('.invs-divs-per-period').append(`<tr><th>Period</th><th>Invested (${Constants.DISPLAY_CURRENCY})</th><th>Dividends (${Constants.DISPLAY_CURRENCY})</th></tr>`);

    // Separate year keys (>1000) from quarter keys (<=1000), both sorted ascending
    const yearKeys    = [...this.data_per_period.keys()].filter(k => k > 1000).sort((a, b) => b - a);
    const quarterKeys = [...this.data_per_period.keys()].filter(k => k <= 1000).sort((a, b) => a - b);

    for (const yk of yearKeys) {
      const year = yk - 1000 + 1900;   // getYear() + 1000 => reverse: yk - 1000 + 1900
      const yv   = this.data_per_period.get(yk);
      const tbodyId = `invs-divs-quarters-${year}`;

      $('.invs-divs-per-period').append(`
        <tbody>
          <tr class="invs-divs-year-row" data-target="${tbodyId}" style="cursor:pointer; font-weight:bold; background:#f5f5f5;">
            <td>&#9654; ${year}</td>
            <td>${MathHelpers.round2(yv.total_spent)}</td>
            <td>${MathHelpers.round2(yv.dividends)}</td>
          </tr>
        </tbody>
        <tbody id="${tbodyId}" style="display:none;"></tbody>
      `);

      // Find the 4 quarter keys belonging to this year
      // quarter_key = (getYear() - 100) * 4 + q  =>  year offset = getYear() - 100 = year - 2000
      const yearOffset = year - 2000;
      const qNames = ['Q1', 'Q2', 'Q3', 'Q4'];
      for (let q = 0; q < 4; q++) {
        const qk = yearOffset * 4 + q;
        if (!this.data_per_period.has(qk)) continue;
        const qv = this.data_per_period.get(qk);
        $(`#${tbodyId}`).append(`
          <tr style="background:#fafafa; color:#555;">
            <td style="padding-left:24px;">${year} ${qNames[q]}</td>
            <td>${MathHelpers.round2(qv.total_spent)}</td>
            <td>${MathHelpers.round2(qv.dividends)}</td>
          </tr>
        `);
      }
    }

    // Toggle quarters on year row click
    $('.invs-divs-per-period').on('click', '.invs-divs-year-row', function() {
      const $tbody = $('#' + $(this).data('target'));
      const expanding = !$tbody.is(':visible');
      $tbody.toggle();
      $(this).find('td:first').html(
        (expanding ? '&#9660; ' : '&#9654; ') + $(this).data('target').replace('invs-divs-quarters-', '')
      );
    });
  }
}
