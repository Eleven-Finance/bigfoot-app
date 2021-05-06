//
// Note:
//  -- "title" must be unique
//


import { addressBfBNB } from '../data/addresses/addresses';
import { Bnb, Eth, Busd } from '../assets/images/bigfoot/icons-coins/_index'
import { Usdc, Usdt, ThreeNrv } from '../assets/images/bigfoot/icons-assets/_index'
import { addressBusd, addressUsdt, addressUsdc, address3nrvLp } from 'data/addresses/addresses';

import { abiBankBnb, abiBankUsd} from 'data/abis/abis';


const lendingOptions = [
  {
    address: addressBfBNB,
    title: "bfBNB",
    referenceCurrency: "BNB",
    assets: [
      {
        code: "BNB",
        icon: Bnb,
        address: null, //native token
        isNativeToken: true
      }
    ],
    bankIcon: Bnb,
    bankAbi: abiBankBnb,
    bankAddress: addressBfBNB,
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
    referenceCurrency: "ETH",
    assets: [
      {
        code: "ETH",
        icon: null,
        address: null,
      }
    ],
    bankIcon: Eth,
    bankAbi: null,
    bankAddress: null,
    apy: "",
    supply: "",
    borrow: "",
    utilization: "",
    bigfootBalance: 0,
    bigfootChefBalance: 0,

    isComingSoon: true,
  },
  {
    address: '',
    title: "bfUSD",
    referenceCurrency: "$",
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
    bankIcon: Busd,
    bankAbi: abiBankUsd,
    bankAddress: null, //@todo
    apy: "",
    supply: "",
    borrow: "",
    utilization: "",
    bigfootBalance: 0,
    bigfootChefBalance: 0,
  },
];

export default lendingOptions;