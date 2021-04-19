import React, { Component, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
} from "reactstrap"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Web3Class from '../../helpers/bigfoot/Web3Class'
import Formatter from '../../helpers/bigfoot/Formatter'
import farmPools from '../../data/farmPools'
import "./Dashboard.scss"
import LeverageModal from "components/BigFoot/LeverageModal";
import Icon from "components/BigFoot/Icon"


function Dashboard() {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [pools, setPools] = useState(farmPools);
  const [chosenPool, setChosenPool] = useState(null);
  const [userBalances, setUserBalances] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const togglemodal = (pool) => {

    //if wallet not connected
    if( !isModalOpen && !wallet.account){
      toast.warn("Connect your wallet");
      return;
    }

    if(isModalOpen) {//close
      setChosenPool(null);
      setIsModalOpen(false);
    } else {//open
      setChosenPool(pool);
      setIsModalOpen(true);
    }
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
                                      <Icon icon={pool.customIcon} /> :
                                      pool.currencies.map((currency, index) => {
                                        return (
                                          <React.Fragment key={index}>
                                            <Icon icon={currency.icon} />                                      
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
                                onClick={() => togglemodal(pool)}
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

                { chosenPool && 
                  <LeverageModal isOpen={isModalOpen} togglemodal={togglemodal} pool={chosenPool} userBalances={userBalances} />
                }      
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard;
