class ShowStockBreakdowns {

  constructor(stock_breakdowns) {
    this.stock_breakdowns = stock_breakdowns;
  }

  show() {
    this._addBreakdownGroup('geo', Constants.STOCK_BY_GEO, this.stock_breakdowns);
    this._addBreakdownGroup('class', Constants.STOCK_BY_CLASS, this.stock_breakdowns);

    var combined_breakdowns = [];
    for (var i = 0; i < Constants.STOCK_BY_GEO.length; i++) {
      for (var j = 0; j < Constants.STOCK_BY_CLASS.length; j++) {
        combined_breakdowns.push(Constants.STOCK_BY_GEO[i] + Constants.STOCK_BY_CLASS[j]);
      }
    }

    this._addBreakdownGroup('combo', combined_breakdowns, this.stock_breakdowns);

    this._showTotalBreakdown(this.stock_breakdowns[Constants.STOCK_ALL]);
  }

  _showTotalBreakdown(all_breakdown) {
    $('.stock-breakdowns-all').empty();
    $('.stock-breakdowns-all').append("<tr><th>Total value</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Realized P/L</th><th>Realized P/L %<th>Weighted cost</th><th>Weighted P/L %</th></tr>")
    $('.stock-breakdowns-all').append(this._totalStats(all_breakdown));
  }

  _totalStats(all_breakdown) {
    return "<tr><td>$" + MathHelpers.round2(all_breakdown.total_value) +
      "</td><td>$" + MathHelpers.round2(all_breakdown.unrealized_pl) +
      "</td><td>" + MathHelpers.round2(all_breakdown.unrealized_pl * 100 / (all_breakdown.total_value - all_breakdown.unrealized_pl)) + "%" +
      "</td><td>$" + MathHelpers.round2(all_breakdown.realized_pl) +
      "</td><td>" + MathHelpers.round2(all_breakdown.realized_pl * 100 / (all_breakdown.total_value - all_breakdown.unrealized_pl)) + "%" +
      "</td><td>$" + MathHelpers.round2(all_breakdown.weighted_cost) +
      "</td><td>" + MathHelpers.round2(all_breakdown.unrealized_pl * 100 / all_breakdown.weighted_cost) + "%" +
      "</td></tr>";
  }

  _addBreakdownGroup(table_type, keys) {
    var table_class_name = '.stock-breakdowns-' + table_type;
    $(table_class_name).empty();

    if (table_type == 'combo') {
      $(table_class_name).append("<tr><th>Key</th><th>Value</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Portion</th><th>Goal</th></tr>");
    } else {
      $(table_class_name).append("<tr><th>Key</th><th>Value</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Portion</th></tr>");
    }

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key in this.stock_breakdowns) {
        $(table_class_name).append(this._breakdown_row(key, this.stock_breakdowns[key]));
      } else {
        var empty_row = "<tr><td>" + key + "</td><td>$0</td><td>$0</td><td>0%</td><td>0%</td>"
        if (table_type == 'combo') {
          empty_row += "<td>0%</td>"
        }
        empty_row += "</tr>"
        $(table_class_name).append(empty_row);
      }
    }
  }

  _breakdown_row(key, breakdown) {
    var result = "<tr><td>" + key +
      "</td><td>$" + MathHelpers.round2(breakdown.total_value) +
      "</td><td>$" + MathHelpers.round2(breakdown.unrealized_pl) +
      "</td><td>" + MathHelpers.round2(breakdown.unrealized_pl * 100 / (breakdown.total_value - breakdown.unrealized_pl)) + "%" +
      "</td><td>" + MathHelpers.round2(breakdown.portion) + "%" +
      "</td>";

    if (key in Constants.RATIOS) {
      result += "<td>" + Constants.RATIOS[key] + "%</td>";
    }

    result += "</tr>";

    return result;
  }
}
