import { useState, useEffect } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Web3Class from 'helpers/bigfoot/Web3Class'

function usePositions(props) {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [loadingPositions, setLoadingPositions] = useState(true);
  const [allPositions, setAllPositions] = useState([]);
  const [myPositions, setMyPositions] = useState([]);

  useEffect( async () => {
    if(wallet.account) {

      //get all positions
      let all = await web3Instance.getAllPositions();
      all.sort( (a,b) => parseFloat(b.debtRatio) - parseFloat(a.debtRatio) ); // sort positions by debt in descending order
      
      //filter own positions
      const own = all.filter( pos => pos.positionData.owner === userAddress);

      setLoadingPositions(false);
      setAllPositions(all);
      setMyPositions(own);
    }
  }, [wallet]);


  return { loadingPositions, allPositions, myPositions };
}

export default usePositions;