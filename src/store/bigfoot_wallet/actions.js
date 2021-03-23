import {
  GET_WALLET,
  GET_WALLET_FAIL,
  GET_WALLET_SUCCESS,
  GET_CRYPTO_ORDERS,
  GET_CRYPTO_ORDERS_FAIL,
  GET_CRYPTO_ORDERS_SUCCESS,
} from "./actionTypes"

export const getWallet = () => ({
  type: GET_WALLET,
})

export const getWalletSuccess = (web3, accounts, networkId) => ({
  type: GET_WALLET_SUCCESS,
  payload: { web3, accounts, networkId },
})

export const getWalletFail = error => ({
  type: GET_WALLET_FAIL,
  payload: error,
})

export const getCryptoOrders = () => ({
  type: GET_CRYPTO_ORDERS,
})

export const getCryptoOrdersSuccess = orders => ({
  type: GET_CRYPTO_ORDERS_SUCCESS,
  payload: orders,
})

export const getCryptoOrdersFail = error => ({
  type: GET_CRYPTO_ORDERS_FAIL,
  payload: error,
})
