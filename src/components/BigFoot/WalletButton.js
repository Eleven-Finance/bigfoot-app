import React, { useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
} from "reactstrap"

import { Metamask, Binance } from '../../assets/images/bigfoot/icons-wallet/_index'

const getShortAddress = (address) => {
  return address.length < 11 ?
    address :
    (`${address.slice(0, 6)}...${address.slice(-4)}`);
}


const WalletButton = () => {
  const wallet = useWallet();
  const [isModalOpen, setisModalOpen] = useState(false);

  const connectWallet = (connector) => {
    switch (connector) {
      case 'injected':
        wallet.connect();
        break;
      case 'bsc':
        wallet.connect('bsc');
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
                <Row>
                  <Col sm="12" lg="6">
                    <button
                      type="button"
                      className="wallet-connector btn btn-primary waves-effect waves-light w-sm"
                      onClick={() => connectWallet('injected')}
                    >
                      <img src={Metamask?.default} />
                    Injected
                  </button>
                  </Col>
                  <Col sm="12" lg="6">
                    <button
                      type="button"
                      className="wallet-connector btn btn-primary waves-effect waves-light w-sm"
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
    </>
  )
}

export default WalletButton;