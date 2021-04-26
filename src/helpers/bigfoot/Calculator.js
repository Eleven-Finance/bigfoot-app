import BigNumber from "bignumber.js";


class Calculator {

  //getWeiStrFromAmount(): returns a String with the equivalent value in Weis
  static getWeiStrFromAmount(amount){
    return new BigNumber(amount).multipliedBy(new BigNumber(10).exponentiatedBy(18)).toString(10);
  }


  //getAmoutFromWeis(): returns a String with the equivalent amount in the standard unit
  static getAmoutFromWeis(weiAmount){
    return new BigNumber(weiAmount).dividedBy(new BigNumber(10).exponentiatedBy(18)).toString(10);
  }


  static extractPositionInfo(position){
    const totalSize = position.positionInfo[0];
    const debtSize = position.positionInfo[1];
    const collateral = totalSize - debtSize;
    return {totalSize, debtSize, collateral};
  }


  static getPositionCollateral(position) {
    const {collateral} = this.extractPositionInfo(position);
    return parseFloat(this.getAmoutFromWeis(collateral));
  }

  static getPositionDebt(position) {
    const {debtSize} = this.extractPositionInfo(position);
    return parseFloat(this.getAmoutFromWeis(debtSize));
  }

  static getCurrentLeverage(position) {
    const {totalSize, collateral} = this.extractPositionInfo(position);
    let currentLeverage = totalSize / collateral;
    return parseFloat(currentLeverage);
  }


  static calcNewLeverage(position, pool, currencySupply, currencyValues) {
    const {totalSize, collateral} = this.extractPositionInfo(position);

    //calc the total value of additional supplied assets in BNB
    let additionalSupplyInBnb = 0;
    for(const currency in currencySupply){
      const currencyAddress = pool.currencies.find( thatCurrency => thatCurrency.code === currency).address;
      const isNativeToken = !currencyAddress; //native tokens do not have an address property
      let addedValueInBnb;
      if( !currencySupply[currency] ){
        addedValueInBnb = 0;
      }else if(isNativeToken){
        addedValueInBnb = currencySupply[currency];
      }else{
        addedValueInBnb = currencySupply[currency] * currencyValues[currency];
      }
      additionalSupplyInBnb = additionalSupplyInBnb + parseFloat(this.getWeiStrFromAmount(addedValueInBnb));

    }
    
    const newCollateral = collateral + additionalSupplyInBnb;
    const newLeverage = Math.max(1, totalSize/newCollateral);
    return parseFloat(newLeverage);
  }
  
}

export default Calculator;