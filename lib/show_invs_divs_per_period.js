class ShowInvsDivsPerPeriod {

  constructor(data_per_period){
    this.data_per_period = data_per_period;
  }

  show() {
    $('.invs-divs-per-period').empty();
    $('.invs-divs-per-period').append("<tr><th>Period</th><th>Invested</th><th>Dividends</th></tr>");
    let sorted_values = [...this.data_per_period].sort();
    console.log(sorted_values);
    for (let [key, value] of sorted_values) {
      if (key > 1000) {
        // This is quarter data
        let period_label = key + 900;
        $('.invs-divs-per-period').append(`<tr><td> ${period_label} </td><td> ${MathHelpers.round2(value.total_spent)} </td><td> ${MathHelpers.round2(value.dividends)} </td></tr>`);
      } else {
        // This is annual data
        let period_label = `${Math.floor(key / 4) + 2000}-${(key % 4)}`;
        $('.invs-divs-per-period').append(`<tr><td> ${period_label} </td><td> ${MathHelpers.round2(value.total_spent)} </td><td> ${MathHelpers.round2(value.dividends)} </td></tr>`);
      }
    }
  }
};
