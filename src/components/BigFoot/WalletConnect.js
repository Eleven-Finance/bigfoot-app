import PropTypes from 'prop-types'
import React, { useState } from 'react'
import wallet_model from './wallet_model';

import { connect } from "react-redux"
import { getWalletSuccess } from "../../store/actions"


function WalletConnect(props) {

  const { web3Loading, getweb3 } = wallet_model();

  async function connectWallet() {
    const web3 = await getweb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    props.getWalletSuccess(web3, accounts, networkId);
  };


  const renderWalletButton = () => {
    if (props.walletData.accounts) {
      return (
        <button
          type="button"
          className="btn header-item noti-icon waves-effect btn-connect-wallet"
        >
          {props.walletData.accounts[0]}
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn header-item noti-icon waves-effect btn-connect-wallet"
          onClick={() => connectWallet()}
        >Connect your wallet</button>
      );
    }
  }

  return (
    <div>
      { renderWalletButton() }
    </div>
  )
}



const mapStateToProps = state => {
  return {
    walletData: state.wallet.walletData,
  }
}

export default connect(mapStateToProps, { getWalletSuccess })(WalletConnect);

WalletConnect.propTypes = {
  error: PropTypes.any,
  getWalletSuccess: PropTypes.func,
}