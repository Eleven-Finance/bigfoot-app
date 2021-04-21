//
// Note:
//  -- the property "title" must be unique
//  -- a specific icon can be defined through the property "customIcon" (if "customIcon" is not defined, then the icons are generated from the values in "currencies.icon")
//

import { Cake } from '../assets/images/bigfoot/icons-assets/_index'
import { Bnb } from '../assets/images/bigfoot/icons-coins/_index'

import { address11Cake, address11CakeBnb, addressBigfoot11CakeBnb } from '../data/addresses/addresses'

const farmPools = [
  {
    title: "11CAKE",
    type: "Yield Farming",
    apiKey: "CAKE",
    customIcon: Cake,
    bigfootAddress: null,
    deathLeverage: 10.333333333333,
    maxLeverage: 10.666666666666,
    currencies: [
      {
        code: "11CAKE",
        icon: Cake,
        address: address11Cake,
      },
      {
        code: "BNB",
        icon: Bnb,
        address: null, //native token
      },
    ],
    rates: {
      yieldFarming: 0,
      eleApr: 0,
      borrowApy: 0,
    },
    percentage: 0,
    percentageOut: 0,
  },
  {
    title: "11CAKEBNB",
    type: "Yield Farming",
    apiKey: "CAKE-BNB LP",
    bigfootAddress: addressBigfoot11CakeBnb,
    deathLeverage: 3.333333333333,
    maxLeverage: 2.666666666666,
    currencies: [
      {
        code: "11CAKEBNB",
        icon: Cake,
        address: address11CakeBnb,
      },
      {
        code: "BNB",
        icon: Bnb,
        address: null, //native token
      },
    ],
    rates: {
      yieldFarming: 0,
      eleApr: 0,
      tradingFee: 0,
      borrowApy: 0,
    },
    percentage: 0,
    percentageOut: 0,
  },
];

export default farmPools;