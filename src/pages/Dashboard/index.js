import React, { Component, useState, useEffect } from "react"
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

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

import Web3Class from '../../helpers/bigfoot/Web3Class'
import Formatter from '../../helpers/bigfoot/Formatter'
import farmPools from '../../data/farmPools'
import "./Dashboard.scss"
import { initialize } from "redux-form"

function Dashboard() {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [pools, setPools] = useState(farmPools);
  const [userBalances, setUserBalances] = useState({});
  const [formData, setFormData] = useState({
    poolTitle: '',
    currencySupply: {
      // currencyCodeA: amountA,
      // currencyCodeB: amountB,
      // ...
    },
    borrowFactor: 2
  });
  const [modal, setModal] = useState(false);
  const [poolStats, setPoolStats] = useState(null);

  useEffect(()=>{
    initializePoolStats();
  }, []);

  useEffect( () => {
    if(wallet.account) {
      initializeUserBalances();
    }
  }, [wallet]);

  useEffect( () => {
    if(poolStats){
      updatePoolStats();
    }
  }, [poolStats]);


  const initializePoolStats = () => {
    fetch(process.env.REACT_APP_API_URL)
      .then(res => res.json())
      .then(json => {
        setPoolStats(json);
      })
      .catch(error => console.log('Error fetching data from api. ', error));
  }

  const initializeUserBalances = () => {
    const allBalances = {};
    pools.forEach(pool => {
      pool.currencies.forEach( async (currency) => {
        if( allBalances[currency.code] === undefined) {

          
          // const balance = await web3Instance.getUserBalance();
          const balance = await web3Instance.getUserBalance(currency.address); // get user balance for this specific token
          allBalances[currency.code] = balance;
        }
      });
    });
    setUserBalances(allBalances);
  }

  const updatePoolStats = () => {
    const newPools = JSON.parse(JSON.stringify(pools));
    pools.forEach( pool => {
      const currentPool = newPools.find( thatPool => thatPool.title === pool.title);
      const data = poolStats[currentPool.apiKey];
      
      currentPool.rates.yieldFarming = data.farm.aprd * 365 * 3;
      currentPool.rates.eleApr = data.farm.aprl * 3 * 0.6;
      // @todo: currentPool.rates.tradingFee; 
      // @todo: currentPool.rates.borrowApy;
 
      currentPool.percentage =  currentPool.rates.yieldFarming + currentPool.rates.eleApr; //@todo: the sum will also include 'tradingFee' & 'borrowApy', once they're ready
      currentPool.percentageOut = data.farm.aprd * 365;
    });
    setPools(newPools);
  }

  const setBorrowFactor = (value) => {
    const newFormData = JSON.parse(JSON.stringify(formData));
    newFormData.borrowFactor = value;
    setFormData(newFormData);
  }

  const updateCurrencySupply = (currencyCode, value) => {
    const newFormData = JSON.parse(JSON.stringify(formData));
    newFormData.currencySupply[currencyCode] = value;
    setFormData(newFormData);
  }

  const togglemodal = (poolTitle) => {
    if(modal) { //reset formData and close
      setFormData({
        poolTitle: '',
        currencySupply: {},
        borrowFactor: 2
      });
      setModal(false);
    } else { //initialize formData and open

      // initialize currencySupply as { currencyCodeA: 0, currencyCodeB: 0, ...}
      const poolCurrencies = pools.find( pool => pool.title===poolTitle).currencies;
      const newCurrencySupply = Object.fromEntries(
        poolCurrencies.map(currency => [currency.code, 0])
      );

      setFormData({ 
        poolTitle: poolTitle,
        currencySupply: newCurrencySupply,
        borrowFactor: 2
      });      
      setModal(true);
    }
  }

  const renderIcon = (icon) => {
    return (
      <span className={ "avatar-title rounded-circle bg-transparent font-size-18" } >
        <img src={icon.default} />
      </span>
    )
  }


  const setMax = (currencyCode, isNativeToken) => {
    let amount = 0;
    let gasReserve = 0.02;
    const newFormData = JSON.parse(JSON.stringify(formData));

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

    newFormData.currencySupply[currencyCode] = amount;
    setFormData(newFormData);
  }

  return (
    <React.Fragment>
      <div id="Dashboard" className="page-content">
        <Container fluid>
          <Row className="equal-height">
            <Col md="4">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-lock text-primary h1" />
                      Total Value Locked
                    </h4>
                  <Row>
                    <Col sm="12">
                      <p className="total-value text-center">$ {Formatter.formatAmount(poolStats?.totalvaluelocked, 0)}</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-earth text-primary h1" />
                      Global
                    </h4>
                  <Row>
                    <Col sm="6">
                      <p className="mb-0">Total Collateral</p>
                    </Col>
                    <Col sm="6" className="text-end">
                      <p>$ 0.00</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <p className="mb-0">Total Borrow</p>
                    </Col>
                    <Col sm="6" className="text-end">
                      <p>$ 0.00</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <p className="mb-0">Active Positions</p>
                    </Col>
                    <Col sm="6" className="text-end">
                      <p>0 Positions</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col md="4">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-information-variant text-primary h1" />
                      Your info
                    </h4>

                  <Row>
                    <Col sm="12">
                      <div>
                        <p className="mb-2">Total Collateral</p>
                        <h5>$ 0.00</h5>
                      </div>
                    </Col>
                    <Col sm="12" className="mb-0">
                      <div>
                        <p className="mb-2">Total Borrow</p>
                        <h5>$ 0.00</h5>
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
                    <i className="mdi mdi-tractor-variant text-primary h1" />
                      Farm Pools
                    </h4>

                  <div className="table-responsive">
                    <Table className="table table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th scope="col" className="text-center">Pair</th>
                          <th scope="col">Type</th>
                          <th scope="col">Percentage</th>
                          <th scope="col" colSpan="2">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pools.map((pool, index) => (
                          <tr key={index}>
                            <th scope="row">
                              <div className="d-flex align-items-center">
                                <div className="avatar-xs avatar-multi">
                                  {
                                    pool.customIcon ?
                                      renderIcon(pool.customIcon) :
                                      pool.currencies.map((currency, index) => {
                                        return (
                                          <React.Fragment key={index}>
                                            {renderIcon(currency.icon)}
                                          </React.Fragment>
                                        )
                                      })
                                  }
                                </div>
                              </div>
                            </th>
                            <td>
                              <div className="text-muted">
                                {pool.type}
                              </div>
                              <h5 className="font-size-14 mb-1">
                                {pool.title}
                              </h5>
                            </td>
                            <td>
                              <h5 className="font-size-20 mb-1">
                                {pool.percentage ?
                                  pool.percentage.toFixed(2) + " %" :
                                  "--"
                                }
                              </h5>
                              <div className="text-muted">
                                <del>
                                  {pool.percentageOut ?
                                    pool.percentageOut.toFixed(2) + " %" :
                                    "--"
                                  }
                                </del>
                              </div>
                            </td>
                            <td>
                              {
                                Object.keys(pool.rates).map((key) => {
                                  return (
                                    <Row key={key}>
                                      <Col sm="6">
                                        {key === 'yieldFarming' && 'Yield Farming'}
                                        {key === 'eleApr' && 'ELE APR'}
                                        {key === 'tradingFee' && 'Trading Fee'}
                                        {key === 'borrowApy' && 'Borrow APY'}
                                      </Col>
                                      <Col sm="6" className="text-end">
                                        {pool.rates[key] ?
                                          pool.rates[key].toFixed(2) + " %" :
                                          "--"
                                        }
                                      </Col>
                                    </Row>
                                  )
                                })
                              }
                            </td>
                            <td style={{ width: "120px" }}>
                              <Link
                                to="#"
                                className="btn btn-primary btn-sm w-xs"
                                onClick={() => togglemodal(pool.title)}
                              >
                                Farm
                                </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>

                <Modal
                  id="dashboardModal"
                  isOpen={modal}
                  role="dialog"
                  size="lg"
                  autoFocus={true}
                  centered={true}
                  toggle={togglemodal}
                >
                  <div className="modal-content">
                    <ModalHeader toggle={togglemodal}>
                      Farm: {formData.poolTitle}
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
                                formData.poolTitle &&
                                pools.find(pool => pool.title === formData.poolTitle).currencies.map((currency, index) => {
                                  return (
                                    <FormGroup key={currency.code}>
                                      <Row>
                                        <Col sm="6" lg="8">
                                          <InputGroup className="mb-3">
                                            <Label className="input-group-text">
                                              <span className="me-2">
                                                {renderIcon(currency.icon)}
                                              </span>
                                              {currency.code}
                                            </Label>
                                            <Input
                                              type="number"
                                              className="form-control"
                                              min="0"
                                              step="0.000001"
                                              value={formData.currencySupply?.[currency.code] ?? 0}
                                              onChange={(e) => updateCurrencySupply(currency.code, e.target.value)}
                                            />
                                          </InputGroup>
                                        </Col>
                                        <Col sm="6" lg="4" className="max-balance-wrapper text-end">
                                          <span className="me-3">
                                            Balance: {userBalances[currency.code]}
                                            </span>
                                          <Button
                                            outline
                                            color="primary"
                                            onClick={() => {
                                              if(currency.address){
                                                setMax(currency.code, false);
                                              }else{
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
                              <Slider
                                value={formData.borrowFactor}
                                min={1.5}
                                max={3}
                                step={0.5}
                                labels={{ 1.5: "1.5", 2: "2.0", 2.5: "2.5", 3: "3.0" }}
                                orientation="horizontal"
                                onChange={value => {
                                  setBorrowFactor(value)
                                }}
                              />
                            </div>
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
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard;
