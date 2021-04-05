import React from 'react'
import { useWallet } from 'use-wallet'

function WalletButton() {
  const wallet = useWallet();
  return (
    <>
      {wallet.status === 'connected' ? (
        <button
          type="button"
          className="btn wallet-button"
          onClick={() => wallet.reset()}
        >{wallet.account}</button>
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