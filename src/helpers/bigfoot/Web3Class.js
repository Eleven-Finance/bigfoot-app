import Web3 from "web3";
import BigNumber from "bignumber.js";

import Calculator from './Calculator';

import { abiMasterChef, abiERC20, abiBankBnb, abiVault, abiFactory, lpAbi, abiBigfootVault, abiNerveStorage, abiBankUsd } from '../../data/abis/abis';
import { addressMasterChef, addressStrategyZapperAddSingleAsset, addressStrategyZapperAdd, addressStrategyLiquidation11xxxBnb, addressStrategyLiquidation11xxxUsdtBusdWex, addressBigfoot11Cake, addressBigfoot11CakeBnb, addressBigfoot11UsdtBusd, addressCake, address11Cake, address11CakeBnb, address11UsdtBusd, addressBusd, addressCakeBnbLp, addressPancakeWbnbBusdLp, addressWbnb, addressBfBNB, addressFactory, address3nrvStorage, addressBfUSD, addressUsdtBusdWlp, addressStrategyAddUsdtBusdWlp } from '../../data/addresses/addresses';

class Web3Class {
  constructor(wallet) {
    this.web3 = new Web3(wallet.ethereum)
    this.userAddress = wallet.account;
    this.maxUint = "999999999999999999999999"; // 1 million
  }

  getMasterchefContract() {
    return new this.web3.eth.Contract(abiMasterChef, addressMasterChef);
  }

  getBfbnbBankContract() {
    return new this.web3.eth.Contract(abiBankBnb, addressBfBNB);
  }

  getBfusdBankContract() {
    return new this.web3.eth.Contract(abiBankUsd, addressBfUSD);
  }

  getSpecificBankContract(bankAddress) {
    if(bankAddress===addressBfBNB){
      return this.getBfbnbBankContract();
    } else if(bankAddress===addressBfUSD) {
      return this.getBfusdBankContract();
    }
  }

  getErc20Contract(tokenAddress) {
    return new this.web3.eth.Contract(abiERC20, tokenAddress);
  }

  getVaultContract(addressVault) {
    return new this.web3.eth.Contract(abiVault, addressVault);
  }

  getBigfootVaultContract(addressBigfootVault) {
    return new this.web3.eth.Contract(abiBigfootVault, addressBigfootVault);
  }

  getFactoryContract() {
    return new this.web3.eth.Contract(abiFactory, addressFactory);
  }

  getLpContract(token) {
    return new this.web3.eth.Contract(lpAbi, token);
  }

  getNerveStorageContract() {
    return new this.web3.eth.Contract(abiNerveStorage, address3nrvStorage);
  }

  async reqApproval(tokenAddress, spender, amount = this.maxUint){
    const erc20 = this.getErc20Contract(tokenAddress);
    return erc20.methods.approve(spender, amount);
  }


  async checkApproval(tokenAddress, spender) {
    const erc20 = this.getErc20Contract(tokenAddress);
    const spendAllowance = await erc20.methods.allowance(this.userAddress, spender).call();
    return (spendAllowance > 0);
  }


  async getUserBalance(tokenAddress) {
    let weis;

    if (!tokenAddress) { //get balance in the native token
      weis = await this.web3.eth.getBalance(this.userAddress);
    } else {
      const erc20 = this.getErc20Contract(tokenAddress);
      weis = await erc20.methods.balanceOf(this.userAddress).call();
    }

    return Calculator.getAmoutFromWeis(weis);
  }


  getUserBalancesForPools(pools) {
    const allBalances = {};
    pools.forEach(pool => {
      pool.currencies.forEach(async (currency) => {
        if (allBalances[currency.code] === undefined) {
          const balance = await this.getUserBalance(currency.address); // get user balance for this specific token
          allBalances[currency.code] = balance;
        }
      });
    });
    return allBalances;
  }


  async getStakedCoins(pid) {
    const masterchefContract = this.getMasterchefContract();
    const userInfo = await masterchefContract.methods.userInfo(pid, this.userAddress).call();
    const stakedCoins = Calculator.getAmoutFromWeis(userInfo["amount"]);
    return stakedCoins;
  }

  //get all the generated staking values.
  async getPendingRewardsBank(bankAddress){
    const pendingRewards = {};
    switch (bankAddress) {
      case addressBfUSD:
        const bank = this.getBfusdBankContract()
        pendingRewards.ele = await bank.methods.pendingEle(this.userAddress).call();
        pendingRewards.nrv = await bank.methods.pending11Nrv(this.userAddress).call();
        break;    
      default:
        break;
    }
    return pendingRewards;
  }

  async getPendingRewadsFarm(pid) {
    const masterchefContract = this.getMasterchefContract();
    const pendingEle = await masterchefContract.methods.pendingEleven(pid, this.userAddress).call();
    return pendingEle;
  }

  
  // async getPendingE11(positionId, bigfootAddress) {
  //   const bfVaultContract = this.getBigfootVaultContract(bigfootAddress);
  //   const pendingE11 = await bfVaultContract.methods.pendingE11(positionId).call();
  //   return pendingE11;
  // }


  async reqClaimE11(positionId, bigfootAddress){
    const bfVaultContract = this.getBigfootVaultContract(bigfootAddress);
    return bfVaultContract.methods.claimRewards(positionId);
  }


  //payable function --> amount will be provided in .send()
  async reqPayableBankDeposit(bankAddress){
    const bankContract = this.getSpecificBankContract(bankAddress);
    return bankContract.methods.deposit();
  }


  //non-payable --> amount is provided in .deposit()
  async reqNonPayableBankDeposit(bankAddress, amountsArrWeis){
    const bankContract = this.getSpecificBankContract(bankAddress);
    return bankContract.methods.deposit(amountsArrWeis);
  }


  async reqBankWithdraw(bankAddress, amount, option){
    const bankContract = this.getSpecificBankContract(bankAddress);
    if(option === undefined){ //passing undefined as an argument would fail
      return bankContract.methods.withdraw(amount);
    }else{
      return bankContract.methods.withdraw(amount, option);
    }
  }

  async reqClaimRewards(bankAddress){
    const bankContract = this.getSpecificBankContract(bankAddress);
    return bankContract.methods.claimRewards();
  }

  async getBankReferenceAssetValueInUsd(bankAddress){
    if(bankAddress===addressBfBNB){
      return await this.getBnbPrice();
    } else if(bankAddress===addressBfUSD) {
      return await this.getDollarFrom3pool(1, "BUSD"); //using BUSD as reference
    }
  }


  async getBnbPrice(){
    const wbnbContract = this.getErc20Contract(addressWbnb);
    const busdContract = this.getErc20Contract(addressBusd);
    const wbnbInR = await wbnbContract.methods.balanceOf(addressPancakeWbnbBusdLp).call();
    const busdInR = await busdContract.methods.balanceOf(addressPancakeWbnbBusdLp).call();
    const bnbPrice = busdInR / wbnbInR;
    return bnbPrice;
  }


  async get3poolFromDollar(amount, assetCode) {
    const amountWeis = Calculator.getWeiStrFromAmount(amount);
    const nrvSwapContract = this.getNerveStorageContract();
    let array = ["0","0","0"];
    array[assetCode] = amountWeis;
    const pool3Amount = await nrvSwapContract.methods.calculateTokenAmount(address3nrvStorage,array,true).call();
    return Calculator.getAmoutFromWeis(pool3Amount);
}


  async getDollarFrom3pool(amount, assetCode){
    const ids = {
      BUSD: 0,
      USDT: 1,
      USDC: 2,
    }
    const nerveContract = this.getNerveStorageContract();
    const amountWeis = Calculator.getWeiStrFromAmount(amount);
    const result = await nerveContract.methods.calculateRemoveLiquidityOneToken(this.userAddress, amountWeis, ids[assetCode]).call();
    return Calculator.getAmoutFromWeis(result);
  }


  async getRatio3poolPerBfusd(){
    const bfusdContract = this.getBfusdBankContract();
    const total3Pool = await bfusdContract.methods.total3Pool().call();
    const totalSupply = await bfusdContract.methods.totalSupply().call();
    return total3Pool / totalSupply;
  }


  async getAssetPriceInCoin(assetaddress, coinaddress) {
    const factoryContract = this.getFactoryContract();
    const lpAddress = await factoryContract.methods.getPair(assetaddress, coinaddress).call();
    const assetContract = this.getErc20Contract(assetaddress);
    const coinContract = this.getErc20Contract(coinaddress);
    const assinlp = await assetContract.methods.balanceOf(lpAddress).call();
    const coininlp = await coinContract.methods.balanceOf(lpAddress).call();
    return coininlp/assinlp;
  }


  async getBankTotalValue(bankAddress){
    const bankContract = this.getSpecificBankContract(bankAddress);
    let weis = 0;
    if(bankAddress===addressBfBNB){
      weis = await bankContract.methods.totalBNB().call();
    } else if(bankAddress===addressBfUSD) {
      weis = await bankContract.methods.total3Pool().call();
    }
    return Calculator.getAmoutFromWeis(weis);
  }

  
  //getBigFootBalance(): 
  //returns user balance in the bigfoot contract (not chef contract) of a specific bank, in the bank main currency (eg. BNB, 3NRV-LP...)
  async getBigFootBalance(bankAddress) {
    const userBalance = await this.getUserBalance(bankAddress);
    const balanceInCurr = await this.convertBfsToBankCurrency(bankAddress, userBalance);
    return Calculator.getWeiStrFromAmount(balanceInCurr);
  } 


  async getChefBalance(bankAddress) {
    if(bankAddress===addressBfBNB){
      const bfbnbStaked = await this.getStakedCoins(79); // bfbnb farm id: 79
      const bfbnbStakedInCurr = await this.convertBfsToBankCurrency(bankAddress, bfbnbStaked);
      return Calculator.getWeiStrFromAmount(bfbnbStakedInCurr);
    } else if(bankAddress===addressBfUSD) {
      return null; //ChefBalance does not apply (ie. there's no farm for this bank)
    }
  }

  async getBankStats(bankAddress){
    let totalSupply;
    let totalBorrow = 0;
    let utilization;
    let apyFactor;
    let lendApy;
    let bigfootBalance;
    let bigfootChefBalance;

    const bankContract = this.getSpecificBankContract(bankAddress);

    //Bank reference asset value in USD: value of the main currency of this bank (eg. BNB, 3NRV-LP...), in usd
    const referenceAssetValueInUsd = await this.getBankReferenceAssetValueInUsd(bankAddress);

    //Total Supply
    const totalValue = await this.getBankTotalValue(bankAddress);
    totalSupply = parseFloat(totalValue);

    //Total Borrow
    totalBorrow = await bankContract.methods.glbDebtVal().call();
    totalBorrow = Calculator.getAmoutFromWeis(totalBorrow);
    totalBorrow = parseFloat(totalBorrow);
    
    //Utilization
    utilization = (totalBorrow / totalSupply * 100);

    //APY Factor
    if (utilization < 80) { // Less than 80% utilization - 0%-20% APY
      apyFactor = utilization * 2 / 8;
    } else if (utilization < 90) { // Between 80% and 90% - 20% APY
      apyFactor = 20;
    } else if (utilization < 100) { // Between 90% and 100% - 20%-200% APY
      apyFactor = 20 + (utilization - 90) * 18;
    } else { // Not possible, but just in case - 200% APY
      apyFactor = 200;
    }

    //Lend APY
    lendApy = apyFactor * utilization / 100;

    //Bigfoot Balance
    const bigfoot = await this.getBigFootBalance(bankAddress);
    bigfootBalance = parseFloat(bigfoot);
    
    //Bigfoot Chef Balance
    const chef = await this.getChefBalance(bankAddress);
    bigfootChefBalance = parseFloat(chef) || null; //null if there isn't a chef contract

    return { referenceAssetValueInUsd, totalSupply, totalBorrow, utilization, apyFactor, lendApy, bigfootBalance, bigfootChefBalance};
  }


  async convertBnbToBfbnb(amount) {
    const bfbnbContract = this.getBfbnbBankContract();
    const totalbnb = await bfbnbContract.methods.totalBNB().call();
    const totalshares = await bfbnbContract.methods.totalSupply().call();
    return amount * totalshares / totalbnb;
  }


  async convertBfsToBankCurrency(bankAddress, amount) {
    const bankContract = this.getSpecificBankContract(bankAddress);
    const totalValue = await this.getBankTotalValue(bankAddress);
    const totalshares = await bankContract.methods.totalSupply().call();
    return amount * totalValue / totalshares;
  }


  async getTokenValueInBankAsset(tokenAddress) {
    if(tokenAddress===null){
      return 1; //native token
    } else if (tokenAddress===address11CakeBnb){
      return await this.get11xxxValue(tokenAddress, 0);
    } else if (tokenAddress===address11Cake){
      return await this.get11xxxValue(tokenAddress, 1);
    } else if (tokenAddress===address11UsdtBusd){
      return await this.get11xxxValue(tokenAddress, 2);
    } else if (tokenAddress===addressBusd){
      return await this.get3poolFromDollar(1, 0);
    }
  }


  async get11xxxValue(vaultaddress, type) {
    const vaultContract = this.getVaultContract(vaultaddress);
    const ppsWeis = await vaultContract.methods.getPricePerFullShare().call();
    const pps = ppsWeis / 1e18;
    const token = await vaultContract.methods.token().call();
    if (type == 0) {//LP vault with bnb pair inside
      const lpContract = this.getLpContract(token);
      const wbnbContract = this.getErc20Contract(addressWbnb);
      const wbnbBalanceOfLP = await wbnbContract.methods.balanceOf(token).call() * 2;
      const totallpsupply = await lpContract.methods.totalSupply().call();
      return wbnbBalanceOfLP / totallpsupply * pps;
    } else if (type == 1) {//single asset paired with bnb
      const price = await getAssetPriceInCoin(token, addressWbnb);
      return price * pps;
    } else if (type == 2) {//
      const lpContract = this.getLpContract(token);
      const busdContract = this.getErc20Contract(addressBusd);
      const busdBalanceOfLP = await busdContract.methods.balanceOf(token).call() * 2;
      const totallpsupply = await lpContract.methods.totalSupply().call();
      const assetValue = busdBalanceOfLP / totallpsupply * pps;
      const nerveSwapContract = this.getNerveStorageContract();
      const result = await this.get3poolFromDollar(assetValue, 0);
      return result;
    }

  }


  //reqOpenOrAdjustPosition(): adjust an existing position (positionId) or open a new position (if positionId==0)
  async reqOpenOrAdjustPosition(positionId, bigfootVaultAddress, bankAddress, leverage, amountVault, currencyValues, currencySupply, totalProvidedValue) {
    let stratInfo;
    let bigfootInfo;
    let req;

    const bfContract = this.getSpecificBankContract(bankAddress);

    const currencySupplyWeis = Object.fromEntries(Object.keys(currencySupply).map(key => {
      const weis = (currencySupply[key]) ? Calculator.getWeiStrFromAmount(currencySupply[key]) : 0;
      return [key, weis];
    }));
    const amountVaultWeis = Calculator.getWeiStrFromAmount(amountVault);    
    const totalValueWeis = Calculator.getWeiStrFromAmount(totalProvidedValue);

    //calc loan (when adjusting an existing position, loan = 0)
    const loan = (positionId === 0) ? new BigNumber(totalValueWeis * (leverage - 1)).toString() : 0;

    switch(bigfootVaultAddress){
      case addressBigfoot11Cake:
        stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyZapperAddSingleAsset, amountVaultWeis, stratInfo]);
        req = null; //coming soon
        break;
      case addressBigfoot11CakeBnb:
        stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyZapperAdd, amountVaultWeis, stratInfo]);
        req = bfContract.methods.work(positionId, bigfootVaultAddress, loan, totalValueWeis, bigfootInfo);
        break;
      case addressBigfoot11UsdtBusd:
        stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressUsdtBusdWlp, "0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyAddUsdtBusdWlp, amountVaultWeis, stratInfo]); 

        const weisBusd = currencySupplyWeis['BUSD'] || 0;
        const weisUsdt = 0;
        const weisUsdc = 0;
        const weis3pool = 0;

        const amountsArr = [ weisBusd, weisUsdt, weisUsdc, weis3pool ];
        
        req = bfContract.methods.work(positionId, bigfootVaultAddress, loan, totalValueWeis, amountsArr, bigfootInfo );
        break;
    }

    return req;
  }

  
  async reqClosePosition(bankAddress, positionUint, bigfootVaultAddress){
    let stratInfo;
    let bigfootInfo;
    let req;

    const bfContract = this.getSpecificBankContract(bankAddress);

    switch(bigfootVaultAddress){
      case addressBigfoot11Cake:
        break;
      case addressBigfoot11CakeBnb:
        stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyLiquidation11xxxBnb, 0, stratInfo]);
        req = bfContract.methods.work(positionUint, bigfootVaultAddress, 0, "9999999999999999999999999999", bigfootInfo);
        break;
      case addressBigfoot11UsdtBusd:
        stratInfo = await this.web3.eth.abi.encodeParameters(["uint"], ["0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyLiquidation11xxxUsdtBusdWex, 0, stratInfo]); 
        const amounts = ["0", "0", "0", "0"];
        req = bfContract.methods.work(positionUint, bigfootVaultAddress, 0, "9999999999999999999999999999", amounts, bigfootInfo);
        break;
    }

    return req;
  }


  async reqLiquidatePosition(bankAddress, positionUint){
    const bfContract = this.getSpecificBankContract(bankAddress);
    return bfContract.methods.kill(positionUint);
  }

  
  async getAllPositions(bankAddress){
    const bankContract = this.getSpecificBankContract(bankAddress);
    const nextPositionID = await bankContract.methods.nextPositionID().call();

    const promises = []; //notice: will store an array of arrays of promises
    for(let i=1; i<nextPositionID; i++){
      promises.push([
        bankContract.methods.positions(i).call(),
        bankContract.methods.positionInfo(i).call()
      ]);
    }

    const results = await Promise.all(promises.map( innerArray => {
      return Promise.all(innerArray);
    }));

    const positions = results.map((elm, index) => {
      return { 
        positionId: index + 1, //positionId is index increased by one
        positionData: elm[0], 
        positionInfo: elm[1]
      };
    });

    return positions;
  }


}

export default Web3Class;