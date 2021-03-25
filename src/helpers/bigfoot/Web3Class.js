import { abiMasterChef, abiERC20 } from '../../data/abis/abis';

class Web3Class {
  constructor(web3, userAddress) {
    this.web3 = web3;
    this.userAddress = userAddress;
    this.maxUint = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
  }

  async approveM(tokenAddress, spender, amount = this.maxUint) {
    const erc20 = new this.web3.eth.Contract(abiERC20, tokenAddress);
    erc20.methods.approve(spender, amount).send({ from: this.userAddress });
  }
  async checkApproval(tokenAddress, spender) {
    const erc20 = new this.web3.eth.Contract(abiERC20, tokenAddress);
    const spendAllowance = await erc20.methods.allowance(this.userAddress, spender).call();
    const userBalance = await this.userBalance(tokenAddress);
    return (spendAllowance >= userBalance && spendAllowance != 0);
  }
  async userBalance(tokenAddress) {
    const erc20 = new this.web3.eth.Contract(abiERC20, tokenAddress);
    const userBalance = await erc20.methods.balanceOf(this.userAddress).call();
    return userBalance;
  }

  async deposit(amount, pid) {
    const masterchefContract = new this.web3.eth.Contract(abiMasterChef, addressMasterChef);
    masterchefContract.methods.deposit(pid, amount).send();
  }

  async withdraw(amount, pid) {
    const masterchefContract = new this.web3.eth.Contract(abiMasterChef, addressMasterChef);
    masterchefContract.methods.withdraw(pid, amount).send();
  }

  async pendingRewards(pid) {
    const masterchefContract = new this.web3.eth.Contract(abiMasterChef, addressMasterChef);
    pendRe = await masterchefContract.methods.pendingEleven(_pid, this.userAddress).call();
    return pendRe;
  }
}

export default Web3Class;