var ShowNextTrades = {
  show: function(next_trades) {
    $('.next-trades').empty();
    $('.next-trades').append("<tr><th>Class</th><th>Amount</th></tr>");
    for (var key in next_trades) {
      $('.next-trades').append("<tr><td>" + key + "</td><td>" + MathHelpers.round2(next_trades[key]) + "</td></tr>");
    }
  }
};
