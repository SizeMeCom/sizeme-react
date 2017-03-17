import { combineReducers } from "redux";
import * as actions from "./actions";

function shouldResolveToken (state) {
    return !state.resolved && !state.fetchingToken;
}

function authToken (state = {
    loggedIn: false,
    fetchingToken: false,
    resolved: false
}, action) {
    switch (action.type) {
        case actions.CHECK_TOKEN:
            if (shouldResolveToken(state)) {
                return {
                    loggedIn: false,
                    fetchingToken: false,
                    resolved: false
                };
            }
            return state;

        case actions.FETCH_TOKEN:
            if (shouldResolveToken(state)) {
                return Object.assign({}, state, {
                    fetchingToken: true
                });
            }
            return state;

        case actions.RESOLVE_TOKEN:
            return {
                token: action.payload,
                loggedIn: action.payload != null,
                fetchingToken: false,
                tokenErr: action.error,
                resolved: true
            };

        default:
            return state;
    }
}

function profileList (state = {
    profiles: [],
    isFetching: false
}, action) {
    switch (action.type) {
        case actions.REQUEST_PROFILELIST:
            return Object.assign({}, state, { isFetching: true });

        case actions.RECEIVE_PROFILELIST:
            return Object.assign({}, state, {
                profiles: action.payload,
                error: action.error,
                isFetching: false
            });

        default:
            return state;
    }
}

const rootReducer = combineReducers({
    authToken,
    profileList
});

export default rootReducer;

