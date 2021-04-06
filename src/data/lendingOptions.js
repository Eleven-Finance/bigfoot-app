//
// Note:
//  -- "title" must be unique
//


import { addressBfBNB } from '../data/addresses/addresses';
import { Bnb, Eth, Busd } from '../assets/images/bigfoot/icons-coins/_index'


const lendingOptions = [
  {
    address: addressBfBNB,
    title: "bfBNB",
    currency: "BNB",
    icon: Bnb,
    apy: "",
    supply: "",
    borrow: "",
    utilization: "90.10",
    bigfootBalance: 0,
    bigfootChefBalance: 0,
  },
  {
    address: '',
    title: "bfETH",
    currency: "ETH",
    icon: Eth,
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
    title: "bfBUSD",
    currency: "BUSD",
    icon: Busd,
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