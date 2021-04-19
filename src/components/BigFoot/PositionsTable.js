import React, { useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Button,
  Table,
} from "reactstrap"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { Cake } from '../../assets/images/bigfoot/icons-assets/_index'
import { Bnb } from '../../assets/images/bigfoot/icons-coins/_index'

import Web3Class from '../../helpers/bigfoot/Web3Class'
import LeverageModal from './LeverageModal';


const renderIcon = (positionTitle) => {
  let icon;

  switch(positionTitle){
    case '11CAKE':
      icon = Cake;
      break;
    case '11CAKEBNB':
      icon = Bnb;
      break;
  }

  return (
    <span className={"avatar-title rounded-circle bg-transparent font-size-18 me-2"} >
      <img src={icon?.default} />
    </span>
  );
}


function PositionsTable(props) {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const {positions, showAll} = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenPosition, setChosenPosition] = useState(null);


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

  const renderButtons = (position) => {
    if (showAll) {
      return (
        <Button
          // temporal values (remove once functionality to liquidate is ready)
          disabled={true}
          outline={true}
          color={"secondary"}

          // disabled={ position.debtRatio < 100 }
          // outline={ position.debtRatio < 100 }
          // color={ position.debtRatio < 100 ? "secondary" : "primary" } 
          onClick={() => {
            console.log("Liquidate")
          }}
        >
          Coming soon
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
            <th scope="col" className="text-start">Farm Pool</th>
            <th scope="col">Collateral Value</th>
            <th scope="col">Borrow Credit</th>
            <th scope="col">Collateral Credit</th>
            <th scope="col">Debt Ratio</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(position => (
            <tr key={position.id}>
              <th scope="row">
                <h5 className="font-size-14 mb-1">
                  #{position.id}
                </h5>
              </th>
              <td>
                <div className="d-flex align-items-center">
                  {renderIcon(position.title)}
                  <span>{position.title}</span>
                </div>
              </td>
              <td>
                <h5 className="font-size-14 mb-1">
                  $ {position.collateralInDollars}
                </h5>
              </td>
              <td>
                <h5 className="font-size-14 mb-1">
                  {position.borrowCredit} %
                              </h5>
              </td>
              <td>
                <h5 className="font-size-14 mb-1">
                  {position.collateralCredit}
                </h5>
              </td>
              <td>
                <h5 className="font-size-14 mb-1">
                  <span className={
                    position.debtRatio < 33 ? "text-success" :
                      position.debtRatio < 85 ? "text-warning" : "text-danger"
                  }>
                    {position.debtRatio} %
                    {/* <div className="text-muted mt-1">
                      ({(position.debtRatio /10).toFixed(2)}x)
                    </div> */}
                  </span>
                </h5>
              </td>
              <td style={{ width: "120px" }}>
                {renderButtons(position)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      { chosenPosition &&
        <LeverageModal isOpen={isModalOpen} togglemodal={togglemodal} pool={chosenPosition} userBalances={userBalances} />
      }

    </div>
  )
}

export default PositionsTable;