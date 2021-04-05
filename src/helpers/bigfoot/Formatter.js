const { default: millify } = require("millify");

class Formatter {

  static numberUnits = ["", "K", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion"];


  static getFormattedTvl(amount) {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }

  
  static getFormattedYield(amount, precision = 2) {
    if (!amount) {
      return ''; // while loading
    }

    let result = millify(amount,
      {
        units: this.numberUnits,
        precision: precision,
        space: true,
      });
    
    if (amount >= 1000) {
      result += ' '; // append empty space at the end, after units (ex. "nn Million %")
    }

    return result;
  }


}

export default Formatter;