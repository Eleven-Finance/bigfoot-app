//
// Note:
//  -- the property "title" must be unique
//  -- a specific icon can be defined through the property "customIcon" (if "customIcon" is not defined, then the icons are generated from the values in "currencies.icon")
//


// import demo icons
import { Ethereum, Sushi, ThreeCrv, Uniswap, Usdc} from '../assets/images/bigfoot/icons-assets/demo/_index'


const farmPools = [
  {
    title: "Sushiswap BNB/ETH",
    color: "warning",
    type: "Liquidity Providing",
    percentage: "61.66",
    percentageOut: "25.53",
    currencies: [
      {
        code: "BNB",
        icon: Sushi
      },
      {
        code: "ETH",
        icon: Ethereum
      },
    ],
    details: [
      { title: "Trading Fee", percentage: "51.68 " },
      { title: "Alpha APY", percentage: "25.96" },
      { title: "Borrow APY", percentage: "-16.13" },
    ]
  },
  {
    title: "NoodleSwap UNI/ETH",
    color: "primary",
    type: "Liquidity Providing",
    percentage: "114.82",
    percentageOut: "51.81",
    currencies: [
      {
        code: "Uni",
        icon: Uniswap
      },
      {
        code: "ETH",
        icon: Ethereum
      },
    ],
    details: [
      { title: "Yield Farming", percentage: "83.95" },
      { title: "Trading Fee", percentage: "51.68 " },
      { title: "Alpha APY", percentage: "25.96" },
      { title: "Borrow APY", percentage: "-16.13" },
    ]
  },
  {
    title: "Liteswap SDC/ETH",
    color: "info",
    type: "Liquidity Providing",
    percentage: "244.42",
    percentageOut: "91.19",
    currencies: [
      {
        code: "SDC",
        icon: Usdc
      },
      {
        code: "ETH",
        icon: Ethereum
      },
    ],
    details: [
      { title: "Yield Farming", percentage: "83.95" },
      { title: "Trading Fee", percentage: "51.68 " },
      { title: "Alpha APY", percentage: "25.96" },
      { title: "Borrow APY", percentage: "-16.13" },
    ]
  },
  {
    title: "Ethswap ETH/SHU/SDC",
    customIcon: ThreeCrv,
    color: "warning",
    type: "Liquidity Providing",
    percentage: "162.50",
    percentageOut: "16.42 ",
    currencies: [
      {
        code: "ETH",
        icon: Ethereum
      },
      {
        code: "SHU",
        icon: Sushi
      },
      {
        code: "SDC",
        icon: Usdc
      },
    ],
    details: [
      { title: "Yield Farming", percentage: "83.95" },
      { title: "Trading Fee", percentage: "51.68 " },
      { title: "Alpha APY", percentage: "25.96" },
      { title: "Borrow APY", percentage: "-16.13" },
    ]
  },
  {
    title: "Multiswap ETH/UNI/LIT",
    customIcon: ThreeCrv,
    color: "warning",
    type: "Liquidity Providing",
    percentage: "68.12",
    percentageOut: "42.10",
    currencies: [
      {
        code: "ETH",
        icon: Ethereum
      },
      {
        code: "UNI",
        icon: Uniswap
      },
      {
        code: "SDC",
        icon: Usdc
      },
    ],
    details: [
      { title: "Yield Farming", percentage: "83.95" },
      { title: "Trading Fee", percentage: "51.68 " },
      { title: "Alpha APY", percentage: "25.96" },
      { title: "Borrow APY", percentage: "-16.13" },
    ]
  },
];

export default farmPools;