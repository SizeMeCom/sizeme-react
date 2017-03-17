import { combineReducers } from "redux";
import {
    CHECK_TOKEN, FETCH_TOKEN, RESOLVE_TOKEN
} from "./actions";

function authToken (state = {
    loggedIn: false,
    fetchingToken: false,
    resolved: false
}, action) {
    switch (action.type) {
        case CHECK_TOKEN:
            return {
                loggedIn: false,
                fetchingToken: false,
                resolved: false
            };

        case FETCH_TOKEN:
            return Object.assign({}, state, {
                fetchingToken: true
            });

        case RESOLVE_TOKEN:
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

const rootReducer = combineReducers({
    authToken
});

export default rootReducer;

