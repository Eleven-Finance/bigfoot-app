import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Button,
  Table,
} from "reactstrap"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Web3Class from '../../helpers/bigfoot/Web3Class'
import Formatter from 'helpers/bigfoot/Formatter';
import farmPools from '../../data/farmPools'
import Icon from "./Icon"
import LeverageModal from './LeverageModal';


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
      <span className="avatar-xs avatar-multi">
        {icons}
      </span>
      <span>{pool.title}</span>
    </>
  );
}



function PositionsTable(props) {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const TOTAL_SIZE = 0;
  const DEBT_SIZE = 1;

  const {positions, showAll} = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenPosition, setChosenPosition] = useState(null);
  const [bnbPrice, setBnbPrice] = useState(0);


  useEffect( async () => {
    const price = await web3Instance.getBnbPrice();
    setBnbPrice(price);
  }, [wallet]);


  const togglemodal = (position) => {

    //if wallet not connected
    if( !isModalOpen && !wallet.account){
      toast.warn("Connect your wallet");
      return;
    }

    if(isModalOpen) {//close
      setChosenPosition(null);
      setIsModalOpen(false);
    } else {//open
      setChosenPosition(position);
      setIsModalOpen(true);
    }
  }


  const getCollateralValue = (position) => {
    let collateral = position.positionInfo[TOTAL_SIZE] - position.positionInfo[DEBT_SIZE];
    collateral = web3Instance.getAmoutFromWeis(collateral * bnbPrice);
    return parseFloat(collateral);
  }

  const getCurrentLeverage = (position) => {
    let collateral = position.positionInfo[TOTAL_SIZE] - position.positionInfo[DEBT_SIZE];
    let currentLeverage = position.positionInfo[TOTAL_SIZE] / collateral;
    return parseFloat(currentLeverage);
  }

  const requestLiquidatation = (positionId) => {
    web3Instance.liquidatePosition(positionId);
  }

  const renderButtons = (position, debtRatio) => {
    if (showAll) {
      return (
        <Button
          disabled={ debtRatio < 100 }
          outline={ debtRatio < 100 }
          color={ debtRatio < 100 ? "secondary" : "primary" } 
          onClick={ () => requestLiquidatation(position.positionId) }
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
              togglemodal(position)
            }}
          >
            Adjust
          </Button>
          
          <Button
            outline={true}
            color={"primary"}>
            Close
          </Button>
        </>
      );
    }
  }

  return (
    <div className="table-responsive">
      <Table className="table table-nowrap align-middle text-center mb-0">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Farm Pool</th>
            <th scope="col">Collateral Value</th>
            <th scope="col">Current Leverage</th>
            <th scope="col">Death Leverage</th>
            <th scope="col">Debt Ratio</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(position => {

            const bigfootAddress = position.positionData.bigfoot;
            const pool = farmPools.find( pool => pool.bigfootAddress === bigfootAddress );
            
            const collateralValue = getCollateralValue(position);
            const currentLeverage = getCurrentLeverage(position);
            const deathLeverage = pool.deathLeverage;
            const debtRatio = currentLeverage / deathLeverage * 100;

            return (
              <tr key={position.positionId}>
                <th scope="row">
                  <h5 className="font-size-14 mb-1">
                    #{position.positionId}
                  </h5>
                </th>
                <td>
                  <div className="d-flex align-items-center">
                    {renderPoolInfo(pool)}
                  </div>
                </td>
                <td>
                  <h5 className="font-size-14 mb-1">
                    $ {Formatter.formatAmount(collateralValue)}
                  </h5>
                </td>
                <td>
                  <h5 className="font-size-14 mb-1">
                    {Formatter.formatAmount(currentLeverage)}
                  </h5>
                </td>
                <td>
                  <h5 className="font-size-14 mb-1">
                    {deathLeverage.toFixed(2)}
                  </h5>
                </td>
                <td>
                  <h5 className="font-size-14 mb-1">
                    <span className={
                      debtRatio < 33 ? "text-success" :
                      debtRatio < 85 ? "text-warning" : "text-danger"
                    }>
                      {debtRatio.toFixed(2)} %
                    </span>
                  </h5>
                </td>
                <td style={{ width: "120px" }}>
                  {renderButtons(position, debtRatio)}
                </td>
              </tr>
            );
          }
          )}
        </tbody>
      </Table>

      { chosenPosition &&
        <LeverageModal isOpen={isModalOpen} togglemodal={togglemodal} pool={chosenPosition} userBalances={userBalances} />
      }

    </div>
  )
}

export default PositionsTable;