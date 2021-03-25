//
// Note:
//  -- "title" must be unique
//  -- "currencies" is an array (can accept multiple items) 
//

// import addresses
import { addressBfBNB } from '../data/addresses/addresses';

// import demo icons
import { Ethereum, Sushi, ThreeCrv, Uniswap, Usdc} from '../assets/images/bigfoot/icons-assets/demo/_index'
import { eleELE, bfBNB, bfUST, bfETH } from '../assets/images/bigfoot/icons-bigfoot-coins/_index'

const poolOptions = [
  {
    address: addressBfBNB,
    title: "Eleven bfBNB",
    poolIcon: eleELE,
    currencies: [
      {
        code: "bfBNB",
        icon: bfBNB
      },
    ],
    apy: "26.30",

    isComingSoon: false,
    isAuthorized: false,
    canHarvest: false,
  },
  {
    address: '',
    title: "Eleven bfETH",
    poolIcon: eleELE,
    currencies: [
      {
        code: "bfETH",
        icon: bfETH
      },
    ],
    apy: "36.30",

    isComingSoon: true,
    isAuthorized: false,
    canHarvest: false,
  },
  {
    address: '',
    title: "Eleven bfUST",
    poolIcon: eleELE,
    currencies: [
      {
        code: "bfUST",
        icon: bfUST
      },
    ],
    apy: "26.30",

    isComingSoon: true,
    isAuthorized: false,
    canHarvest: false,
  },
];

export default poolOptions;