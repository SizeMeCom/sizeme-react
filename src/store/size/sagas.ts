import { select, put, takeLatest } from "redux-saga/effects"
import { SELECT_SIZE, SET_SELECTED_SIZE, SizeActionTypes } from "./types"
import { uiOptions } from "../../api/options"
import { RootState } from "../index"
import SizeSelector from "../../api/SizeSelector"
import { FitResult } from "../../api/types"
import { MatchState } from "../match/types"
import { setMatchState } from "../match/actions"

function setSelectedSize(size: string, auto: boolean): SizeActionTypes {
    return {
        type: SET_SELECTED_SIZE,
        payload: {
            size,
            auto
        }
    }
}

export function* watchSelectSize() {
    yield takeLatest(SELECT_SIZE, selectSize)
}

function* selectSize({ payload }: SizeActionTypes) {
    const { size, auto } = payload
    const { size: sizeState }: RootState = yield select()
    const firstMatch = !uiOptions.firstRecommendation && sizeState.firstMatch
    if (!firstMatch) {
        if (auto) {
            SizeSelector.setSelectedSize(size)
        }
        yield put(setSelectedSize(size, auto))
    } else {
        yield put(setSelectedSize(SizeSelector.getSelectedSize(), false))
    }

    let match: FitResult | null = null
    let state = "match"
    const currentSize: string = yield select((state: RootState) => state.size.size)
    const { matchResult, recommendedFit }: MatchState = yield select((state: RootState) => state.match)
    if (matchResult && currentSize) {
        const currentMatch = matchResult[currentSize]
        if (currentMatch && currentMatch.accuracy > 0) {
            match = currentMatch
        } else {
            state = "no-fit"
        }
    } else if (matchResult) {
        if (Object.values(matchResult).some((m) => m && m.accuracy > 0)) {
            state = "no-size"
        } else {
            state = "no-fit"
        }
    } else {
        state = "no-meas"
    }
    if (firstMatch && recommendedFit === currentSize) {
        yield put(setSelectedSize(currentSize, true))
    }
    yield put(setMatchState(state, match))
}
