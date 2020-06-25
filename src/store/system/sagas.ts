import { takeLatest, select, put } from "redux-saga/effects"
import { TOGGLE_SIZEME_HIDDEN } from "./types"
import { setSizemeHidden } from "./actions"
import { RootState } from "../index"

export function* watchToggleSizemeHidden() {
    yield takeLatest(TOGGLE_SIZEME_HIDDEN, toggleSizemeHidden)
}

function* toggleSizemeHidden() {
    const { system }: RootState = yield select()
    const sizemeHidden = !system.sizemeHidden
    localStorage.setItem("sizemeToggledVisible", JSON.stringify(!sizemeHidden))
    yield put(setSizemeHidden(sizemeHidden))
}
