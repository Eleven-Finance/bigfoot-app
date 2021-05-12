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
  Spinner,
} from "reactstrap"
import NumericInput from 'react-numeric-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Web3Class from 'helpers/bigfoot/Web3Class'
import Formatter from 'helpers/bigfoot/Formatter'
import Calculator from "helpers/bigfoot/Calculator";
import farmPools from '../../data/farmPools'
import usePositions from 'hooks/usePositions';
import LeverageModal from "components/BigFoot/LeverageModal";
import Icon from "components/BigFoot/Icon"
import "./Dashboard.scss"


function Dashboard() {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const { isLoadingPositions, allPositions, myPositions } = usePositions();

  const [pools, setPools] = useState(farmPools);
  const [chosenPool, setChosenPool] = useState(null);
  const [userBalances, setUserBalances] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poolStats, setPoolStats] = useState(null);
  const [bankStats, setBankStats] = useState(null);
  const [bnbPrice, setBnbPrice] = useState(0);

  const initialLeverages = Object.fromEntries(pools.map( pool => {
    const max = Math.floor(pool.maxLeverage * 2) / 2; //round to the nearest 0.5
    return [pool.title, max]
  }));
  const [leverages, setLeverages] = useState(initialLeverages);

  const [globalInfo, setGlobalInfo] = useState({
    totalCollateral: undefined,
    totalBorrow: undefined,
    activePositions: undefined,
  });
  const [yourInfo, setYourInfo] = useState({
    yourTotalCollateral: undefined,
    yourTotalBorrow: undefined,
  });

  useEffect(()=>{
    initializePoolStats();
  }, []);

  useEffect( async () => {
    if(wallet.account) {
      //set user balances
      const allBalances = web3Instance.getUserBalancesForPools(pools);
      setUserBalances(allBalances);

      //get bnb price
      const price = await web3Instance.getBnbPrice();
      setBnbPrice(price);
    }
  }, [wallet]);

  useEffect( async () => {
    if(wallet.account) {
      const stats = await web3Instance.getBankStats();
      setBankStats(stats);
    }
  }, [wallet]);

  useEffect( () => {
    if(poolStats){
      updatePoolStats();
    }
  }, [bankStats, poolStats, leverages]);

  useEffect( ()=>{
    updateGlobalInfo();
  }, [allPositions]);

  useEffect( ()=>{
    if(bnbPrice){
      updateYourInfo();
    }
  }, [myPositions, bnbPrice]);

  const initializePoolStats = () => {
    fetch(process.env.REACT_APP_API_URL)
      .then(res => res.json())
      .then(json => {
        setPoolStats(json);
      })
      .catch(error => console.log('Error fetching data from api. ', error));
  }


  const updatePoolStats = () => {
    const newPools = JSON.parse(JSON.stringify(pools));
    pools.forEach( pool => {

      const poolInitialValues = farmPools.find( thatPool => thatPool.title === pool.title);
      const currentPool = newPools.find( thatPool => thatPool.title === pool.title);
      const data = poolStats[currentPool.apiKey];
      
      const currentLeverage = leverages[pool.title];
      const multiplier = (currentLeverage - 1) * 2;

      const yieldFarming = data.farm.aprd * 365 * currentLeverage;
      const eleApr = data.farm.aprl * currentLeverage;
      const tradingFee = (poolInitialValues.rates.tradingFee ?? 0) * multiplier;

      let borrowApy = 0;
      if(bankStats){
        borrowApy = bankStats.apyFactor * multiplier / 2;
      }

      currentPool.rates = { yieldFarming, eleApr, tradingFee, borrowApy }
      currentPool.percentage = yieldFarming + eleApr + tradingFee + borrowApy;
      currentPool.percentageOut = data.farm.aprd * 365;
    });
    setPools(newPools);
  }

  const updateGlobalInfo = () => {

    let collateral = 0;
    let borrow = 0;

    allPositions.forEach( position => {
      collateral += Calculator.getPositionCollateral(position) * bnbPrice;
      borrow += Calculator.getPositionDebt(position) * bnbPrice;
    });

    setGlobalInfo({
      totalCollateral: collateral,
      totalBorrow: borrow,
      activePositions: allPositions.length
    });
  }

  const updateYourInfo = () => {

    let ownTotalCollateral = 0;
    let ownTotalBorrow = 0;

    myPositions.forEach( position => {
      ownTotalCollateral += Calculator.getPositionCollateral(position) * bnbPrice;
      ownTotalBorrow += Calculator.getPositionDebt(position) * bnbPrice;
    });

    setYourInfo({
      yourTotalCollateral: ownTotalCollateral,
      yourTotalBorrow: ownTotalBorrow,
    });
  }


  const updateLeverage = (poolTitle, value) => {
    let newLeverages = {...leverages};
    newLeverages[poolTitle] = value;
    setLeverages(newLeverages);
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
              <Card className={ wallet.account && isLoadingPositions && 'card-loading'}>
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
                      <p>$ {Formatter.formatAmount(globalInfo.totalCollateral, 0)}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <p className="mb-0">Total Borrow</p>
                    </Col>
                    <Col sm="6" className="text-end">
                      <p>$ {Formatter.formatAmount(globalInfo.totalBorrow, 0)}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <p className="mb-0">Active Positions</p>
                    </Col>
                    <Col sm="6" className="text-end">
                      <p>{globalInfo.activePositions} Positions</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col md="4">
              <Card className={ wallet.account && isLoadingPositions && 'card-loading'}>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-information-variant text-primary h1" />
                      Your info
                    </h4>

                  <Row>
                    <Col sm="12">
                      <div>
                        <p className="mb-2">Total Collateral</p>
                        <h5>$ {Formatter.formatAmount(yourInfo.yourTotalCollateral)}</h5>
                      </div>
                    </Col>
                    <Col sm="12" className="mb-0">
                      <div>
                        <p className="mb-2">Total Borrow</p>
                        <h5>$ {Formatter.formatAmount(yourInfo.yourTotalBorrow)}</h5>
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
                          <th scope="col">APR</th>
                          <th scope="col">Details</th>
                          <th scope="col" colSpan="2">Leverage</th>
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
                            <td style={{ width: "140px" }}>
                              <NumericInput 
                              min={1.5} 
                              max={initialLeverages[pool.title]} 
                              step={0.5} 
                              precision={1} 
                              value={leverages[pool.title]} 
                              snap 
                              strict 
                              onChange={ (valueAsNumber) => updateLeverage(pool.title, valueAsNumber) }
                              />
                            </td>
                            <td style={{ width: "120px" }}>
                              {pool.isComingSoon ?
                                <Link
                                  to="#"
                                  className="btn btn-primary btn-sm w-xs btn-coming-soon"
                                >
                                  Stay Tuned
                                </Link> :
                                <Link
                                  to="#"
                                  className="btn btn-primary btn-sm w-xs"
                                  onClick={() => togglemodal(pool)}
                                >
                                  Farm
                              </Link>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>

                { chosenPool && 
                  <LeverageModal 
                    isOpen={isModalOpen} 
                    togglemodal={togglemodal} 
                    pool={chosenPool} 
                    initialLeverage={leverages[chosenPool.title]}
                    userBalances={userBalances} 
                    />
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
