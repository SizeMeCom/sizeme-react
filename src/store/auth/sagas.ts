import { takeLatest, select, put, call } from "redux-saga/effects"
import { FETCH_TOKEN, FetchTokenAction } from "./types"
import { resetToken, resolveToken } from "./actions"
import { AuthToken } from "../../api/types"
import { getAuthToken } from "../../api/backend-api"

export function* watchFetchToken() {
    yield takeLatest(FETCH_TOKEN, fetchToken)
}

function* fetchToken({ reset }: FetchTokenAction) {
    const { auth } = yield select()

    if (!reset && auth.resolved) {
        return
    }

    yield put(resetToken())

    const tokenObj = sessionStorage.getItem("sizeme.authtoken")
    let token
    if (tokenObj) {
        let storedToken
        try {
            storedToken = JSON.parse(tokenObj) as AuthToken
            if (storedToken.token && storedToken.expires && Date.parse(storedToken.expires) > new Date().getTime()) {
                token = storedToken.token
            }
        } catch (e) {
            // no action
        }
    }

    if (token) {
        yield put(resolveToken(token))
    } else {
        try {
            const authToken = yield call(getAuthToken)
            sessionStorage.setItem("sizeme.authtoken", JSON.stringify(authToken))
            yield put(resolveToken(authToken.token))
        } catch (reason) {
            // TODO: error handling
        }
    }
}
