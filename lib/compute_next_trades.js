class ComputeNextTrades {

  constructor(stock_breakdowns) {
    this.stock_breakdowns = stock_breakdowns;
  }

  computeTrades() {
    let total_percent = 0.0;
    for (let key in Constants.RATIOS) {
      total_percent += Constants.RATIOS[key];
    }

    if (total_percent != 100) {
      alert("Desired ratios do not sum up to 100, " + total_percent + " instead.");
      console.error("Desired ratios do not sum up to 100, " + total_percent + " instead.");
      return null;
    }

    let current_value = this.stock_breakdowns.ALL.total_value;
    let new_value = current_value + Constants.NEXT_AMOUNT;

    let value_to_buy = {ALL: 0.0};
    let positives_sum = 0.0;
    for (let key in Constants.RATIOS) {
      let desired_ratio = Constants.RATIOS[key];
      let desired_amount = new_value * desired_ratio / 100.0;
      let current_class_value = 0.0;
      if (key in this.stock_breakdowns) {
        current_class_value = this.stock_breakdowns[key].total_value;
      }
      let difference = desired_amount - current_class_value;
      if (difference > 0) {
        value_to_buy[key] = difference;
        positives_sum += difference
      } else {
        value_to_buy[key] = 0.0;
      }

      value_to_buy.ALL += difference;
    }

    for (let key in Constants.RATIOS) {
      if (value_to_buy[key] > 0.0) {
        value_to_buy[key] = Constants.NEXT_AMOUNT * (value_to_buy[key] / positives_sum);
      }
    }

    return value_to_buy;
  }
};
