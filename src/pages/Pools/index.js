import React, {useEffect, useState} from "react"
import { connect } from "react-redux"

// import PoolsUpperInfo from './PoolsUpperInfo'
import poolOptions from '../../data/poolOptions'
import { addressMasterChef } from '../../data/addresses/addresses';
import Web3Class from '../../helpers/bigfoot/Web3Class'
import Formatter from '../../helpers/bigfoot/Formatter'

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
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Label,
  Input,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

import { Link } from "react-router-dom"
import './Pools.scss'

const Pools = props => {

  // initialize wallet variables
  const web3 = props.walletData.web3;
  const userAddress = props.walletData.accounts?.[0];

  const web3Instance = new Web3Class(web3, userAddress);


  const [pools, setPools] = useState(poolOptions);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [activeTab, setactiveTab] = useState(1);
  const [formData, setFormData] = useState({
    chosenPool: null, // pool option chosen by the user (defined by pool.title)
    action: '', // deposit,withdraw
    amount: 0,
    userBalance: 0,
  });
  const [poolStats, setPoolStats] = useState();

  useEffect( () => {
    //@todo: move to .env, implement as a service
    const apiBaseUrl = 'https://eleven.finance';
    fetch( apiBaseUrl + '/api.json' )
      .then(response => response.json())
      .then(json => {
        setPoolStats(json)
      })
      .catch( error => console.log('Error fetching data from api. ', error) )
  }, []);

  useEffect( () => {
    if(web3) {
      updateAllPools();
    }
  }, [web3]);


  const updateAllPools = () => {
    pools.forEach(async (pool) => {
      let newPools = JSON.parse(JSON.stringify(pools))

      //update pool approval
      if (pool.address) {
        const approval = await web3Instance.checkApproval(pool.address, addressMasterChef);
        if (approval) {
          newPools.find(thatPool => thatPool.title === pool.title).isAuthorized = true;
        }
      }

      //update pending rewards
      if (pool.pid) {
        const rewards = await web3Instance.getPendingRewards(pool.pid);
        if (parseFloat(rewards) > 0) {
          newPools.find(thatPool => thatPool.title === pool.title).pendingRewards = rewards;
        }
      }

      // update state
      setPools(newPools);
    });
  }

  const requestPoolApproval = (poolAddress) => {

    if( !web3){
      toastr.warning("Connect your wallet");
      return;
    }

    const erc20 = web3Instance.getErc20Contract(poolAddress);
    const maxUint = web3Instance.maxUint;
    erc20.methods.approve(addressMasterChef, maxUint).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toastr.info(hash, "Pool authorization in process: ")
      })
      .on('receipt', function (receipt) {
        updateAllPools();
        toastr.success(receipt, "Pool authorization accepted: ")
      })
      .on('error', function (error) {
        toastr.warning(error?.message, "Pool authorization failed: ")
      })
      .catch((error) => {
        console.log(error?.message, "Pool authorization error: ")
      });
  }

  const togglemodal = async (chosenPool = null, action = '') => {
    if(isModalOpen){ //close...
    setFormData({
        chosenPool: chosenPool,
      action: action,
        amount: 0,
        userBalance: 0
    });
      setisModalOpen(false);
    } else { //open...
      let balance = 0;
      if(action === 'deposit'){
        balance = await web3Instance.getUserBalance(chosenPool.address);
      } else if(action === 'withdraw'){
        balance = await web3Instance.getStakedCoins(chosenPool.pid);
      }
      setFormData({
        chosenPool: chosenPool,
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

    const pid = formData.chosenPool.pid;
    const amount = web3Instance.getWeiStrFromAmount(formData.amount);
    const masterchefContract = web3Instance.getMasterchefContract();

    if(formData.action === 'deposit'){
      // DEPOSIT
      masterchefContract.methods.deposit(pid, amount).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        togglemodal()
        toastr.info(hash, "Pool deposit in process: ")
      })
      .on('receipt', function (receipt) {
        updateAllPools();
        toastr.success(receipt, "Pool deposit completed: ")
      })
      .on('error', function (error) {
        toastr.warning(error?.message, "Pool deposit failed: ")
      })
      .catch( error => {
        console.log(error?.message, "Pool deposit error: ")
      });
    } else if (formData.action === 'withdraw') {
      // WITHDRAW
      masterchefContract.methods.withdraw(pid, amount).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        togglemodal()
        toastr.info(hash, "Pool withdraw in process: ")
      })
      .on('receipt', function (receipt) {
        updateAllPools();
        toastr.success(receipt, "Pool withdraw completed: ")
      })
      .on('error', function (error) {
        toastr.warning(error?.message, "Pool withdraw failed: ")
      })
      .catch( error => {
        console.log(error?.message, "Pool withdraw error: ")
      });
    }
  }

  const requestHarvest = (pool) => {

    const pid = pool.pid;
    const amount = 0; // deposit with 0 will harvest pending rewards
    const masterchefContract = web3Instance.getMasterchefContract();

    // HARVEST
    masterchefContract.methods.deposit(pid, amount).send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toastr.info(hash, "Harvest in process: ")
      })
      .on('receipt', function (receipt) {
        updateAllPools();
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

    const selectedOption = pools.find( pool => pool.title === formData.chosenPool?.title);
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

  const renderButtons = (pool) => {
    if (pool.isComingSoon){
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
    else if (pool.isAuthorized) {
      return (
        <Row>
          <Col sm="6" className="mb-2">
            <Button
              block
              outline
              color={ parseFloat(pool.pendingRewards) === 0 ? "primary" : "secondary" }
              onClick={ () => togglemodal(pool, 'deposit') }
            >
              Deposit
            </Button>
          </Col>
          <Col sm="6" className="mb-2">
            <Button
              block
              outline
              onClick={ () => togglemodal(pool, 'withdraw') }
            >
              Withdraw
            </Button>
          </Col>
          <Col sm="12">
            <Button
              block
              color={ parseFloat(pool.pendingRewards) > 0 ? "primary" : "secondary" }
              disabled={ ! (parseFloat(pool.pendingRewards) > 0) }
              onClick={ () => requestHarvest(pool) }
            >
              Harvest { Math.floor(web3Instance.getAmoutFromWeis(pool.pendingRewards) * 10000) / 10000 } ELE
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
              onClick={ () => requestPoolApproval(pool.address) }
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
      <div id="Pools" className="page-content">
        <Container fluid>

          {/* <PoolsUpperInfo /> */}

          <Row className="equal-height">
            { pools.map( pool => {
              return (
                <Col key={pool.title} md="4">
                  <Card className="pool-card">
                    <CardBody>

                      <h4 className="card-title">
                        <span className={"avatar-title rounded-circle bg-transparent font-size-18 me-2"} >
                          <img src={pool.poolIcon.default} />
                        </span>
                        {pool.title}
                      </h4>

                      <p className="text-muted">
                        Accepting 
                        {pool.currencies.map( (currency, index) => {
                            return index===0? ` ${currency.code}` : `, ${currency.code}` 
                          })
                        }
                      </p>

                      <div className="pool-icon d-flex align-items-center">
                        <div className="avatar-xs avatar-multi mt-2">
                          {pool.currencies.map((currency) => {
                            return (
                              <span key={currency.code} className={"avatar-title rounded-circle bg-transparent"} >
                                <img src={currency.icon.default} />
                              </span>
                            );
                          })
                          }
                        </div>
                      </div>

                      <Row className="pool-stats">
                        <Col sm="12" className="d-flex justify-content-between align-items-end">
                          <span className="mb-2">APY</span>
                          <span className="pool-stats-value">
                            {Formatter.getFormattedYield(poolStats?.[pool.statsKey]?.farm?.apy)}%
                          </span>
                        </Col>
                        <Col sm="12" className="d-flex justify-content-between align-items-end">
                          <span className="mb-2">Lend APY</span>
                          <span className="pool-stats-value">
                            {Formatter.getFormattedYield(poolStats?.[pool.statsKey]?.farm?.aprd)}%
                          </span>
                        </Col>
                        <Col sm="12" className="d-flex justify-content-between align-items-end">
                          <span className="mb-2">ELE APR</span>
                          <span className="pool-stats-value">
                            {Formatter.getFormattedYield(poolStats?.[pool.statsKey]?.farm?.aprl)}%
                          </span>
                        </Col>
                        <Col sm="12">
                        </Col>
                      </Row>

                      { renderButtons(pool) }

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
                {formData.chosenPool?.title}
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



const mapStateToProps = state => {
  return {
    walletData: state.wallet.walletData,
  }
}

export default connect(mapStateToProps, {} )(Pools);