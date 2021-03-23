import { combineReducers } from "redux"

// bigfoot reducers
import wallet from './bigfoot_wallet/reducer'


/*** Theme boilerplate reducers (needs cleanup) ***/

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

import ecommerce from "./e-commerce/reducer"
import calendar from "./calendar/reducer"
import chat from "./chat/reducer"
// import crypto from "./crypto/reducer"
import invoices from "./invoices/reducer"
import projects from "./projects/reducer"
import tasks from "./tasks/reducer"
import contacts from "./contacts/reducer"


const rootReducer = combineReducers({
  // bigfoot
  wallet,

  // theme boilerplate
  Layout, 
  Login,
  Account,
  ForgetPassword,
  Profile,
  ecommerce,
  calendar,
  chat,
  crypto,
  invoices,
  projects,
  tasks,
  contacts,
})

export default rootReducer
