import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_PROJECTS, GET_PROJECT_DETAIL } from "./actionTypes"
import {
  getProjectsSuccess,
  getProjectsFail,
  getProjectDetailSuccess,
  getProjectDetailFail,
} from "./actions"

//Include Both Helper File with needed methods
import { getProjects, getProjectsDetails } from "helpers/fakebackend_helper"

function* fetchProjects() {
  try {
    const response = yield call(getProjects)
    yield put(getProjectsSuccess(response))
  } catch (error) {
    yield put(getProjectsFail(error))
  }
}

function* fetchProjectDetail({ projectId }) {
  try {
    const response = yield call(getProjectsDetails, projectId)
    yield put(getProjectDetailSuccess(response))
  } catch (error) {
    yield put(getProjectDetailFail(error))
  }
}

function* projectsSaga() {
  yield takeEvery(GET_PROJECTS, fetchProjects)
  yield takeEvery(GET_PROJECT_DETAIL, fetchProjectDetail)
}

export default projectsSaga
