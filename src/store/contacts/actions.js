import {
  GET_USER_PROFILE,
  GET_USER_PROFILE_FAIL,
  GET_USER_PROFILE_SUCCESS,
  GET_USERS,
  GET_USERS_FAIL,
  GET_USERS_SUCCESS,
} from "./actionTypes"

export const getUsers = () => ({
  type: GET_USERS,
})

export const getUsersSuccess = users => ({
  type: GET_USERS_SUCCESS,
  payload: users,
})

export const getUsersFail = error => ({
  type: GET_USERS_FAIL,
  payload: error,
})

export const getUserProfile = () => ({
  type: GET_USER_PROFILE,
})

export const getUserProfileSuccess = userProfile => ({
  type: GET_USER_PROFILE_SUCCESS,
  payload: userProfile,
})

export const getUserProfileFail = error => ({
  type: GET_USER_PROFILE_FAIL,
  payload: error,
})
