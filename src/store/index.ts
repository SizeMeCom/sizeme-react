import systemReducer from "./system/reducers"
import { combineReducers, createStore, applyMiddleware } from "redux"
import { all, fork } from "redux-saga/effects"
import { watchToggleSizemeHidden } from "./system/sagas"
import createSagaMiddleware from "redux-saga"
import { composeWithDevTools } from "redux-devtools-extension"
import sizemeOptions from "../api/sizemeOptions"
import { createLogger } from "redux-logger"
import authReducer from "./auth/reducers"
import sizeReducer from "./size/reducers"
import productInfoReducer from "./productInfo/reducers"
import { watchFetchToken } from "./auth/sagas"
import { watchRequestProductInfo } from "./productInfo/sagas"

const rootReducer = combineReducers({
    system: systemReducer,
    auth: authReducer,
    size: sizeReducer,
    productInfo: productInfoReducer
})

export type RootState = ReturnType<typeof rootReducer>

function* sagas() {
    yield all([fork(watchToggleSizemeHidden), fork(watchFetchToken), fork(watchRequestProductInfo)])
}

const sagaMiddleware = createSagaMiddleware()

export default createStore(
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

/*function observeStore(select, onChange) {
    let currentState

    function handleChange() {
        let nextState = select(store.getState())
        if (!equals(nextState, currentState)) {
            currentState = nextState
            onChange(currentState)
        }
    }

    let unsubscribe = store.subscribe(handleChange)
    handleChange()
    return unsubscribe
}

observeStore(
    ({ productInfo, selectedProfile, abStatus }) => ({ product: productInfo.product, selectedProfile, abStatus }),
    ({ product, selectedProfile, abStatus }) => {
        let smAction
        const statusPostFix = abStatus ? "-" + abStatus : ""
        if (!product) {
            smAction = "noProduct" + statusPostFix
        } else if (!Object.values(selectedProfile.measurements).some((item) => item)) {
            smAction = "noHuman"
        } else if (!selectedProfile.id) {
            smAction = "hasUnsaved"
        } else {
            smAction = "hasProfile"
        }
        cookies.set("sm_action", smAction, { path: "/" })
    }
)*/
