import Web3 from "web3";
import BigNumber from "bignumber.js";

import Calculator from './Calculator';

import { abiMasterChef, abiERC20, abiBankBnb, abiVault, abiFactory, lpAbi, abiBigfootVault, abiNerveStorage, abiBankUsd } from '../../data/abis/abis';
import { addressMasterChef, addressStrategyZapperAddSingleAsset, addressStrategyZapperAdd, addressStrategyLiquidation11xxxBnb, addressBigfoot11Cake, addressBigfoot11CakeBnb, addressCake, address11CakeBnb, addressCakeBnbLp, addressPancakeWbnbBusdLp, addressWbnb, addressBusd, addressBfBNB, addressFactory, address3nrvStorage, addressBfUSD } from '../../data/addresses/addresses';

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

  getSpecificBankContract(bankAbi, bankAddress) {
    return new this.web3.eth.Contract(bankAbi, bankAddress);
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
    const userBalance = await this.getUserBalance(tokenAddress);
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


  async getPendingEle(pid) {
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
  async reqPayableBankDeposit(bankAbi, bankAddress){
    const bankContract = this.getSpecificBankContract(bankAbi, bankAddress);
    return bankContract.methods.deposit();
  }


  //non-payable --> amount is provided in .deposit()
  async reqNonPayableBankDeposit(bankAbi, bankAddress, amountsArrWeis){
    const bankContract = this.getSpecificBankContract(bankAbi, bankAddress);
    return bankContract.methods.deposit(amountsArrWeis);
  }


  async reqBankWithdraw(bankAbi, bankAddress, amount, option){
    const bankContract = this.getSpecificBankContract(bankAbi, bankAddress);
    return bankContract.methods.withdraw(amount, option);
  }


  async getBnbPrice(){
    const wbnbContract = this.getErc20Contract(addressWbnb);
    const busdContract = this.getErc20Contract(addressBusd);
    const wbnbInR = await wbnbContract.methods.balanceOf(addressPancakeWbnbBusdLp).call();
    const busdInR = await busdContract.methods.balanceOf(addressPancakeWbnbBusdLp).call();
    const bnbPrice = busdInR / wbnbInR;
    return bnbPrice;
  }


  async getNerveSingleAssetValueFromBfusd(amount, assetCode){
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


  async getTotalSupplyBnb(){
    const bfbnbContract = new this.web3.eth.Contract(abiBankBnb, addressBfBNB);
    const weis = await bfbnbContract.methods.totalBNB().call();
    return Calculator.getAmoutFromWeis(weis);
  }


  async getBankStats(){
    let totalSupply;
    let totalBorrow = 0;
    let utilization;
    let apy;
    let bigfootBalance;
    let bigfootChefBalance;

    const bfbnbContract = this.getBfbnbBankContract();

    //Total Supply
    const totalBnb = await this.getTotalSupplyBnb();
    totalSupply = parseFloat(totalBnb);

    //Total Borrow
    totalBorrow = await bfbnbContract.methods.glbDebtVal().call();
    totalBorrow = Calculator.getAmoutFromWeis(totalBorrow);
    totalBorrow = parseFloat(totalBorrow);
    
    //Utilization
    utilization = (totalBorrow / totalSupply * 100);

    //APY
    if (utilization < 80) { // Less than 80% utilization - 0%-20% APY
      apy = utilization * 2 / 8;
    } else if (utilization < 90) { // Between 80% and 90% - 20% APY
      apy = 20;
    } else if (utilization < 100) { // Between 90% and 100% - 20%-200% APY
      apy = 20 + (utilization - 9000) * 18 / 100;
    } else { // Not possible, but just in case - 200% APY
      apy = 200;
    }

    //Bigfoot Balance
    const bigfoot = await this.getBigFootBalance();
    bigfootBalance = parseFloat(bigfoot);
    
    //Bigfoot Chef Balance
    const chef = await this.getChefBalance();
    bigfootChefBalance = parseFloat(chef);

    return { totalSupply, totalBorrow, utilization, apy, bigfootBalance, bigfootChefBalance};
  }


  async convertBnbToBfbnb(amount) {
    const bfbnbContract = this.getBfbnbBankContract();
    const totalbnb = await bfbnbContract.methods.totalBNB().call();
    const totalshares = await bfbnbContract.methods.totalSupply().call();
    return amount * totalshares / totalbnb;
  }


  async convertBfbnbToBnb(amount) {
    const bfbnbContract = this.getBfbnbBankContract();
    const totalbnb = await bfbnbContract.methods.totalBNB().call();
    const totalshares = await bfbnbContract.methods.totalSupply().call();
    return amount * totalbnb / totalshares;
  }


  async get11xxxValue(type, vaultaddress) {
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
    }
    if (type == 1) {//single asset paired with bnb
      const price = await getAssetPriceInCoin(token, addressWbnb);
      return price * pps;
    }
  }


  async getBigFootBalance() {
    const userBalanceBfbnb = await this.getUserBalance(addressBfBNB);
    const userBalanceBfbnbInBnb = await this.convertBfbnbToBnb(userBalanceBfbnb);
    return userBalanceBfbnbInBnb;
  } 


  async getChefBalance() {
    const bfbnbStaked = await this.getStakedCoins(79); // bfbnb farm id: 79
    const bfbnbStakedInBnb = await this.convertBfbnbToBnb(bfbnbStaked);
    return bfbnbStakedInBnb;
  }

  
  //reqOpenOrAdjustPosition(): adjust an existing position (positionId) or open a new position (if positionId==0)
  async reqOpenOrAdjustPosition(positionId, bigfootVaultAddress, leverage, valueVaultAsset, amountVault = 0, amountBnb = 0) {
    let stratInfo;
    let bigfootInfo;
    
    const amountVaultWeis = Calculator.getWeiStrFromAmount(amountVault);
    const amountBnbWeis = Calculator.getWeiStrFromAmount(amountBnb);
    
    const bfbnbContract = this.getBfbnbBankContract();

    switch(bigfootVaultAddress){
      case addressBigfoot11Cake:
        stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyZapperAddSingleAsset, amountVaultWeis, stratInfo]);
        break;
      case addressBigfoot11CakeBnb:
        stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyZapperAdd, amountVaultWeis, stratInfo]);
        break;
    }

    const vaultValue = valueVaultAsset * amountVaultWeis;
    const totalValue = new BigNumber(vaultValue).plus(new BigNumber(amountBnbWeis)).toString();
    
    //calc loan (when adjusting an existing position, loan = 0)
    const loan = (positionId === 0) ? new BigNumber(totalValue * (leverage - 1)).toString() : 0;

    return bfbnbContract.methods.work(positionId, bigfootVaultAddress, loan, totalValue, bigfootInfo);
  }


  async reqClosePosition(positionUint, bigfootVaultAddress){
    const bfbnbContract = this.getBfbnbBankContract();
    const stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
    const bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyLiquidation11xxxBnb, 0, stratInfo]);

    return bfbnbContract.methods.work(positionUint, bigfootVaultAddress, 0, "9999999999999999999999999999", bigfootInfo);
  }


  async reqLiquidatePosition(positionUint){
    const bfbnbContract = this.getBfbnbBankContract();
    return bfbnbContract.methods.kill(positionUint);
  }

  
  async getAllPositions(){
    const bfbnbContract = this.getBfbnbBankContract();
    const nextPositionID = await bfbnbContract.methods.nextPositionID().call();

    const promises = []; //notice: will store an array of arrays of promises
    for(let i=1; i<nextPositionID; i++){
      promises.push([
        bfbnbContract.methods.positions(i).call(),
        bfbnbContract.methods.positionInfo(i).call()
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