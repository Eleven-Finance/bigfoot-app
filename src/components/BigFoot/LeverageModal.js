import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Row,
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap"

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Web3Class from '../../helpers/bigfoot/Web3Class'
import { addressBigfoot11CakeBnb } from '../../data/addresses/addresses';
import Icon from './Icon';



function LeverageModal(props) {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const { isOpen, togglemodal, pool, userBalances } = props;

  // initial currency supply: { currencyCodeA: 0, currencyCodeB: 0, ...}
  const initialSupply = Object.fromEntries(
    pool.currencies.map(currency => [currency.code, 0])
  );

  const [ isApprovalModalOpen, setIsApprovalModalOpen ] = useState(false);
  const [ borrowFactor, setBorrowFactor ] = useState(2);
  const [ currencySupply, setCurrencySupply ] = useState(initialSupply);
  
  const updateCurrencySupply = (currencyCode, value) => {
    const newCurrencySupply = {...currencySupply};
    newCurrencySupply[currencyCode] = value;
    setCurrencySupply(newCurrencySupply);
  }

  const setMax = (currencyCode, isNativeToken) => {
    let amount = 0;
    let gasReserve = 0.02;

    if (isNativeToken === true) {
      if( userBalances[currencyCode] > gasReserve ){
        amount = userBalances[currencyCode] - gasReserve; //leave a small amount for gas
        toast.info(`Leaving a small amount for gas (${gasReserve})`);
      } else {
        amount = userBalances[currencyCode];
        toast.warn("Remember to leave some spare balance for gas.");
      } 
    } else {
      amount = userBalances[currencyCode];
    }

    updateCurrencySupply(currencyCode, amount);
  }


  const renderSlider = (pool) => {

    const sliderMax = Math.floor(pool.maxLeverage * 2) / 2; //round to the nearest 0.5
    const sliderLabels = {};

    for (let i=1.5; i<=sliderMax; i=i+0.5) {
      sliderLabels[i] = i.toString(); //populate the object with key: "value" --example: { 1.5: "1.5", 2: "2.0"}
    }

    return (
      <Slider
        value={borrowFactor}
        min={1.5}
        max={sliderMax}
        step={0.5}
        labels={sliderLabels}
        orientation="horizontal"
        onChange={value => {
          setBorrowFactor(value)
        }}
      />
    );
  }


  const toggleApprovalModal = () => {
    setIsApprovalModalOpen(!isApprovalModalOpen);
  }


  const requestBigFootApproval = () => {
    const erc20 = web3Instance.getErc20Contract(pool.currencies[0].address);
    const maxUint = web3Instance.maxUint;
    erc20.methods.approve(pool.bigfootAddress, maxUint).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toast.info(`BigFoot authorization in process. ${hash}`)
      })
      .on('receipt', function (receipt) {
        setIsApprovalModalOpen(false);
        toast.success(`BigFoot authorization accepted.`)
      })
      .on('error', function (error) {
        toast.warn(`BigFoot authorization failed. ${error?.message}`)
      })
      .catch((error) => {
        console.log(`BigFoot authorization error. ${error?.message}`)
      });
  }


  const sendTransaction = async () => {

    // VALIDATION
    if( Object.values(currencySupply).every( amount => !amount ) ){
      toast.warn("Please enter a valid amount")
      return;
    }

    const isApproved = await web3Instance.checkApproval(pool.currencies[0].address, addressBigfoot11CakeBnb);
    const amountVault = currencySupply[pool.currencies[0].code] || 0;
    const amountBnb = currencySupply[pool.currencies[1].code] || 0;

    //if user supplies vault asset & that asset is not approved, request approval
    if( amountVault && !isApproved ) {
      setIsApprovalModalOpen(true);
    } else {
      web3Instance.openPosition(pool.bigfootAddress, borrowFactor, amountVault, amountBnb);
    }
  }


  return (
    <>
    <Modal
      id="leverageModal"
      isOpen={isOpen}
      role="dialog"
      size="lg"
      autoFocus={true}
      centered={true}
      toggle={togglemodal}
    >
      <div className="modal-content">
        <ModalHeader toggle={togglemodal}>
          Farm: {pool.title}
        </ModalHeader>
        <ModalBody>
          <div
            className="wizard clearfix"
          >
            <div className="content clearfix">

              <Form>

                <div className="mb-3">
                  <p>Choose how much you want to supply:</p>

                  {
                    pool.currencies.map((currency, index) => {
                      return (
                        <FormGroup key={currency.code}>
                          <Row className="mb-3">
                            <Col lg="6">
                              <InputGroup className="mb-2">
                                <Label className="input-group-text">
                                  <span className="me-2">
                                    <Icon icon={currency.icon} />
                                  </span>
                                  {currency.code}
                                </Label>
                                <Input
                                  type="number"
                                  className="form-control"
                                  min="0"
                                  step="0.000001"
                                  value={currencySupply?.[currency.code] ?? 0}
                                  onChange={(e) => updateCurrencySupply(currency.code, e.target.value)}
                                />
                              </InputGroup>
                            </Col>
                            <Col lg="6" className="max-balance-wrapper text-end">
                              <span className="me-3">
                                Balance: {userBalances[currency.code]} {currency.code}
                              </span>
                              <Button
                                outline
                                color="primary"
                                onClick={() => {
                                  if (currency.address) {
                                    setMax(currency.code, false);
                                  } else {
                                    setMax(currency.code, true);
                                  }
                                }}
                              >
                                MAX
                                            </Button>
                            </Col>
                          </Row>
                        </FormGroup>
                      )
                    })
                  }
                </div>
                <div className="mb-3">
                  <p>Choose how much you 'd like to borrow:</p>
                  { renderSlider(pool) }
                </div>
                <br />
                <p>
                  Note: BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved when using this product. Please read <a href="#">here</a> to understand the risks involved.
                </p>

              </Form>
            </div>
            <div className="actions clearfix">
              <ul role="menu" aria-label="Pagination">
                <li className={"next"} >
                  <Link
                    to="#"
                    onClick={ sendTransaction }
                  >
                    Confirm
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
    

    <Modal
      id="approvalModal"
      isOpen={isApprovalModalOpen}
      role="dialog"
      size="mg"
      autoFocus={true}
      centered={true}
      toggle={toggleApprovalModal}
    >
      <div className="modal-content">
        <ModalHeader toggle={toggleApprovalModal}>
          Confirm approval: {pool.currencies[0].code}
        </ModalHeader>
        <ModalBody>
          <div
            className="wizard clearfix text-center"
          >
            <p>
              <Icon icon={pool.currencies[0].icon} />
            </p>
            <p>
              Approve your {pool.currencies[0].code} to be spent by bigfoot contract. 
            </p>
            <div className="actions clearfix">
              <ul role="menu" aria-label="Pagination">
                <li className={"next"} >
                  <Link
                    to="#"
                    onClick={requestBigFootApproval}
                  >
                    Approve
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
    
    </>
  )
}

export default LeverageModal;