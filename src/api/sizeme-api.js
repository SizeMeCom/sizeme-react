import fetch from 'isomorphic-fetch';
import "./ga.js";
import {
    CHECK_TOKEN, FETCH_TOKEN, RESOLVE_TOKEN
} from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";

let contextAddress = sizeme_options.contextAddress || "https://www.sizeme.com";
let pluginVersion = sizeme_options.pluginVersion;

const sizemeStore = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware
    )
);

/*** Action creators ***/

function checkToken () {
    return {
        type: CHECK_TOKEN
    };
}

function fetchToken () {
    return {
        type: FETCH_TOKEN
    };
}

function resolveToken (token, error) {
    return {
        type: RESOLVE_TOKEN,
        payload: token,
        error
    };
}

/*** Action creators end ***/

function resolveAuthToken () {
    return function (dispatch) {
        dispatch(checkToken());

        let tokenObj = sessionStorage.getItem("sizeme.authtoken");
        let authToken;
        if (tokenObj) {
            let storedToken;
            try {
                storedToken = JSON.parse(tokenObj);
                if (storedToken.token && storedToken.expires &&
                    Date.parse(storedToken.expires) > new Date().getTime()) {
                    authToken = resolveToken(storedToken.token);
                }
            } catch (e) {
                // no action
            }
        }

        if (authToken) {
            dispatch(resolveToken(authToken));
        } else {
            dispatch(fetchToken());
            let tokenRequest = {
                method: "GET",
                headers: {
                    "X-Sizeme-Pluginversion": pluginVersion
                },
                mode: "cors",
                credentials: "include"
            };

            fetch(contextAddress + "/api/authToken", tokenRequest)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(response.state + " - " + response.statusText);
                })
                .then((tokenResp) => {
                    sessionStorage.setItem("sizeme.authtoken", JSON.stringify(tokenResp));
                    dispatch(resolveToken(tokenResp.token));
                })
                .catch((reason) => {
                    dispatch(resolveToken(null, reason));
                });
        }
    };
}

export {
    sizemeStore,
    resolveAuthToken
};
