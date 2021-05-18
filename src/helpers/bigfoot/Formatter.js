const { default: millify } = require("millify");

class Formatter {

  static numberUnits = ["", "K", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion"];


  static formatAmount(amount, decimals=2) {
    if(amount===undefined || isNaN(amount)){
      return '';
    }
    if (1 / amount === -Infinity){ //detect -0
      return '';
    }
    return amount.toLocaleString('en-US', { maximumFractionDigits: decimals })
  }

  
  static getFormattedYield(amount, precision = 2) {
    if (amount === undefined) {
      return '--'; // while loading
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