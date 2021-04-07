import Web3 from "web3";
import BigNumber from "bignumber.js";

import { abiMasterChef, abiERC20, abiBank } from '../../data/abis/abis';
import { addressMasterChef, addressPancakeWbnbBusdLp, addressWbnb, addressBusd, addressBfBNB } from '../../data/addresses/addresses';

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

}

export default Web3Class;