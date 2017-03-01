class SimpleCSVParser {

  constructor(filename, callback){
    this.filename = filename;
    this.callback = callback;
  }

  parse() {
    var self = this;
    var collection = [];
    $.get(this.filename, function(result) {
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

        self.parseItem(row, header, collection);
      }

      self.callback(collection);
    });
  }

  parseItem(row, header, collection) {
    var fields = row.trim().split(",");
    var new_item = {};
    for (var field_index = 0; field_index < header.length; field_index++) {
      new_item[header[field_index]] = fields[field_index];
    }

    collection.push(new_item);
  }
};
