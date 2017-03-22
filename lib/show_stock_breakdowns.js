class ShowStockBreakdowns {

  constructor(stock_breakdowns) {
    this.stock_breakdowns = stock_breakdowns;
  }

  show() {
    this._addBreakdownGroup('geo', Constants.STOCK_BY_GEO, this.stock_breakdowns);
    this._addBreakdownGroup('class', Constants.STOCK_BY_CLASS, this.stock_breakdowns);

    let combined_breakdowns = [];
    for (let stock_by_geo of Constants.STOCK_BY_GEO) {
      for (let stock_by_class of Constants.STOCK_BY_CLASS) {
        combined_breakdowns.push(stock_by_geo + stock_by_class);
      }
    }

    this._addBreakdownGroup('combo', combined_breakdowns, this.stock_breakdowns);

    this._showTotalBreakdown(this.stock_breakdowns.get(Constants.STOCK_ALL));
  }

  _showTotalBreakdown(all_breakdown) {
    $('.stock-breakdowns-all').empty();
    $('.stock-breakdowns-all').append("<tr><th>Total value</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Realized P/L</th><th>Realized P/L %<th>Weighted cost</th><th>Weighted P/L %</th><th>Dividends</th></tr>")
    $('.stock-breakdowns-all').append(this._totalStats(all_breakdown));
  }

  _totalStats(all_breakdown) {
    return `<tr><td>$ ${MathHelpers.round2(all_breakdown.total_value)}
      </td><td>$${MathHelpers.round2(all_breakdown.unrealized_pl)}
      </td><td>${MathHelpers.round2(all_breakdown.unrealized_pl * 100 / (all_breakdown.total_value - all_breakdown.unrealized_pl))}%
      </td><td>$${MathHelpers.round2(all_breakdown.realized_pl)}
      </td><td>${MathHelpers.round2(all_breakdown.realized_pl * 100 / (all_breakdown.total_cost_of_sold_shares))}%
      </td><td>$${MathHelpers.round2(all_breakdown.weighted_cost)}
      </td><td>${MathHelpers.round2(all_breakdown.unrealized_pl * 100 / all_breakdown.weighted_cost)}%
      </td><td>$${MathHelpers.round2(all_breakdown.total_dividends)}
      </td></tr>`;
  }

  _addBreakdownGroup(table_type, keys) {
    let table_class_name = '.stock-breakdowns-' + table_type;
    $(table_class_name).empty();

    if (table_type == 'combo') {
      $(table_class_name).append("<tr><th>Key</th><th>Value</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Portion</th><th>Goal</th></tr>");
    } else {
      $(table_class_name).append("<tr><th>Key</th><th>Value</th><th>Unrealized P/L</th><th>Unrealized P/L %</th><th>Portion</th></tr>");
    }

    for (let key of keys) {
      if (this.stock_breakdowns.has(key)) {
        $(table_class_name).append(this._breakdown_row(key, this.stock_breakdowns.get(key)));
      } else {
        let empty_row = `<tr><td>${key}</td><td>$0</td><td>$0</td><td>0%</td><td>0%</td>`
        if (table_type == 'combo') {
          empty_row += "<td>0%</td>"
        }
        empty_row += "</tr>"
        $(table_class_name).append(empty_row);
      }
    }
  }

  _breakdown_row(key, breakdown) {
    let result = `<tr><td>${key}
      </td><td>$${MathHelpers.round2(breakdown.total_value)}
      </td><td>$${MathHelpers.round2(breakdown.unrealized_pl)}
      </td><td>${MathHelpers.round2(breakdown.unrealized_pl * 100 / (breakdown.total_value - breakdown.unrealized_pl))}%
      </td><td>${MathHelpers.round2(breakdown.portion)}%
      </td>`;

    if (key in Constants.RATIOS) {
      result += `<td>${Constants.RATIOS[key]}%</td>`;
    }

    result += "</tr>";

    return result;
  }
}
