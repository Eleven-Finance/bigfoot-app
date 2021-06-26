//
// Note:
//  -- the property "title" must be unique
//  -- a specific icon can be defined through the property "customIcon" (if "customIcon" is not defined, then the icons are generated from the values in "currencies.icon")
//

import { Cake, Usdt } from '../assets/images/bigfoot/icons-assets/_index'
import { Bnb, Busd } from '../assets/images/bigfoot/icons-coins/_index'

import { address11Cake, address11CakeBnb, addressBigfoot11CakeBnb, addressBigfoot11UsdtBusd, address11UsdtBusd } from '../data/addresses/addresses'
import { addressBusd } from '../data/addresses/addresses'
import { addressBfBNB, addressBfUSD } from '../data/addresses/addresses'

const farmPools = [
  {
    isComingSoon: true,
    title: "CAKE",
    type: "Yield Farming",
    apiKey: "CAKE",
    customIcon: Cake,
    bigfootAddress: null,
    usesBank: null,
    deathLeverage: 10.333333333333,
    maxLeverage: 2.666666666666,
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
      borrowApy: 0,
    },
    percentage: 0,
    percentageOut: 0,
  },
  {
    title: "CAKE-BNB LP",
    type: "Yield Farming",
    apiKey: "CAKE-BNB LP",
    bigfootAddress: addressBigfoot11CakeBnb,
    usesBank: addressBfBNB,
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
      tradingFee: 13.87,
      borrowApy: 0,
    },
    percentage: 0,
    percentageOut: 0,
  },
  // {
  //   title: "USDT-BUSD WLP",
  //   type: "Yield Farming",
  //   apiKey: "USDT-BUSD WLP",
  //   bigfootAddress: addressBigfoot11UsdtBusd,
  //   usesBank: addressBfUSD,
  //   deathLeverage: 6.5,
  //   maxLeverage: 6,
  //   currencies: [
  //     {
  //       code: "11USDTBUSD",
  //       icon: Usdt,
  //       address: address11UsdtBusd,
  //     },
  //     {
  //       code: "BUSD",
  //       icon: Busd,
  //       address: addressBusd,
  //     },
  //   ],
  //   rates: {
  //     yieldFarming: 0,
  //     tradingFee: 0, //wex (no trading fee)
  //     borrowApy: 0,
  //   },
  //   percentage: 0,
  //   percentageOut: 0,
  // },
];

export default farmPools;