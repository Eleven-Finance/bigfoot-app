//
// Note:
//  -- "title" must be unique
//


import { addressBfBNB, addressBfUSD } from '../data/addresses/addresses';
import { Bnb, Eth, Busd, Bfusd } from '../assets/images/bigfoot/icons-coins/_index'
import { Usdc, Usdt, ThreeNrv } from '../assets/images/bigfoot/icons-assets/_index'
import { addressBusd, addressUsdt, addressUsdc, address3nrvLp } from 'data/addresses/addresses';


const lendingOptions = [
  {
    address: addressBfBNB,
    title: "bfBNB",
    apiKey: "BFBNB",
    referenceCurrency: "BNB",
    requiredValueToOpenPosition: 0.11,  //minumum value in BNB, required to open a new position
    assets: [
      {
        code: "BNB",
        icon: Bnb,
        address: null, //native token
        isNativeToken: true
      }
    ],
    bankIcon: Bnb,
    bankAddress: addressBfBNB,
    apy: "",
    supply: "",
    borrow: "",
    utilization: "",
    bigfootBalance: 0,
    bigfootChefBalance: 0,
  },
  {
    address: addressBfUSD,
    title: "bfUSD",
    apiKey: "BFUSD",
    referenceCurrency: "$",
    requiredValueToOpenPosition: 1000,  //minumum value (in Dollars), required to open a new position
    assets: [
      {
        code: "BUSD",
        icon: Busd,
        address: addressBusd,
      },
      {
        code: "USDT",
        icon: Usdt,
        address: addressUsdt,
      },
      {
        code: "USDC",
        icon: Usdc,
        address: addressUsdc,
      },
      {
        code: "3NRV-LP",
        icon: ThreeNrv,
        address: address3nrvLp,
      },
    ],
    bankIcon: Bfusd,
    bankAddress: addressBfUSD, 
    apy: "",
    supply: "",
    borrow: "",
    utilization: "",
    bigfootBalance: 0,
    bigfootChefBalance: 0,
  },
  {
    address: '',
    title: "bfETH",
    apiKey: "",
    referenceCurrency: "ETH",
    assets: [
      {
        code: "ETH",
        icon: null,
        address: null,
      }
    ],
    bankIcon: Eth,
    bankAddress: null,
    apy: "",
    supply: "",
    borrow: "",
    utilization: "",
    bigfootBalance: 0,
    bigfootChefBalance: 0,

    isComingSoon: true,
  },
];

export default lendingOptions;