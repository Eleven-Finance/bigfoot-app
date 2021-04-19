import React, { useState, useEffect } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Blockies from 'react-blockies';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
} from "reactstrap"

import './WalletConnector.scss'
import { Metamask, Binance } from '../../assets/images/bigfoot/icons-wallet/_index'

const getShortAddress = (address) => {
  return address.length < 11 ?
    address :
    (`${address.slice(0, 6)}...${address.slice(-4)}`);
}


const WalletConnector = () => {

  const storageKey = 'WEB3_CACHED_PROVIDER'

  const wallet = useWallet();
  const [isModalOpen, setisModalOpen] = useState(false);
  
  useEffect(() => {
    if( !wallet.account ) {
      const cachedProvider = localStorage.getItem(storageKey);
      if(cachedProvider){
        connectWallet(cachedProvider);
      }
    }
  }, [])

  
  const connectWallet = async (connector) => {

    await wallet.reset(); //needed to force an update of wallet properties (wallet.account, wallet.status)
    localStorage.removeItem(storageKey); //fixes firefox issue (cached provider was detected and connection attempted but never successful)

    switch (connector) {
      case 'injected':
        wallet.connect();
        localStorage.setItem(storageKey, 'injected')
        break;
      case 'bsc':
        wallet.connect('bsc');
        localStorage.setItem(storageKey, 'bsc')
        break;
      default:
        wallet.connect();
    }

    setisModalOpen(false);
  }


  const resetWallet = () => {
    wallet.reset();
    localStorage.removeItem(storageKey);
  }


  const togglemodal = () => {
    setisModalOpen(!isModalOpen);
  }


  return (
    <div id="WalletConnector">
      {wallet.status === 'connected' ? (
        <button
          type="button"
          className="btn wallet-button"
          onClick={ resetWallet }
        > 
          { wallet.account && <Blockies seed={wallet.account.toLowerCase()} />}
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
                <Row>
                  <Col sm="12" lg="6">
                    <button
                      type="button"
                      className="wallet-connector btn btn-primary"
                      onClick={() => connectWallet('injected')}
                    >
                      <img src={Metamask?.default} />
                    Injected
                  </button>
                  </Col>
                  <Col sm="12" lg="6">
                    <button
                      type="button"
                      className="wallet-connector btn btn-primary"
                      onClick={() => connectWallet('bsc')}
                    >
                      <img src={Binance?.default} />
                      Binance Chain Wallet
                  </button>
                  </Col>
                </Row>
                <p>
                  Tip: make sure your wallet is connected to Binance Smart Chain mainnet.
                </p>
              </div>
            </div>
          </ModalBody>
        </div>
      </Modal>
    </div>
  )
}

export default WalletConnector;