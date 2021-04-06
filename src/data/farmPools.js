//
// Note:
//  -- the property "title" must be unique
//  -- a specific icon can be defined through the property "customIcon" (if "customIcon" is not defined, then the icons are generated from the values in "currencies.icon")
//

import { Cake } from '../assets/images/bigfoot/icons-assets/_index'
import { Bnb } from '../assets/images/bigfoot/icons-coins/_index'

const farmPools = [
  {
    title: "11CAKE",
    type: "Yield Farming",
    apiKey: "CAKE",
    currencies: [
      {
        code: "CAKE",
        icon: Cake
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
    currencies: [
      {
        code: "CAKE",
        icon: Cake
      },
      {
        code: "BNB",
        icon: Bnb
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