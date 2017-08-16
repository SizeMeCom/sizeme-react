import { combineReducers } from "redux";
import { handleAction, handleActions } from "redux-actions";
import * as actions from "./actions";

function resolvePayload (action, payloadKey, errorPayload = null) {
    return {
        [payloadKey]: action.error ? errorPayload : action.payload,
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
    }),

    [actions.CLEAR_TOKEN]: () => ({
        loggedIn: false,
        isFetching: false,
        resolved: true
    })
}, {
    loggedIn: false,
    isFetching: false,
    resolved: false
});

const signupStatus = handleActions({
    [actions.SIGNUP]: (state, action) => ({ error: null, inProgress: true }),

    [actions.SIGNUP_DONE]: (state, action) => ({
        ...state,
        inProgress: false,
        error: action.error ? action.payload.message : null
    })
}, {
    inProgress: false,
    error: null
});

const profileList = handleActions({
    [actions.REQUEST_PROFILE_LIST]: (state, action) => ({ ...state, isFetching: true }),

    [actions.RECEIVE_PROFILE_LIST]: (state, action) => ({
        ...state,
        isFetching: false,
        ...resolvePayload(action, "profiles", [])
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
        resolved: !action.error,
        ...resolvePayload(action, "product")
    })
}, {
    product: null,
    isFetching: false,
    resolved: false
});

const selectedProfile = handleActions({
    [actions.SELECT_PROFILE]: (state, action) => ({
        ...state,
        ...action.payload,
        selectDone: false,
        dirty: false
    }),
    [actions.SELECT_PROFILE_DONE]: (state) => ({
        ...state,
        selectDone: true
    }),
    [actions.SET_MEASUREMENTS]: (state, action) => ({
        ...state,
        ...resolvePayload(action, "measurements"),
        dirty: true
    }),
    [actions.SAVED_MEASUREMENTS]: (state) => ({
        ...state,
        dirty: false
    })
}, {
    id: "",
    profileName: null,
    selectDone: false,
    measurements: {},
    dirty: false
});

const match = handleActions({
    [actions.REQUEST_MATCH]: (state, action) => ({
        ...state,
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

const tooltip = handleAction(actions.SET_TOOLTIP, (state, action) => action.payload, null);

const selectedSize = handleAction(actions.SELECT_SIZE, (state, action) => ({
    ...state,
    ...action.payload
}), {
    size: "",
    auto: false
});

const rootReducer = combineReducers({
    authToken,
    signupStatus,
    profileList,
    productInfo,
    selectedProfile,
    match,
    selectedSize,
    tooltip
});

export default rootReducer;

