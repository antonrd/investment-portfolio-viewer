var MathHelpers = {
  round2: function(value) {
    if (isNaN(value)) {
      return " N/A ";
    }

    if (value == 0) {
      return value;
    }

    var multiplier = 100.0;
    var result = Math.round(value * 100) / 100.0;
    while (result == 0) {
      multiplier *= 10;
      result = Math.round(value * multiplier) / multiplier;
    }

    return result;
  }
};
