//
// Note:
//  -- "title" must be unique
//  -- "currencies" is an array (can accept multiple items) 
//

// addresses
import { addressBfBNB } from './addresses/addresses';

// icons
import { Ethereum, Sushi, ThreeCrv, Uniswap, Usdc} from '../assets/images/bigfoot/icons-assets/demo/_index'
import { eleELE, bfBNB, bfBUSD, bfETH } from '../assets/images/bigfoot/icons-bigfoot-coins/_index'

const farmOptions = [
  {
    pid: 79,
    address: addressBfBNB,
    title: "Eleven bfBNB",
    farmIcon: eleELE,
    currencies: [
      {
        code: "bfBNB",
        icon: bfBNB
      },
    ],
    statsKey: "ICE", //temp value

    isComingSoon: false,
    isAuthorized: false,
    pendingRewards: "0",
  },
  {
    pid: null,
    address: '',
    title: "Eleven bfETH",
    farmIcon: eleELE,
    currencies: [
      {
        code: "bfETH",
        icon: bfETH
      },
    ],
    statsKey: "YUMCHA-BUSD LP", //temp value

    isComingSoon: true,
    isAuthorized: false,
    pendingRewards: "0",
  },
  {
    pid: null,
    address: '',
    title: "Eleven bfBUSD",
    farmIcon: eleELE,
    currencies: [
      {
        code: "bfBUSD",
        icon: bfBUSD
      },
    ],
    statsKey: "LIEN-BNB LP", //temp value

    isComingSoon: true,
    isAuthorized: false,
    pendingRewards: "0",
  },
];

export default farmOptions;