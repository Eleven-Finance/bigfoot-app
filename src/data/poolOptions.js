//
// Note:
//  -- "title" must be unique
//

// import demo icons
import { Ethereum, Sushi, ThreeCrv, Uniswap, Usdc} from '../assets/images/bigfoot/icons-assets/demo/_index'

const poolOptions = [
  {
    title: "UniSwap UNI/ETH",
    poolIcon: Uniswap,
    currencies: [
      {
        code: "UNI",
        icon: Uniswap
      },
      {
        code: "ETH",
        icon: Ethereum
      },
    ],
    apy: "26.30",

    isAuthorized: false,
    canHarvest: true,
  },
  {
    title: "SushiSwap SHU/ETH",
    poolIcon: Sushi,
    currencies: [
      {
        code: "SHU",
        icon: Sushi
      },
      {
        code: "ETH",
        icon: Ethereum
      },
    ],
    apy: "26.30",

    isAuthorized: false,
    canHarvest: false,
  },
  {
    title: "EtherSwap USDC/ETH",
    poolIcon: Ethereum,
    currencies: [
      {
        code: "USDC",
        icon: Usdc
      },
      {
        code: "ETH",
        icon: Ethereum
      },
    ],
    apy: "36.30",

    isAuthorized: false,
    canHarvest: true,
  },
  {
    title: "MultiSwap USDC/ETH",
    poolIcon: Ethereum,
    currencies: [
      {
        code: "USDC",
        icon: Usdc
      },
      {
        code: "ETH",
        icon: Ethereum
      },
    ],
    apy: "36.30",

    isAuthorized: false,
    canHarvest: true,
  },
];

export default poolOptions;