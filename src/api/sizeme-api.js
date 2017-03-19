/* global sizeme_options, sizeme_product */

import "isomorphic-fetch";
import { trackEvent, gaEnabled } from "./ga.js";
import * as actions from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import rootReducer from "./reducers";
import { FitRequest } from "./SizeMe";

let contextAddress = sizeme_options.contextAddress || "https://www.sizeme.com";
let pluginVersion = sizeme_options.pluginVersion || "UNKNOWN";

const sizemeStore = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

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
    throw new Error(`${response.status} - ${response.statusText || "N/A"}`);
}

function resolveAuthToken () {
    return async (dispatch, getState) => {
        if (getState().authToken.resolved) {
            return undefined;
        }

        dispatch(actions.checkToken());

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
            dispatch(actions.resolveToken(authToken));
        } else {
            dispatch(actions.fetchToken());
            try {
                let tokenResp = await fetch(`${contextAddress}/api/authToken`, createRequest("GET", null, true))
                    .then(jsonResponse);
                sessionStorage.setItem("sizeme.authtoken", JSON.stringify(tokenResp));
                dispatch(actions.resolveToken(tokenResp.token));
            } catch (reason) {
                dispatch(actions.resolveToken(reason));
            }
        }
    };
}

function getProfiles () {
    return async (dispatch, getState) => {
        if (!getState().authToken.loggedIn) {
            return undefined;
        }
        dispatch(actions.requestProfileList());
        let token = getState().authToken.token;
        try {
            let profileList = await fetch(`${contextAddress}/api/profiles`, createRequest("GET", token))
                .then(jsonResponse);

            trackEvent("fetchProfiles", "API: fetchProfiles");
            dispatch(actions.receiveProfileList(profileList));
        } catch (reason) {
            dispatch(actions.receiveProfileList(reason));
        }
    };
}

function getProduct () {
    return async (dispatch, getState) => {
        if (getState().productInfo.resolved) {
            return undefined;
        }

        dispatch(actions.requestProductInfo());

        //noinspection Eslint
        let product = sizeme_product;
        if (!product) {
            dispatch(actions.receiveProductInfo(new Error("no product")));
            return undefined;
        }

        if (!product.SKU) {
            dispatch(actions.receiveProductInfo(sizeme_product));
            return undefined;
        }

        try {
            let dbItem = await fetch(
                `${contextAddress}/api/products/${encodeURIComponent(product.SKU)}`,
                createRequest("GET")
            ).then(jsonResponse);

            let productItem = { ...dbItem, measurements: {} };
            for (let sku in dbItem.measurements) {
                if (dbItem.measurements.hasOwnProperty(sku) && product.item[sku]) {
                    productItem.measurements[product.item[sku]] = dbItem.measurements[sku];
                }
            }
            dispatch(actions.receiveProductInfo({ ...product, item: productItem }));
        } catch (reason) {
            dispatch(actions.receiveProductInfo(reason));
        }
    };
}

function setSelectedProfile (profileId) {
    return async (dispatch, getState) => {
        if (getState().selectedProfile === profileId) {
            return undefined;
        }

        if (!getState().authToken.loggedIn) {
            await dispatch(match());
            return undefined;
        }

        let profileList = getState().profileList.profiles;
        if (profileList.length === 0) {
            return undefined;
        }

        let profile;
        profileId = profileId || sessionStorage.getItem("sizeme.selectedProfile");
        if (profileId) {
            profile = profileList.find(p => p.id === profileId);
        }

        if (!profile) {
            profile = profileList[0];
        }

        sessionStorage.setItem("sizeme.selectedProfile", profile.id);
        dispatch(actions.selectProfile(profile));
        trackEvent("activeProfileChanged", "Store: Active profile changed");

        await dispatch(match());
    };
}

function doMatch (fitRequest, token) {
    let request = createRequest("POST", token);
    let { headers } = request;
    headers.append("Content-Type", "application/json");
    request.body = JSON.stringify(fitRequest);

    let address;
    if (token) {
        address = `${contextAddress}/api/compareSizes`;
    } else {
        address = `${contextAddress}/api/compareSizesSansProfile`;
    }

    return fetch(address, request).then(jsonResponse);
}

function match () {
    return async (dispatch, getState) => {
        if (!getState().productInfo.resolved) {
            return undefined;
        }

        let product = getState().productInfo.product;
        let profile = getState().selectedProfile;

        let token = getState().authToken.token;
        let fitRequest = new FitRequest(
            token ? profile.id : profile.measurements,
            product.SKU || product.item
        );

        dispatch(actions.requestMatch());

        try {
            let matchResult = await doMatch(fitRequest, token);
            trackEvent("match", "API: match");
            dispatch(actions.receiveMatch(new Map(Object.entries(matchResult))));
        } catch (reason) {
            dispatch(actions.receiveMatch(reason));
        }
    };
}

export {
    sizemeStore,
    resolveAuthToken,
    getProfiles,
    getProduct,
    setSelectedProfile,
    match
};
