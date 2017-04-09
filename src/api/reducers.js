import { combineReducers } from "redux";
import { handleAction, handleActions } from "redux-actions";
import * as actions from "./actions";

function resolvePayload (action, payloadKey) {
    return {
        [payloadKey]: action.error ? null : action.payload,
        error: action.error ? action.payload : null
    };
}

const authToken = handleActions({
    [actions.CHECK_TOKEN]: (state, action) => ({
        loggedIn: false,
        isFetching: false,
        resolved: false
    }),

    [actions.FETCH_TOKEN]: (state, action) => ({ ...state, isFetching: true }),

    [actions.RESOLVE_TOKEN]: (state, action) => ({
        ...state,
        isFetching: false,
        resolved: true,
        loggedIn: !action.error && !!action.payload,
        ...resolvePayload(action, "token")
    })
}, {
    loggedIn: false,
    isFetching: false,
    resolved: false
});

const profileList = handleActions({
    [actions.REQUEST_PROFILE_LIST]: (state, action) => ({ ...state, isFetching: true }),

    [actions.RECEIVE_PROFILE_LIST]: (state, action) => ({
        ...state,
        isFetching: false,
        ...resolvePayload(action, "profiles")
    })
}, {
    profiles: [],
    isFetching: false
});

const productInfo = handleActions({
    [actions.REQUEST_PRODUCT_INFO]: (state, action) => ({ ...state, isFetching: true }),

    [actions.RECEIVE_PRODUCT_INFO]: (state, action) => ({
        ...state,
        isFetching: false,
        resolved: true,
        ...resolvePayload(action, "product")
    })
}, {
    product: null,
    isFetching: false,
    resolved: false
});

const selectedProfile = handleActions({
    [actions.SELECT_PROFILE]: (state, action) => ({
        ...action.payload,
        selectDone: false
    }),
    [actions.SELECT_PROFILE_DONE]: (state) => ({
        ...state,
        selectDone: true
    }),
    [actions.SET_MEASUREMENTS]: (state, action) => ({
        ...state,
        ...resolvePayload(action, "measurements")
    })
}, {
    id: "",
    profileName: null,
    selectDone: false,
    measurements: {}
});

const match = handleActions({
    [actions.REQUEST_MATCH]: (state, action) => ({
        matchResult: null,
        isFetching: true
    }),

    [actions.RECEIVE_MATCH]: (state, action) => ({
        ...state,
        isFetching: false,
        ...resolvePayload(action, "matchResult")
    }),

    [actions.RESET_MATCH]: () => ({
        matchResult: null,
        isFetching: false
    })
}, {
    matchResult: null,
    isFetching: false
});

const selectedSize = handleAction(actions.SELECT_SIZE, (state, action) => action.payload, "");

const rootReducer = combineReducers({
    authToken,
    profileList,
    productInfo,
    selectedProfile,
    match,
    selectedSize
});

export default rootReducer;

