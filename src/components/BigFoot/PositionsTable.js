import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {Button,Table} from "reactstrap"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Web3Class from 'helpers/bigfoot/Web3Class'
import Calculator from 'helpers/bigfoot/Calculator'
import Formatter from 'helpers/bigfoot/Formatter';
import farmPools from 'data/farmPools'
import lendingOptions from 'data/lendingOptions'
import Icon from "./Icon"
import LeverageModal from './LeverageModal';
import usePriceList from 'hooks/usePriceList';

import Tooltip from '@material-ui/core/Tooltip';

const renderPoolInfo = (pool) => {
  let icons;

  if (pool.customIcon) {
    icons = <Icon icon={pool.customIcon} />
  } else {
    icons = pool.currencies.map((currency, index) => {
      return (
        <React.Fragment key={index}>
          <Icon icon={currency.icon} />                                      
        </React.Fragment>
      )
    })
  }

  return (
    <>
      <span className="avatar-xs avatar-multi" style={{minWidth: "3rem"}}>
        {icons}
      </span>
      <span style={{minWidth: "7rem"}}>
        {pool.title}
      </span>
    </>
  );
}



function PositionsTable(props) {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const {positions, updatePositions, showAll} = props;

  const { priceList, isLoadingPriceList } = usePriceList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenPosition, setChosenPosition] = useState(null);
  const [chosenPool, setChosenPool] = useState(null);
  const [userBalances, setUserBalances] = useState({});
  const [rewards, setRewards] = useState();

  useEffect( async () => {
    if(wallet.account) {
      const allBalances = web3Instance.getUserBalancesForPools(farmPools);
      setUserBalances(allBalances);
    }
  }, [wallet]);

  useEffect( async () => {
    if(!showAll){ //only 'my-positions'
      const rewardsObj = {};
      positions.forEach( async (position) => {
        // get pending rewards (E11)
        // rewardsObj[position.positionId] = await web3Instance.getPendingE11(position.positionData.bigfoot, position.positionId);
      });
      setRewards(rewardsObj);
    }
  }, [positions]);


  const togglemodal = (position, pool) => {

    //if wallet not connected
    if( !isModalOpen && !wallet.account){
      toast.warn("Connect your wallet");
      return;
    }

    if(isModalOpen) {//close
      setChosenPosition(null);
      setChosenPool(null);
      setIsModalOpen(false);
    } else {//open
      setChosenPosition(position);
      setChosenPool(pool);
      setIsModalOpen(true);
    }
  }

  const requestClaim = async (positionId, bigfootAddress) => {
    const request = await web3Instance.reqClaimE11(positionId, bigfootAddress);
    request.send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toast.info(`Claiming E11... ${hash}`)
      })
      .on('receipt', function (receipt) {
        toast.success(`E11 collected :)`)
      })
      .on('error', function (error) {
        toast.warn(`Request to claim E11 failed. ${error?.message}`)
      })
      .catch(error => {
        console.log(`Request to claim E11 error. ${error?.message}`)
      });
  }

  const requestClose = async (bankAddress, positionId, bigfootAddress) => {
    const request = await web3Instance.reqClosePosition(bankAddress, positionId, bigfootAddress);
    request.send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toast.info(`Request to close position in process. ${hash}`)
      })
      .on('receipt', function (receipt) {
        toast.success(`Request to close position completed.`)
      })
      .on('error', function (error) {
        toast.warn(`Request to close position failed. ${error?.message}`)
      })
      .catch(error => {
        console.log(`Request to close position error. ${error?.message}`)
      });
  }

  const requestLiquidation = async (bankAddress, positionId) => {
    const request = await web3Instance.reqLiquidatePosition(bankAddress, positionId);
    request.send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toast.info(`Request to liquidate position in process. ${hash}`)
      })
      .on('receipt', function (receipt) {
        updatePositions();
        toast.success(`Request to liquidate position completed.`)
      })
      .on('error', function (error) {
        toast.warn(`Request to liquidate position failed. ${error?.message}`)
      })
      .catch(error => {
        console.log(`Request to liquidate position error. ${error?.message}`)
      });
  }

  const renderButtons = (position, pool, debtRatio) => {
    if (showAll) {
      return (
        <Button
          disabled={ debtRatio < 100 }
          outline={ debtRatio < 100 }
          color={ debtRatio < 100 ? "secondary" : "primary" } 
          onClick={() => {
            requestLiquidation(position.bankAddress, position.positionId)
          }}
        >
          Liquidate
        </Button>
      );
    } else {
      return (
        <>
          <Button 
            className="me-2"
            outline={true}
            color={"primary"}
            onClick={()=>{
              togglemodal(position, pool)
            }}
          >
            Adjust
          </Button>
          
          <Button
            className="me-2"
            outline={true}
            color={"primary"}
            onClick={() => {
              requestClose(position.bankAddress, position.positionId, pool.bigfootAddress)
            }}
          >
            Close
          </Button>

          {/* <Button
            color={"primary"}
            onClick={() => {
              requestClaim(position.positionId, pool.bigfootAddress)
            }}
          >
            Claim {rewards[position.positionId]} E11
          </Button> */}
        </>
      );
    }
  }

  return (
    <div className="table-responsive">
      <Table className="table table-nowrap align-middle text-center mb-0">
        <thead>
          <tr>
            <th scope="col">Bank</th>
            <th scope="col">#id</th>
            <th scope="col">Farm Pool</th>
            <th scope="col">Position Size</th>
            <th scope="col">Current Leverage</th>
            <th scope="col">Death Leverage</th>
            <th scope="col">Debt Ratio</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(position => {
            const bank = lendingOptions.find( option => option.bankAddress === position.bankAddress );
            const {totalSize: totalSizeWeis} = Calculator.extractPositionInfo(position);
            const totalSize = Calculator.getAmoutFromWeis(totalSizeWeis);
            const totalSizeValue = totalSize * priceList[bank.title];
            const collateralText = `Collateral Value: $ ${Formatter.formatAmount(position.collateral * priceList[bank.title], 0)}`
            const positionSizeText =  `Position Size: $ ${Formatter.formatAmount(totalSizeValue, 0)}`

            return (
              <tr key={position.positionId}>
                <td>
                  <h5 className="font-size-14 mb-1">
                    {bank.title}
                  </h5>
                </td>
                <td>
                  <h5 className="font-size-14 mb-1">
                    #{position.positionId}
                  </h5>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {renderPoolInfo(position.pool)}
                  </div>
                </td>
                <td class="flex-container space-between">
                  <div>
                    $ {Formatter.formatAmount(totalSizeValue, 0) }
                    <Tooltip 
                      placement='right' 
                      arrow 
                      title={
                        <>
                          <h5>{collateralText}</h5>
                          <h5>{positionSizeText}</h5> 
                        </>
                      }
                    >
                      <i style={{marginLeft:'0.3rem'}} className="tooltip-trigger mdi mdi-information-outline"/>  
                    </Tooltip>
                  </div>
                </td>
                <td>
                  <h5 className="font-size-14 mb-1">
                    {Formatter.formatAmount(position.currentLeverage)}
                  </h5>
                </td>
                <td>
                  <h5 className="font-size-14 mb-1">
                    {position.deathLeverage.toFixed(2)}
                  </h5>
                </td>
                <td>
                  <h5 className="font-size-14 mb-1">
                    <span className={
                      position.debtRatio < 33 ? "text-success" :
                      position.debtRatio < 85 ? "text-warning" : "text-danger"
                    }>
                      {position.debtRatio.toFixed(2)} %
                    </span>
                  </h5>
                </td>
                <td style={{ width: "120px" }}>
                  {renderButtons(position, position.pool, position.debtRatio)}
                </td>
              </tr>
            );
          }
          )}
        </tbody>
      </Table>

      { chosenPosition &&
        <LeverageModal 
          isOpen={isModalOpen} 
          togglemodal={togglemodal} 
          pool={chosenPool} 
          userBalances={userBalances}
          currentPosition={chosenPosition}
          updatePositions={updatePositions}
          />
      }

    </div>
  )
}

export default PositionsTable;