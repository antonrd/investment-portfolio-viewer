var ComputeNextTrades = {

  compute: function(stock_breakdowns) {
    total_percent = 0.0;
    for (var key in Constants.RATIOS) {
      total_percent += Constants.RATIOS[key];
    }

    if (total_percent != 100) {
      alert("Desired ratios do not sum up to 100, " + total_percent + " instead.");
      console.error("Desired ratios do not sum up to 100, " + total_percent + " instead.");
      return null;
    }

    var current_value = stock_breakdowns.ALL.total_value;
    var new_value = current_value + Constants.NEXT_AMOUNT;

    var value_to_buy = {ALL: 0.0};
    var positives_sum = 0.0;
    for (var key in Constants.RATIOS) {
      var desired_ratio = Constants.RATIOS[key];
      var desired_amount = new_value * desired_ratio / 100.0;
      var current_class_value = 0.0;
      if (key in stock_breakdowns) {
        current_class_value = stock_breakdowns[key].total_value;
      }
      var difference = desired_amount - current_class_value;
      if (difference > 0) {
        value_to_buy[key] = difference;
        positives_sum += difference
      } else {
        value_to_buy[key] = 0.0;
      }

      value_to_buy.ALL += difference;
    }

    for (var key in Constants.RATIOS) {
      if (value_to_buy[key] > 0.0) {
        value_to_buy[key] = Constants.NEXT_AMOUNT * (value_to_buy[key] / positives_sum);
      }
    }

    return value_to_buy;
  }

};
