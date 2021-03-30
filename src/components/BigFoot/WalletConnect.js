import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from "react-redux"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import wallet_model from './wallet_model';
import { getWalletSuccess } from "../../store/actions"


function WalletConnect(props) {

  const supportedNetworkIds = [56];

  const { web3Loading, getweb3 } = wallet_model();

  async function connectWallet() {
    const web3 = await getweb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    
    if( !supportedNetworkIds.includes(networkId) ){
      toastr.warning(
        `Your current network id: ${networkId}`, 
        "Make sure you're connected to BSC network (ChainID 56)!"
      );
      
      console.log("Current network id: ", networkId);
      console.log("Supported networks: ", supportedNetworkIds);
    }
    
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