import React, {useState} from 'react'
import { useWallet } from 'use-wallet'
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"

const MetamaskImg = require('../../assets/images/bigfoot/icons-wallet/metamask.svg');

const getShortAddress = (address) => {
  return address.length < 11 ? 
    address : 
    (`${address.slice(0, 6)}...${address.slice(-4)}`);
}


const WalletButton = () => {
  const wallet = useWallet();
  const [isModalOpen, setisModalOpen] = useState(false);

  const connectWallet = (connector) => {
    switch(connector){
      case 'injected':
        wallet.connect();
        break;
      default:
        wallet.connect();
    }
    togglemodal();
  }

  const togglemodal = () => {
    setisModalOpen(!isModalOpen);
  }

  return (
    <>
      {wallet.status === 'connected' ? (
        <button
          type="button"
          className="btn wallet-button"
          onClick={() => wallet.reset()}
        >
          { wallet.account && getShortAddress(wallet.account)}
        </button>
      ) : (
        <button
          type="button"
          className="btn wallet-button"
          onClick={() => {
            togglemodal();
           }
          }
        >Connect your wallet</button>
      )}

      <Modal
        className="wallet-selector"
        isOpen={isModalOpen}
        role="dialog"
        size="lg"
        autoFocus={true}
        centered={true}
        toggle={() => togglemodal()}
      >
        <div className="modal-content">
          <ModalHeader toggle={() => togglemodal()}>
            <span>
              Connect your wallet
            </span>
          </ModalHeader>
          <ModalBody>
            <div
              className="wizard clearfix"
            >
              <div className="content clearfix">
                <div>
                  <button
                    type="button"
                    className="wallet-connector btn btn-primary waves-effect waves-light w-sm"
                    onClick={ () => connectWallet('injected') }
                  >
                    <img src={MetamaskImg?.default} />
                    Injected
                  </button>
                </div>
                <p>
                  Tip: make sure your wallet is connected to Binance Smart Chain mainnet.
                </p>
              </div>
            </div>
          </ModalBody>
        </div>
      </Modal>
    </>
  )
}

export default WalletButton;