import { takeLatest, select, put, take } from "redux-saga/effects"
import { INITIALIZE_SIZEME, TOGGLE_SIZEME_HIDDEN } from "./types"
import { setSizemeHidden } from "./actions"
import { RootState } from "../index"
import { getProfiles, selectProfile } from "../profiles/actions"
import { RECEIVE_PROFILE_LIST } from "../profiles/types"
import { requestProductInfo } from "../productInfo/actions"

export function* watchToggleSizemeHidden() {
    yield takeLatest(TOGGLE_SIZEME_HIDDEN, toggleSizemeHidden)
}

function* toggleSizemeHidden() {
    const { system }: RootState = yield select()
    const sizemeHidden = !system.sizemeHidden
    localStorage.setItem("sizemeToggledVisible", JSON.stringify(!sizemeHidden))
    yield put(setSizemeHidden(sizemeHidden))
}

export function* watchInitializeSizeme() {
    yield takeLatest(INITIALIZE_SIZEME, initializeSizeme)
}

function* initializeSizeme() {
    yield put(requestProductInfo())
    yield put(getProfiles())
    yield take(RECEIVE_PROFILE_LIST)
    yield put(selectProfile(null))
}
