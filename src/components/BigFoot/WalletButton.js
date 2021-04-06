import React from 'react'
import { useWallet } from 'use-wallet'

const getShortAddress = (address) => {
  return address.length < 11 ? 
    address : 
    (`${address.slice(0, 6)}...${address.slice(-4)}`);
}

const WalletButton = () => {
  const wallet = useWallet();
  return (
    <>
      {wallet.status === 'connected' ? (
        <button
          type="button"
          className="btn wallet-button"
          onClick={() => wallet.reset()}
        >{getShortAddress(wallet.account)}</button>
      ) : (
        <button
          type="button"
          className="btn wallet-button"
          onClick={() => wallet.connect() }
        >Connect your wallet</button>
      )}
    </>
  )
}

export default WalletButton;