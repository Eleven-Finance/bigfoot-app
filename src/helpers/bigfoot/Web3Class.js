import Web3 from "web3";
import BigNumber from "bignumber.js";

import { abiMasterChef, abiERC20, abiBank, abiVault, abiFactory, lpAbi } from '../../data/abis/abis';
import { addressMasterChef, addressStrategyZapperAddSingleAsset, addressStrategyZapperAdd, addressStrategyLiquidation11xxxBnb, addressBigfoot11Cake, addressBigfoot11CakeBnb, addressCake, address11CakeBnb, addressCakeBnbLp, addressPancakeWbnbBusdLp, addressWbnb, addressBusd, addressBfBNB, addressFactory } from '../../data/addresses/addresses';

class Web3Class {
  constructor(wallet) {
    this.web3 = new Web3(wallet.ethereum)
    this.userAddress = wallet.account;
    this.maxUint = "999999999999999999999999"; // 1 million
  }

  /**
   * Get string representation in Weis 
   * @param   {Number}  amount  given amount
   * @returns {String}          equivalent value in Weis
   */
  getWeiStrFromAmount(amount){
    return new BigNumber(amount).multipliedBy(new BigNumber(10).exponentiatedBy(18)).toString(10);
  }

  /**
   * @param   {Number} weiAmount  given amount in Weis
   * @returns {String}            equivalent amount in the standard unit
   */
  getAmoutFromWeis(weiAmount){
    return new BigNumber(weiAmount).dividedBy(new BigNumber(10).exponentiatedBy(18)).toString(10);
  }

  getMasterchefContract() {
    return new this.web3.eth.Contract(abiMasterChef, addressMasterChef);
  }

  getBfbnbBankContract() {
    return new this.web3.eth.Contract(abiBank, addressBfBNB);
  }

  getErc20Contract(tokenAddress) {
    return new this.web3.eth.Contract(abiERC20, tokenAddress);
  }

  getVaultContract(addressVault) {
    return new this.web3.eth.Contract(abiVault, addressVault);
  }

  getFactoryContract() {
    return new this.web3.eth.Contract(abiFactory, addressFactory);
  }

  getLpContract(token) {
    return new this.web3.eth.Contract(lpAbi, token);
  }
  
  async approveM(tokenAddress, spender, amount = this.maxUint) {
    const erc20 = this.getErc20Contract(tokenAddress);
    erc20.methods.approve(spender, amount).send({ from: this.userAddress });
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

    return this.getAmoutFromWeis(weis);
  }


  async getStakedCoins(pid) {
    const masterchefContract = this.getMasterchefContract();
    const userInfo = await masterchefContract.methods.userInfo(pid, this.userAddress).call();
    const stakedCoins = this.getAmoutFromWeis(userInfo["amount"]);
    return stakedCoins;
  }


  async getPendingRewards(pid) {
    const masterchefContract = this.getMasterchefContract();
    const pendingRewards = await masterchefContract.methods.pendingEleven(pid, this.userAddress).call();
    return pendingRewards;
  }


  async deposit(pid, amount) {
    const masterchefContract = this.getMasterchefContract();
    masterchefContract.methods.deposit(pid, amount).send();
  }


  async withdraw(pid, amount) {
    const masterchefContract = this.getMasterchefContract();
    masterchefContract.methods.withdraw(pid, amount).send();
  }


  async getBnbPrice(){
    const wbnbContract = this.getErc20Contract(addressWbnb);
    const busdContract = this.getErc20Contract(addressBusd);
    const wbnbInR = await wbnbContract.methods.balanceOf(addressPancakeWbnbBusdLp).call();
    const busdInR = await busdContract.methods.balanceOf(addressPancakeWbnbBusdLp).call();
    const bnbPrice = busdInR / wbnbInR;
    return bnbPrice;
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
    const bfbnbContract = new this.web3.eth.Contract(abiBank, addressBfBNB);
    const weis = await bfbnbContract.methods.totalBNB().call();
    return this.getAmoutFromWeis(weis);
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


  async convert11xxxToBnb(type, vaultaddress, amount) {
    const vaultContract = this.getVaultContract(vaultaddress);
    const pps = await vaultContract.methods.getPricePerFullShare().call();
    const amountFinal = amount * pps / 1e18;
    const token = await vaultContract.methods.token().call();
    if (type == 0) {//LP vault with bnb pair inside
      const lpContract = this.getLpContract(token);
      const wbnbContract = this.getErc20Contract(addressWbnb);
      const wbnbBalanceOfLP = await wbnbContract.methods.balanceOf(token).call() * 2;
      const totallpsupply = await lpContract.methods.totalSupply().call();
      return Math.floor(wbnbBalanceOfLP / totallpsupply * amountFinal);
    }
    if (type == 1) {//single asset paired with bnb
      const price = await getAssetPriceInCoin(token, addressWbnb);
      return Math.floor(amountFinal * price);
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


  async openPosition(bigfootVaultAddress, leverage, amountVault = 0, amountBnb = 0) {
    let stratInfo;
    let bigfootInfo;
    let vaultValue;
    
    const amountVaultWeis = this.getWeiStrFromAmount(amountVault);
    const amountBnbWeis = this.getWeiStrFromAmount(amountBnb);
    
    const bfbnbContract = this.getBfbnbBankContract();

    switch(bigfootVaultAddress){
      case addressBigfoot11Cake:
        stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyZapperAddSingleAsset, amountVaultWeis, stratInfo]);
        vaultValue = await this.convert11xxxToBnb(1, bigfootVaultAddress, amountVaultWeis);
        break;
      case addressBigfoot11CakeBnb:
        stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
        bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyZapperAdd, amountVaultWeis, stratInfo]);
        vaultValue = await this.convert11xxxToBnb(0, bigfootVaultAddress, amountVaultWeis);
        break;
    }

    const totalValue = new BigNumber(vaultValue).plus(new BigNumber(amountBnbWeis)).toString();
    const loan = new BigNumber(totalValue * (leverage - 1)).toString();

    bfbnbContract.methods
      .work(0, bigfootVaultAddress, loan, totalValue, bigfootInfo)
      .send({from: this.userAddress, value: amountBnbWeis});
  }
  

  async closePosition(positionUint, bigfootVaultAddress){
    const bfbnbContract = this.getBfbnbBankContract();
    const stratInfo = await this.web3.eth.abi.encodeParameters(["address", "uint"], [addressCake, "0"]);
    const bigfootInfo = await this.web3.eth.abi.encodeParameters(["address", "uint", "bytes"], [addressStrategyLiquidation11xxxBnb, 0, stratInfo]);

    bfbnbContract.methods
    .work(positionUint, bigfootVaultAddress, 0, 0, bigfootInfo)
    .send({from: this.userAddress});
  }


  async liquidatePosition(positionUint){
    const bfbnbContract = this.getBfbnbBankContract();
    bfbnbContract.methods.kill(positionUint).send({ from: this.userAddress });
  }

  
  /**
   * @param   {String} ownerAddress   optional
   * @returns {Array}                 array with all positions matching owner (if ownerAddress is not provided, a list with all positions will be returned)
   */
   async getPositions(ownerAddress){
    const positionsArr = [];
    const bfbnbContract = this.getBfbnbBankContract();
    const nextPositionID = await bfbnbContract.methods.nextPositionID().call();

    for(let i=1; i<nextPositionID; i++){
      let positionData = await bfbnbContract.methods.positions(i).call();
      let positionInfo = await bfbnbContract.methods.positionInfo(i).call();

      if(ownerAddress === undefined || positionData.owner === ownerAddress ) {
        positionsArr.push({positionId: i, positionData, positionInfo});
      }
    }

    return positionsArr;
  }


}

export default Web3Class;