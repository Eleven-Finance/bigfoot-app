import React, {useEffect, useState} from "react"
import { connect } from "react-redux"

// import PoolsUpperInfo from './PoolsUpperInfo'
import poolOptions from '../../data/poolOptions'
import { addressMasterChef } from '../../data/addresses/addresses';
import Web3Class from '../../helpers/bigfoot/Web3Class'

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


  useEffect( () => {
    if(web3) {
      updateAllPools();
    }
  }, [web3]);



  const updateAllPools = () => {
    pools.forEach( pool => {
      if(pool.address) {
        updatePoolApproval(pool) 
      }
    });
  }

  const updatePoolApproval = async (pool) => {
    const allowance = await web3Instance.checkApproval(pool.address, addressMasterChef);
    if(allowance){
      let newPools = JSON.parse(JSON.stringify(pools));
      newPools.find(thatPool => thatPool.title === pool.title).isAuthorized = true;
      setPools(newPools);
    }
  }

  const requestPoolApproval = (poolAddress) => {
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
        toastr.warning(error, "Pool authorization failed: ")
      })
      .catch((error) => {
        console.log(error, "Pool authorization error: ")
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
                    step={0.01}
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
                  onClick={() => {
                    console.log("set max.")
                  }}
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
                    step={0.01}
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
                  onClick={() => {
                    console.log("set max.")
                  }}
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
              color="primary"
              disabled={ !pool.canHarvest }
              onClick={() => {
                console.log("Harvest")
              }}
            >
              Harvest
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

                      <div className="d-flex align-items-center mt-4 mb-3">
                        <div className="avatar-xs avatar-multi">
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

                      <Row>
                        <Col sm="12" className="d-flex justify-content-between align-items-end">
                          <span className="mb-2">APY</span>
                          <span className="pool-apy-value">
                            {pool.apy}%
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
                          onClick={() => {
                            console.log("confirm...")
                          }}
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