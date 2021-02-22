import {
  GET_CART_DATA_FAIL,
  GET_CART_DATA_SUCCESS,
  GET_CUSTOMERS_FAIL,
  GET_CUSTOMERS_SUCCESS,
  GET_ORDERS_FAIL,
  GET_ORDERS_SUCCESS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCTS_SUCCESS,
  GET_SHOPS_FAIL,
  GET_SHOPS_SUCCESS,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_DETAIL_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  products: [],
  product: {},
  orders: [],
  cartData: {},
  customers: [],
  shops: [],
  error: {},
}

const Ecommerce = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
      }

    case GET_PRODUCTS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        product: action.payload,
      }

    case GET_PRODUCT_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
      }

    case GET_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_CART_DATA_SUCCESS:
      return {
        ...state,
        cartData: action.payload,
      }

    case GET_CART_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_CUSTOMERS_SUCCESS:
      return {
        ...state,
        customers: action.payload,
      }

    case GET_CUSTOMERS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_SHOPS_SUCCESS:
      return {
        ...state,
        shops: action.payload,
      }

    case GET_SHOPS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default Ecommerce
