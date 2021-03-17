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
  },
];

export default poolOptions;