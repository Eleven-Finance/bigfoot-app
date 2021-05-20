import { useState, useEffect } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Web3Class from 'helpers/bigfoot/Web3Class'
import lendingOptions from 'data/lendingOptions'

function usePriceList() {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const [isLoadingPriceList, setIsLoadingPriceList] = useState(true);
  const [priceList, setPriceList] = useState({});

  useEffect( () => {
    if(wallet.account) {
      updatePriceList();
    }
  }, [wallet]);


  const updatePriceList = async () => {
    let banksAddressesArr = lendingOptions.map( option => option.bankAddress);
    banksAddressesArr = banksAddressesArr.filter( addr => addr != null );

    const prices = await Promise.all(banksAddressesArr.map( address => web3Instance.getBankReferenceAssetValueInUsd(address)));

    const pricesObj = {};
    banksAddressesArr.forEach( (address, index) => {
      const bankTitle = lendingOptions.find( option => option.address === address).title;
      pricesObj[bankTitle] = prices[index];
    });

    setPriceList(pricesObj);
    setIsLoadingPriceList(false);
  }

  return { isLoadingPriceList, priceList };
}

export default usePriceList;