import BigNumber from "bignumber.js";

import { abiMasterChef, abiERC20 } from '../../data/abis/abis';
import { addressMasterChef } from '../../data/addresses/addresses';

class Web3Class {
  constructor(web3, userAddress) {
    this.web3 = web3;
    this.userAddress = userAddress;
    this.maxUint = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
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

  getMasterchefContractContract() {
    return new this.web3.eth.Contract(abiMasterChef, addressMasterChef);
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
    return (spendAllowance >= userBalance && spendAllowance != 0);
  }

  async getUserBalance(tokenAddress) {
    const erc20 = this.getErc20Contract(tokenAddress);
    const weis = await erc20.methods.balanceOf(this.userAddress).call();
    const userBalance = this.getAmoutFromWeis(weis);
    return userBalance;
  }

  async deposit(amount, pid) {
    const masterchefContract = this.getMasterchefContractContract();
    masterchefContract.methods.deposit(pid, amount).send();
  }

  async withdraw(amount, pid) {
    const masterchefContract = this.getMasterchefContractContract();
    masterchefContract.methods.withdraw(pid, amount).send();
  }

  async pendingRewards(pid) {
    const masterchefContract = this.getMasterchefContractContract();
    pendRe = await masterchefContract.methods.pendingEleven(_pid, this.userAddress).call();
    return pendRe;
  }
}

export default Web3Class;