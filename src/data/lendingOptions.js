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
    supplyInDollars: "",
    borrow: "",
    borrowInDollars: "",
    utilization: "90.10",
    balance: "0.00",
  },
  {
    address: '',
    title: "bfETH",
    currency: "ETH",
    icon: Eth,
    apy: "",
    supply: "",
    supplyInDollars: "",
    borrow: "",
    borrowInDollars: "",
    utilization: "",
    balance: "",

    isComingSoon: true,
  },
  {
    address: '',
    title: "bfBUSD",
    currency: "BUSD",
    icon: Busd,
    apy: "",
    supply: "",
    supplyInDollars: "",
    borrow: "",
    borrowInDollars: "",
    utilization: "",
    balance: "",

    isComingSoon: true,
  },
];

export default lendingOptions;