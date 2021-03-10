//
// Note:
//  -- the property "title" must be unique
//  -- a specific icon can be defined through the property "customIcon" (if "customIcon" is not defined, then the icons are generated from the values in "currencies.icon")
//
const farmPools = [
  {
    title: "Bitswap BTC/ETH",
    color: "warning",
    type: "Liquidity Providing",
    percentage: "61.66",
    percentageOut: "25.53",
    currencies: [
      {
        code: "BTC",
        icon: "mdi mdi-bitcoin"
      },
      {
        code: "ETH",
        icon: "mdi mdi-ethereum"
      },
    ],
    details: [
      { title: "Trading Fee", percentage: "51.68 " },
      { title: "Alpha APY", percentage: "25.96" },
      { title: "Borrow APY", percentage: "-16.13" },
    ]
  },
  {
    title: "NoodleSwap NOO/ETH",
    color: "primary",
    type: "Liquidity Providing",
    percentage: "114.82",
    percentageOut: "51.81",
    currencies: [
      {
        code: "NOO",
        icon: "mdi mdi-noodles"
      },
      {
        code: "ETH",
        icon: "mdi mdi-ethereum"
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
    title: "Liteswap LIT/ETH",
    color: "info",
    type: "Liquidity Providing",
    percentage: "244.42",
    percentageOut: "91.19",
    currencies: [
      {
        code: "LIT",
        icon: "mdi mdi-litecoin"
      },
      {
        code: "ETH",
        icon: "mdi mdi-ethereum"
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
    title: "Ethswap ETH/BTC/LIT",
    customIcon: "mdi mdi-numeric-3-circle",
    color: "warning",
    type: "Liquidity Providing",
    percentage: "162.50",
    percentageOut: "16.42 ",
    currencies: [
      {
        code: "ETH",
        icon: "mdi mdi-ethereum"
      },
      {
        code: "BTC",
        icon: "mdi mdi-bitcoin"
      },
      {
        code: "LIT",
        icon: "mdi mdi-litecoin"
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
    title: "Multiswap ETH/NOO/LIT",
    customIcon: "mdi mdi-airballoon",
    color: "warning",
    type: "Liquidity Providing",
    percentage: "68.12",
    percentageOut: "42.10",
    currencies: [
      {
        code: "ETH",
        icon: "mdi mdi-ethereum"
      },
      {
        code: "NOO",
        icon: "mdi mdi-noodles"
      },
      {
        code: "LIT",
        icon: "mdi mdi-litecoin"
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