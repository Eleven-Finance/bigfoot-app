import { useState, useEffect } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Web3Class from 'helpers/bigfoot/Web3Class'
import Calculator from 'helpers/bigfoot/Calculator';
import farmPools from 'data/farmPools'
import lendingOptions from 'data/lendingOptions'

function usePositions(props) {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [isLoadingPositions, setIsLoadingPositions] = useState(true);
  const [allPositions, setAllPositions] = useState([]);
  const [myPositions, setMyPositions] = useState([]);

  useEffect( () => {
    if(wallet.account) {
      updatePositions();
    }
  }, [wallet]);


  const updatePositions = async () => {

    //get all positions
    let all = await Promise.all(lendingOptions.map( async (bank) => {
      if(bank.bankAddress){
        return await web3Instance.getAllPositions(bank.bankAddress);
      } else {
        return [];
      }
    }));
    
    //merge positions from all banks in a single array
    all = [].concat(...all);

    //discard closed positions & positions opened in old farms
    all = all.filter( position => {
      const { collateral } = Calculator.extractPositionInfo(position);
      const pool = farmPools.find( pool => pool.bigfootAddress === position.positionData.bigfoot ); //pool on which this position has been opened
      return (collateral > 0) && (pool !== undefined);
    });
    
    //get own positions
    const own = all.filter( pos => pos.positionData.owner === userAddress);

    setIsLoadingPositions(false);
    setAllPositions(all);
    setMyPositions(own);
  }

  return { isLoadingPositions, allPositions, myPositions, updatePositions };
}

export default usePositions;