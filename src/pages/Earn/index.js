import React, {useState, useEffect} from "react"
import { Link } from "react-router-dom"
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Container,
  Row,
  Button,
  Col,
  Card,
  CardBody,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import lendingOptions from 'data/lendingOptions'
import Web3Class from 'helpers/bigfoot/Web3Class'
import Calculator from 'helpers/bigfoot/Calculator'
import Formatter from "helpers/bigfoot/Formatter"


const Earn = () => {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [options, setOptions] = useState(lendingOptions);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    chosenOption: '', // lending option chosen by the user
    action: '', // supply,withdraw
    amount: 0,
    userBalance: 0,
  });
  const [bnbPrice, setBnbPrice] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [supplyBalance, setSupplyBalance] = useState(0);

  useEffect( async () => {
    if(wallet.account) {
      const price = await web3Instance.getBnbPrice();
      setBnbPrice(price);
    }
  }, [wallet]);

  useEffect( async () => {
    if(wallet.balance != -1 && bnbPrice) {
      updateWalletBalance();
      updateSupplyBalance();
    } else {
      setWalletBalance(0);
      setSupplyBalance(0);
    }
  }, [wallet, bnbPrice]);

  
  useEffect( async () => {
    if(wallet.account) {
      updateAllOptions();
    }
  }, [wallet]);


  const updateWalletBalance = () => {
    const walletBalance = Calculator.getAmoutFromWeis(wallet.balance);
    const walletBalanceUsd = parseFloat(walletBalance) * bnbPrice;
    setWalletBalance( walletBalanceUsd );
  }

  const updateSupplyBalance = async () => {
    const bigfootBalance = await web3Instance.getBigFootBalance();
    const chefBalance = await web3Instance.getChefBalance();
    const totalUserBalanceUsd = ( parseFloat(bigfootBalance) + parseFloat(chefBalance) ) * bnbPrice;
    setSupplyBalance( totalUserBalanceUsd );
  }

  const updateAllOptions = () => {
    options.forEach( async(option) => {
      let newOptions = JSON.parse(JSON.stringify(options));
      const currentOption = newOptions.find(thatOption => thatOption.title === option.title);
      if(option.title==="bfBNB"){ //temp hack, until the rest of lending options are defined
        currentOption.bankStats = await web3Instance.getBankStats();
      }
      setOptions(newOptions);
    });
  }


  const togglemodal = async (chosenOption = null, action = '') => {

    //if wallet not connected
    if( !isModalOpen && !wallet.account){
      toast.warn("Connect your wallet");
      return;
    }

    if (isModalOpen) { //close...
      setFormData({
        chosenOption: chosenOption,
        action: action,
        amount: 0,
        userBalance: 0
      });
      setisModalOpen(false);
    } else { //open...
      let balance = 0;
      if (action === 'supply') {
        balance = await web3Instance.getUserBalance(); //balance in native token
      } else if (action === 'withdraw') {
        balance = await web3Instance.getUserBalance(chosenOption.address);
      }
      setFormData({
        chosenOption: chosenOption,
        action: action,
        amount: 0,
        userBalance: balance
      });
      setisModalOpen(true);
    }
  }

  const updateAmount = (value) => {
    let newFormData = {...formData};
    newFormData.amount = value
    setFormData(newFormData);
  }

  const setMax = (isNativeToken) => {
    let newAmount = 0;
    let gasReserve = 0.02;

    if (isNativeToken === true) {
      if( formData.userBalance > gasReserve ){
        newAmount = formData.userBalance - gasReserve; //leave a small amount for gas
        toast.info(`Leaving a small amount for gas (${gasReserve})`);
      } else {
        newAmount = formData.userBalance;
        toast.warn("Remember to leave some spare balance for gas.");
      } 
    } else {
      newAmount = formData.userBalance;  
    }

    updateAmount(newAmount);
  }

  const sendTransaction = () => {

    // VALIDATION
    if( !formData.amount || parseFloat(formData.amount) <= 0) {
      toast.warn("Please enter a valid amount")
      return;
    }

    const amount = Calculator.getWeiStrFromAmount(formData.amount);
    const bfbnbContract = web3Instance.getBfbnbBankContract();

    if(formData.action === 'supply'){
      // SUPPLY
      bfbnbContract.methods.deposit().send({from: userAddress, value: amount})
      .on('transactionHash', function (hash) {
        togglemodal()
        toast.info(`Supply in process. ${hash}`)
      })
      .on('receipt', function (receipt) {
        updateSupplyBalance();
        //updateAllOptions();
        toast.success(`Supply completed.`)
      })
      .on('error', function (error) {
        toast.warn(`Supply failed. ${error?.message}`)
      })
      .catch( error => {
        console.log(error?.message, "Supply error: ")
      });
    } else if (formData.action === 'withdraw') {
      // WITHDRAW
      bfbnbContract.methods.withdraw(amount).send({from: userAddress})
      .on('transactionHash', function (hash) {
        togglemodal()
        toast.info(`Withdraw in process. ${hash}`)
      })
      .on('receipt', function (receipt) {
        updateSupplyBalance();
        //updateAllOptions();
        toast.success(`Withdraw completed.`)
      })
      .on('error', function (error) {
        toast.warn(`Withdraw failed. ${error?.message}`)
      })
      .catch( error => {
        console.log(error?.message, "Withdraw error: ")
      });
    }
  }

  const renderFormContent = () => {

    const selectedOption = options.find( option => option.title === formData.chosenOption.title);
    const {title = '', currency = '', icon = ''} = selectedOption || {};
    
    if (formData.action === 'supply') {
      return (
        <React.Fragment>
          <p>I'd like to supply...</p>
          <FormGroup>
            <Row className="mb-3">
              <Col lg="6">
                <InputGroup className="mb-2">
                  <Label className="input-group-text">
                    <div className="avatar-xs me-3">
                      <span className={"avatar-title rounded-circle bg-transparent"} >
                        <img src={icon.default} />
                      </span>
                    </div>
                    {currency}
                  </Label>
                  <Input 
                    type="number" 
                    className="form-control" 
                    min={0}
                    step={0.000001}
                    value={formData.amount} 
                    onChange={(e) => updateAmount(e.target.value)}/>
                </InputGroup>
              </Col>
              <Col lg="6" className="max-balance-wrapper text-end">
                <span className="me-3">
                  Balance: {formData.userBalance}
              </span>
                <Button
                  outline
                  color="primary"
                  onClick={() => setMax(true) }
                >
                  MAX
              </Button>
              </Col>
            </Row>
          </FormGroup>
        </React.Fragment>
      );
    } else if (formData.action === 'withdraw') {
      return (
        <React.Fragment>
          <p>I'd like to withdraw...</p>
          <FormGroup>
            <Row>
              <Col sm="6" lg="8">
                <InputGroup className="mb-3">
                  <Label className="input-group-text">
                    <div className="avatar-xs me-3">
                      <span className={"avatar-title rounded-circle bg-transparent"} >
                        <img src={icon.default} />
                      </span>
                    </div>
                    {title}
                  </Label>
                  <Input 
                    type="number" 
                    className="form-control" 
                    min={0}
                    step={0.000001}
                    value={formData.amount}
                    onChange={(e) => updateAmount(e.target.value)}/>
                </InputGroup>
              </Col>
              <Col sm="6" lg="4" className="max-balance-wrapper text-end">
                <span className="me-3">
                  Balance: {formData.userBalance}
              </span>
                <Button
                  outline
                  color="primary"
                  onClick={ setMax }
                >
                  MAX
                </Button>
              </Col>
            </Row>
          </FormGroup>
        </React.Fragment>
      );
    }
  }

  const renderButtons = (option) => {
    return (
      <>
        <div className="mb-2">
          <Link
            to="#"
            className="btn btn-primary btn-sm w-xs"
            onClick={() => togglemodal(option, 'supply')}
          >
            Supply
          </Link>
        </div>
        <div>
          <Link
            to="#"
            className="btn btn-primary btn-sm w-xs"
            onClick={() => togglemodal(option, 'withdraw')}
          >
            Withdraw
          </Link>
        </div>
      </>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-information-variant text-primary h1" />
                    Your info
                  </h4>

                  <Row className="text-center mt-3">
                    <Col sm="6">
                      <div>
                        <p className="mb-2">Wallet Balance</p>
                        <p className="total-value">$ {Formatter.formatAmount(walletBalance)}</p>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div>
                        <p className="mb-2">Supply Balance</p>
                        <p className="total-value">$ {Formatter.formatAmount(supplyBalance)}</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-rocket-launch text-primary h1"/>
                    Lending
                  </h4>

                  <div className="table-responsive">
                    <Table className="table table-nowrap align-middle text-center mb-0">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col">APY</th>
                          <th scope="col">Total Supply</th>
                          <th scope="col">Total Borrow</th>
                          <th scope="col">Utilization</th>
                          <th scope="col">BigFoot Balance</th>
                          <th scope="col">BigFoot Chef</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {options.map((option, key) => (
                          <tr key={key}>
                            <th scope="row">
                              <div className="d-flex align-items-center">
                                <div className="avatar-xs me-3">
                                  <span className={"avatar-title rounded-circle bg-transparent"} >
                                    <img src={option.icon.default} />
                                  </span>
                                </div>
                                <span>{option.title}</span>
                              </div>
                            </th>
                            <td>
                              <div>
                                {option.isComingSoon ? "" : `${Formatter.getFormattedYield(option.bankStats?.apy)} %` }
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${Formatter.formatAmount(option.bankStats?.totalSupply)} ${option.currency}` }
                              </h5>
                              <div className="text-muted">
                                {option.isComingSoon ? "" : `($${Formatter.formatAmount((option.bankStats?.totalSupply * bnbPrice), 0)})` }
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${Formatter.formatAmount(option.bankStats?.totalBorrow)} ${option.currency}` }
                              </h5>
                              <div className="text-muted">
                                {option.isComingSoon ? "" : `($${Formatter.formatAmount((option.bankStats?.totalBorrow * bnbPrice), 0)})` }
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${option.bankStats?.utilization.toFixed(2)} %` }
                              </h5>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${Formatter.formatAmount(option.bankStats?.bigfootBalance)} ${option.currency}` }
                              </h5>
                              <div className="text-muted">
                                {option.isComingSoon ? "" : `($${Formatter.formatAmount((option.bankStats?.bigfootBalance * bnbPrice), 0)})` }
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${Formatter.formatAmount(option.bankStats?.bigfootChefBalance)} ${option.currency}` }
                              </h5>
                              <div className="text-muted">
                                {option.isComingSoon ? "" : `($${Formatter.formatAmount(option.bankStats?.bigfootChefBalance * bnbPrice)})` }
                              </div>
                            </td>
                            <td style={{ width: "120px" }}>
                              {option.isComingSoon ? "Coming Soon" : renderButtons(option) }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>

                <Modal
                  isOpen={isModalOpen}
                  role="dialog"
                  size="lg"
                  autoFocus={true}
                  centered={true}
                  toggle={() => togglemodal()}
                >
                  <div className="modal-content">
                    <ModalHeader toggle={() => togglemodal()}>
                      <span className="text-capitalize">
                        {formData.action}: 
                      </span>
                      &nbsp;
                      {formData.chosenOption?.title}
                    </ModalHeader>
                    <ModalBody>
                      <div
                        className="wizard clearfix"
                      >
                        <div className="content clearfix">
                          <Form>
                            { formData.chosenOption &&
                              renderFormContent()
                            }
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
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

export default Earn;