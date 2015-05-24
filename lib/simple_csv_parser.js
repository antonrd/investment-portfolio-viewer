var SimpleCSVParser = {
  parse: function(filename, callback) {
    var self = this;
    var collection = [];
    $.get(filename, function(result) {
      var rows = result.trim().split("\n");
      var skipped_header = false;
      var header = "";
      for (var row_index in rows) {
        var row = rows[row_index];
        if (!skipped_header) {
          header = row.trim().split(",");
          skipped_header = true;
          continue;
        }

        self.parse_item(row, header, collection);
      }

      callback(collection);
    });
  },

  parse_item: function(row, header, collection) {
    fields = row.trim().split(",");
    var new_item = {};
    for (var field_index = 0; field_index < header.length; field_index++) {
      new_item[header[field_index]] = fields[field_index];
    }

    collection.push(new_item);
  }
};
