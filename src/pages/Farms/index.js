import React, {useEffect, useState} from "react"
import { Link } from "react-router-dom"
import { useWallet } from 'use-wallet'
import {
  Container,
  Row,
  Button,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

// import FarmsUpperInfo from './FarmsUpperInfo'
import farmOptions from '../../data/farmOptions'
import { addressMasterChef } from '../../data/addresses/addresses';
import Web3Class from '../../helpers/bigfoot/Web3Class'
import Formatter from '../../helpers/bigfoot/Formatter'
import './Farms.scss'

const Farms = () => {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [farms, setFarms] = useState(farmOptions);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    chosenFarm: null, // farm option chosen by the user
    action: '', // deposit,withdraw
    amount: 0,
    userBalance: 0,
  });
  const [farmStats, setFarmStats] = useState();

  useEffect( () => {
    //@todo: move to .env, implement as a service
    const apiBaseUrl = 'https://eleven.finance';
    fetch( apiBaseUrl + '/api.json' )
      .then(response => response.json())
      .then(json => {
        setFarmStats(json)
      })
      .catch( error => console.log('Error fetching data from api. ', error) )
  }, []);

  useEffect( () => {
    if(wallet.account) {
      updateAllFarms();
    }
  }, [wallet]);

  const updateAllFarms = () => {
    farms.forEach(async (farm) => {
      let newFarms = JSON.parse(JSON.stringify(farms))

      //update farm approval
      if (farm.address) {
        const approval = await web3Instance.checkApproval(farm.address, addressMasterChef);
        if (approval) {
          newFarms.find(thatFarm => thatFarm.title === farm.title).isAuthorized = true;
        }
      }

      //update pending rewards
      if (farm.pid) {
        const rewards = await web3Instance.getPendingRewards(farm.pid);
        if (parseFloat(rewards) > 0) {
          newFarms.find(thatFarm => thatFarm.title === farm.title).pendingRewards = rewards;
        }
      }

      // update state
      setFarms(newFarms);
    });
  }

  const requestFarmApproval = (farmAddress) => {

    if( !wallet.account){
      toastr.warning("Connect your wallet");
      return;
    }

    const erc20 = web3Instance.getErc20Contract(farmAddress);
    const maxUint = web3Instance.maxUint;
    erc20.methods.approve(addressMasterChef, maxUint).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toastr.info(hash, "Farm authorization in process: ")
      })
      .on('receipt', function (receipt) {
        updateAllFarms();
        toastr.success(receipt, "Farm authorization accepted: ")
      })
      .on('error', function (error) {
        toastr.warning(error?.message, "Farm authorization failed: ")
      })
      .catch((error) => {
        console.log(error?.message, "Farm authorization error: ")
      });
  }

  const togglemodal = async (chosenFarm = null, action = '') => {
    if (isModalOpen) { //close...
      setFormData({
        chosenFarm: chosenFarm,
        action: action,
        amount: 0,
        userBalance: 0
      });
      setisModalOpen(false);
    } else { //open...
      let balance = 0;
      if (action === 'deposit') {
        balance = await web3Instance.getUserBalance(chosenFarm.address);
      } else if (action === 'withdraw') {
        balance = await web3Instance.getStakedCoins(chosenFarm.pid);
      }
      setFormData({
        chosenFarm: chosenFarm,
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

  const setMax = () => {
    updateAmount(formData.userBalance);
  }

  const sendTransaction = () => {

    // VALIDATION
    if( parseFloat(formData.amount) <= 0) {
      toastr.warning("Please enter a valid amount")
      return;
    }

    const pid = formData.chosenFarm.pid;
    const amount = web3Instance.getWeiStrFromAmount(formData.amount);
    const masterchefContract = web3Instance.getMasterchefContract();

    if(formData.action === 'deposit'){
      // DEPOSIT
      masterchefContract.methods.deposit(pid, amount).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        togglemodal()
        toastr.info(hash, "Farm deposit in process: ")
      })
      .on('receipt', function (receipt) {
        updateAllFarms();
        toastr.success(receipt, "Farm deposit completed: ")
      })
      .on('error', function (error) {
        toastr.warning(error?.message, "Farm deposit failed: ")
      })
      .catch( error => {
        console.log(error?.message, "Farm deposit error: ")
      });
    } else if (formData.action === 'withdraw') {
      // WITHDRAW
      masterchefContract.methods.withdraw(pid, amount).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        togglemodal()
        toastr.info(hash, "Farm withdraw in process: ")
      })
      .on('receipt', function (receipt) {
        updateAllFarms();
        toastr.success(receipt, "Farm withdraw completed: ")
      })
      .on('error', function (error) {
        toastr.warning(error?.message, "Farm withdraw failed: ")
      })
      .catch( error => {
        console.log(error?.message, "Farm withdraw error: ")
      });
    }
  }

  const requestHarvest = (farm) => {

    const pid = farm.pid;
    const amount = 0; // deposit with 0 will harvest pending rewards
    const masterchefContract = web3Instance.getMasterchefContract();

    // HARVEST
    masterchefContract.methods.deposit(pid, amount).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toastr.info(hash, "Harvest in process: ")
      })
      .on('receipt', function (receipt) {
        updateAllFarms();
        toastr.success(receipt, "Harvest completed: ")
      })
      .on('error', function (error) {
        toastr.warning(error?.message, "Harvest failed: ")
      })
      .catch(error => {
        console.log(error?.message, "Harvest error: ")
      });
  }

  const renderFormContent = () => {

    const selectedOption = farms.find( farm => farm.title === formData.chosenFarm?.title);
    const {title = ''} = selectedOption || {};
    
    if (formData.action === 'deposit') {
      return (
        <React.Fragment>
          <p>I'd like to deposit...</p>
          <FormGroup>
            <Row>
              <Col sm="6" lg="8">
                <InputGroup className="mb-3">
                  <Label className="input-group-text">
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
    } else if (formData.action === 'withdraw') {
      return (
        <React.Fragment>
          <p>I'd like to withdraw...</p>
          <FormGroup>
            <Row>
              <Col sm="6" lg="8">
                <InputGroup className="mb-3">
                  <Label className="input-group-text">
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

  const renderButtons = (farm) => {
    if (farm.isComingSoon){
      return(
        <Row className="coming-soon-buttons">
          <Col sm="12">
            <Button
              block
              outline
              disabled={true}
            >
              Coming soon
            </Button>
          </Col>
        </Row>
      );
    }
    else if (farm.isAuthorized) {
      return (
        <Row>
          <Col sm="6" className="mb-2">
            <Button
              block
              outline
              color={ parseFloat(farm.pendingRewards) === 0 ? "primary" : "secondary" }
              onClick={ () => togglemodal(farm, 'deposit') }
            >
              Deposit
            </Button>
          </Col>
          <Col sm="6" className="mb-2">
            <Button
              block
              outline
              onClick={ () => togglemodal(farm, 'withdraw') }
            >
              Withdraw
            </Button>
          </Col>
          <Col sm="12">
            <Button
              block
              color={ parseFloat(farm.pendingRewards) > 0 ? "primary" : "secondary" }
              disabled={ ! (parseFloat(farm.pendingRewards) > 0) }
              onClick={ () => requestHarvest(farm) }
            >
              Harvest { Math.floor(web3Instance.getAmoutFromWeis(farm.pendingRewards) * 10000) / 10000 } ELE
              </Button>
          </Col>
        </Row>
      );
    } else {
      return(
        <Row className="authorize-buttons">
          <Col sm="12">
            <Button
              block
              outline
              color="primary"
              onClick={ () => requestFarmApproval(farm.address) }
            >
              Authorize
            </Button>
          </Col>
        </Row>
      );
    }
  }

  return (
    <React.Fragment>
      <div id="Farms" className="page-content">
        <Container fluid>

          {/* <FarmsUpperInfo /> */}

          <Row className="equal-height">
            { farms.map( farm => {
              return (
                <Col key={farm.title} md="4">
                  <Card className="farm-card">
                    <CardBody>

                      <h4 className="card-title">
                        <span className={"avatar-title rounded-circle bg-transparent font-size-18 me-2"} >
                          <img src={farm.farmIcon.default} />
                        </span>
                        {farm.title}
                      </h4>

                      <p className="text-muted">
                        Accepting 
                        {farm.currencies.map( (currency, index) => {
                            return index===0? ` ${currency.code}` : `, ${currency.code}` 
                          })
                        }
                      </p>

                      <div className="farm-icon d-flex align-items-center">
                        <div className="avatar-xs avatar-multi mt-2">
                          {farm.currencies.map((currency) => {
                            return (
                              <span key={currency.code} className={"avatar-title rounded-circle bg-transparent"} >
                                <img src={currency.icon.default} />
                              </span>
                            );
                          })
                          }
                        </div>
                      </div>

                      <Row className="farm-stats">
                        <Col sm="12" className="d-flex justify-content-between align-items-end">
                          <span className="mb-2">APY</span>
                          <span className="farm-stats-value">
                            {Formatter.getFormattedYield(farmStats?.[farm.statsKey]?.farm?.apy)}%
                          </span>
                        </Col>
                        <Col sm="12" className="d-flex justify-content-between align-items-end">
                          <span className="mb-2">Lend APY</span>
                          <span className="farm-stats-value">
                            {Formatter.getFormattedYield(farmStats?.[farm.statsKey]?.farm?.aprd)}%
                          </span>
                        </Col>
                        <Col sm="12" className="d-flex justify-content-between align-items-end">
                          <span className="mb-2">ELE APR</span>
                          <span className="farm-stats-value">
                            {Formatter.getFormattedYield(farmStats?.[farm.statsKey]?.farm?.aprl)}%
                          </span>
                        </Col>
                        <Col sm="12">
                        </Col>
                      </Row>

                      { renderButtons(farm) }

                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>

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
                {formData.chosenFarm?.title}
              </ModalHeader>
              <ModalBody>
                <div
                  className="wizard clearfix"
                >
                  <div className="content clearfix">
                    <Form>
                      {renderFormContent()}
                      <p>
                        Note: BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved when using this product. Please read <a href="#">here</a> to understand the risks involved.
                            </p>
                    </Form>
                  </div>
                  <div className="actions clearfix">
                    <ul role="menu" aria-label="Pagination">
                      <li
                        className={"next"}
                      >
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
          
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Farms;