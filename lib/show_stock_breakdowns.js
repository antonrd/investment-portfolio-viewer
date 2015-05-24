var ShowStockBreakdowns = {
  show: function(stock_breakdowns) {
    this.addBreakdownGroup('geo', Constants.STOCK_BY_GEO, stock_breakdowns);
    this.addBreakdownGroup('class', Constants.STOCK_BY_CLASS, stock_breakdowns);

    var combined_breakdowns = [];
    for (var i = 0; i < Constants.STOCK_BY_GEO.length; i++) {
      for (var j = 0; j < Constants.STOCK_BY_CLASS.length; j++) {
        combined_breakdowns.push(Constants.STOCK_BY_GEO[i] + Constants.STOCK_BY_CLASS[j]);
      }
    }

    this.addBreakdownGroup('combo', combined_breakdowns, stock_breakdowns);

    this.showTotalBreakdown(stock_breakdowns[Constants.STOCK_ALL]);
  },

  showTotalBreakdown: function(all_breakdown) {
    $('.stock-breakdowns-all').empty();
    $('.stock-breakdowns-all').append("<tr><th>Total value</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Wighted cost</th><th>Weighted P/L %</th></tr>")
    $('.stock-breakdowns-all').append(this.totalStats(all_breakdown));
  },

  totalStats: function(all_breakdown) {
    return "<tr><td>$" + MathHelpers.round2(all_breakdown.total_value) +
      "</td><td>$" + MathHelpers.round2(all_breakdown.unrealized_pl) +
      "</td><td>" + MathHelpers.round2(all_breakdown.unrealized_pl * 100 / (all_breakdown.total_value - all_breakdown.unrealized_pl)) + "%" +
      "</td><td>$" + MathHelpers.round2(all_breakdown.weighted_cost) +
      "</td><td>" + MathHelpers.round2(all_breakdown.unrealized_pl * 100 / all_breakdown.weighted_cost) + "%" +
      "</td></tr>";
  },

  addBreakdownGroup: function(table_type, keys, stock_breakdowns) {
    var table_class_name = '.stock-breakdowns-' + table_type;
    $(table_class_name).empty();

    $(table_class_name).append("<tr><th>Key</th><th>Value</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Portion</th></tr>");

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key in stock_breakdowns) {
        $(table_class_name).append(this.breakdown_row(key, stock_breakdowns[key]));
      } else {
        $(table_class_name).append("<tr><td>" + key + "</td><td>$0</td><td>$0</td><td>0%</td><td>0%</td></tr>");
      }
    }
  },

  breakdown_row: function(key, breakdown) {
    return "<tr><td>" + key +
      "</td><td>$" + MathHelpers.round2(breakdown.total_value) +
      "</td><td>$" + MathHelpers.round2(breakdown.unrealized_pl) +
      "</td><td>" + MathHelpers.round2(breakdown.unrealized_pl * 100 / (breakdown.total_value - breakdown.unrealized_pl)) + "%" +
      "</td><td>" + MathHelpers.round2(breakdown.portion) + "%" +
      "</td></tr>";
  }
}
