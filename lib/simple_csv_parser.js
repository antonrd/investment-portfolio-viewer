class SimpleCSVParser {

  constructor(filename, callback){
    this.filename = filename;
    this.callback = callback;
  }

  parse() {
    let self = this;
    let collection = [];
    $.get(this.filename, function(result) {
      let rows = result.trim().split("\n");
      let skipped_header = false;
      let header = "";
      for (let row_index in rows) {
        let row = rows[row_index];
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
    let fields = row.trim().split(",");
    let new_item = {};
    for (let field_index = 0; field_index < header.length; field_index++) {
      new_item[header[field_index]] = fields[field_index];
    }

    collection.push(new_item);
  }
};
