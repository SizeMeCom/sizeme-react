/* global sizeme_options */

import "isomorphic-fetch";
import { trackEvent, gaEnabled } from "./ga.js";
import * as actions from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";

let contextAddress = sizeme_options.contextAddress || "https://www.sizeme.com";
let pluginVersion = sizeme_options.pluginVersion || "UNKNOWN";

const sizemeStore = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware
    )
);

/*** Action creators ***/

function checkToken () {
    return {
        type: actions.CHECK_TOKEN
    };
}

function fetchToken () {
    return {
        type: actions.FETCH_TOKEN
    };
}

function resolveToken (token, error) {
    return {
        type: actions.RESOLVE_TOKEN,
        payload: token,
        error
    };
}

function requestProfileList () {
    return {
        type: actions.REQUEST_PROFILELIST
    };
}

function receiveProfileList (profiles, error) {
    return {
        type: actions.RECEIVE_PROFILELIST,
        payload: profiles,
        error
    };
}

/*** Action creators end ***/

function createRequest (method, token, withCredentials = false) {
    let headers = new Headers({
        "X-Sizeme-Pluginversion": pluginVersion
    });

    if (gaEnabled) {
        headers.append("X-Analytics-Enabled", true);
    }

    if (token) {
        headers.append("Authorization", "Bearer " + token);
    }

    let request = {
        method,
        headers,
        mode: "cors"
    };

    if (withCredentials) {
        request.credentials = "include";
    }

    return request;
}

function jsonResponse (response) {
    if (response.ok) {
        return response.json();
    }
    throw new Error(response.state + " - " + response.statusText);
}

function resolveAuthToken () {
    return function (dispatch, getState) {
        return new Promise((resolve) => {
            if (getState().authToken.resolved) {
                resolve();
                return;
            }

            dispatch(checkToken());

            let tokenObj = sessionStorage.getItem("sizeme.authtoken");
            let authToken;
            if (tokenObj) {
                let storedToken;
                try {
                    storedToken = JSON.parse(tokenObj);
                    if (storedToken.token && storedToken.expires &&
                        Date.parse(storedToken.expires) > new Date().getTime()) {
                        authToken = storedToken.token;
                    }
                } catch (e) {
                    // no action
                }
            }

            if (authToken) {
                dispatch(resolveToken(authToken));
                resolve();
            } else {
                dispatch(fetchToken());
                resolve(fetch(contextAddress + "/api/authToken", createRequest("GET", null, true))
                    .then(jsonResponse)
                    .then((tokenResp) => {
                        sessionStorage.setItem("sizeme.authtoken", JSON.stringify(tokenResp));
                        dispatch(resolveToken(tokenResp.token));
                    })
                    .catch((reason) => {
                        dispatch(resolveToken(null, reason));
                    })
                );
            }
        });
    };
}

function getProfiles () {
    return function (dispatch, getState) {
        if (!getState().authToken.loggedIn) {
            return new Promise((resolve) => { resolve(); });
        }
        dispatch(requestProfileList());
        let token = getState().authToken.token;
        return fetch(contextAddress + "/api/profiles", createRequest("GET", token))
            .then(jsonResponse)
            .then((profileList) => {
                trackEvent("fetchProfiles", "API: fetchProfiles");
                dispatch(receiveProfileList(profileList));
            })
            .catch((reason) => {
                dispatch(receiveProfileList([], reason));
            });
    };
}

export {
    sizemeStore,
    resolveAuthToken,
    getProfiles
};
