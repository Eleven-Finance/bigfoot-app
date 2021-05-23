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
import { getProviderDescription } from 'web3modal';

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
        setProvider();
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

  const setProvider = async () => {
    const provider = window.ethereum;
    const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]
    if (provider) { 
      const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
      try{
          await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Binance Smart Chain Mainnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: nodes,
              blockExplorerUrls: ['https://bscscan.com/'],
            },
          ],
        })
      }catch(exception){
        console.log("exception",exception);
      }
    } else {
      console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    }
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