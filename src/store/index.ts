import systemReducer from "./system/reducers"
import { combineReducers, createStore, applyMiddleware } from "redux"
import { all, fork } from "redux-saga/effects"
import { watchInitializeSizeme, watchToggleSizemeHidden } from "./system/sagas"
import createSagaMiddleware from "redux-saga"
import { composeWithDevTools } from "redux-devtools-extension"
import { sizemeOptions } from "../api/options"
import { createLogger } from "redux-logger"
import authReducer from "./auth/reducers"
import sizeReducer from "./size/reducers"
import productInfoReducer from "./productInfo/reducers"
import profileReducer from "./profiles/reducers"
import { watchFetchToken } from "./auth/sagas"
import { watchRequestProductInfo } from "./productInfo/sagas"
import { shallowEqual } from "react-redux"
import Cookies from "universal-cookie"
import { watchRequestProfileList, watchSelectProfile } from "./profiles/sagas"
import matchReducer from "./match/reducers"
import { watchRequestMatch } from "./match/sagas"
import { watchSelectSize } from "./size/sagas"

const rootReducer = combineReducers({
    system: systemReducer,
    auth: authReducer,
    size: sizeReducer,
    productInfo: productInfoReducer,
    profile: profileReducer,
    match: matchReducer
})

export type RootState = ReturnType<typeof rootReducer>

export interface ErrorAction {
    type: string
    error?: Error
}

const cookies = new Cookies()

function* sagas() {
    yield all([
        fork(watchToggleSizemeHidden),
        fork(watchInitializeSizeme),
        fork(watchFetchToken),
        fork(watchRequestProductInfo),
        fork(watchRequestProfileList),
        fork(watchSelectProfile),
        fork(watchRequestMatch),
        fork(watchSelectSize)
    ])
}

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(
            sagaMiddleware,
            createLogger({
                predicate: () => sizemeOptions.debugState,
                duration: true
            })
        )
    )
)
sagaMiddleware.run(sagas)

function observeStore<T>(select: (_: RootState) => T, onChange: (_: T) => void) {
    let currentState: T

    function handleChange() {
        let nextState = select(store.getState())
        if (!shallowEqual(nextState, currentState)) {
            currentState = nextState
            onChange(currentState)
        }
    }

    let unsubscribe = store.subscribe(handleChange)
    handleChange()
    return unsubscribe
}

observeStore(
    ({ productInfo, profile }) => ({ product: productInfo.product, selectedProfile: profile.selectedProfile }),
    ({ product, selectedProfile }) => {
        let smAction
        if (!product) {
            smAction = "noProduct"
        } else if (!Object.values(selectedProfile.measurements).some((item) => item)) {
            smAction = "noHuman"
        } else if (!selectedProfile.id) {
            smAction = "hasUnsaved"
        } else {
            smAction = "hasProfile"
        }
        cookies.set("sm_action", smAction, { path: "/" })
    }
)

export default store
