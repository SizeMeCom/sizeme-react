import { combineReducers } from "redux";
import { handleAction, handleActions } from "redux-actions";
import * as actions from "./actions";

function resolvePayload(action, payloadKey) {
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
        loggedIn: !action.error,
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
    [actions.REQUEST_PRODUCT_INFO]: (state, action) => ({ ...state, isFetching: true}),

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

const selectedProfile = handleAction(actions.SELECT_PROFILE, (state, action) => action.payload, "");

const rootReducer = combineReducers({
    authToken,
    profileList,
    productInfo,
    selectedProfile
});

export default rootReducer;

