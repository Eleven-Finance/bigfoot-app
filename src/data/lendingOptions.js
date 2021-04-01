//
// Note:
//  -- "title" must be unique
//


// import demo icons
import { Bnb, Eth, Busd } from '../assets/images/bigfoot/icons-coins/_index'


const lendingOptions = [
  {
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