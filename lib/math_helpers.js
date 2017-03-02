class MathHelpers {

  static round2(value) {
    if (isNaN(value)) {
      return " N/A ";
    }

    if (value == 0) {
      return value;
    }

    let multiplier = 100.0;
    let result = Math.round(value * 100) / 100.0;
    while (result == 0) {
      multiplier *= 10;
      result = Math.round(value * multiplier) / multiplier;
    }

    return result;
  }
};
