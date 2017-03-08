class ShowNextTrades {

  constructor(next_trades){
    this.next_trades = next_trades;
  }

  show() {
    $('.next-trades').empty();
    $('.next-trades').append(`<tr><th>Class</th><th>Amount</th></tr>`);
    for (let key in this.next_trades) {
      $('.next-trades').append(`<tr><td> ${key} </td><td> ${MathHelpers.round2(this.next_trades[key])} </td></tr>`);
    }
  }
};
