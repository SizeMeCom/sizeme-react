/* global sizeme_options, sizeme_product */

import "isomorphic-fetch";
import { trackEvent, gaEnabled } from "./ga.js";
import * as actions from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import rootReducer from "./reducers";

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
    throw new Error(response.state + " - " + response.statusText);
}

function resolveAuthToken () {
    return function (dispatch, getState) {
        return new Promise((resolve) => {
            if (getState().authToken.resolved) {
                resolve();
                return;
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
                resolve();
            } else {
                dispatch(actions.fetchToken());
                resolve(fetch(contextAddress + "/api/authToken", createRequest("GET", null, true))
                    .then(jsonResponse)
                    .then((tokenResp) => {
                        sessionStorage.setItem("sizeme.authtoken", JSON.stringify(tokenResp));
                        dispatch(actions.resolveToken(tokenResp.token));
                    })
                    .catch((reason) => {
                        dispatch(actions.resolveToken(new Error(reason)));
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
        dispatch(actions.requestProfileList());
        let token = getState().authToken.token;
        return fetch(contextAddress + "/api/profiles", createRequest("GET", token))
            .then(jsonResponse)
            .then((profileList) => {
                trackEvent("fetchProfiles", "API: fetchProfiles");
                dispatch(actions.receiveProfileList(profileList));
            })
            .catch((reason) => {
                dispatch(actions.receiveProfileList(new Error(reason)));
            });
    };
}

function getProduct () {
    return function (dispatch, getState) {
        return new Promise((resolve) => {
            if (getState().productInfo.resolved) {
                resolve();
                return;
            }

            dispatch(actions.requestProductInfo());
            let product = sizeme_product;
            if (product) {
                if (product.SKU) {
                    resolve(
                        fetch(
                            contextAddress + "/api/products/" + encodeURIComponent(product.SKU),
                            createRequest("GET")
                        )
                            .then(jsonResponse)
                            .then((dbItem) => {
                                let productItem = { ...dbItem, measurements: {} };
                                for (let sku in dbItem.measurements) {
                                    if (dbItem.measurements.hasOwnProperty(sku) && product.item[sku]) {
                                        productItem.measurements[product.item[sku]] = dbItem.measurements[sku];
                                    }
                                }
                                dispatch(actions.receiveProductInfo({ ...product, item: productItem }));
                            })
                            .catch((reason) => {
                                dispatch(actions.receiveProductInfo(new Error(reason)));
                            })
                    );
                } else {
                    dispatch(actions.receiveProductInfo(product));
                    resolve();
                }
            } else {
                dispatch(actions.receiveProductInfo(new Error("no product")));
                resolve();
            }
        });
    };
}

function setSelectedProfile (profileId) {
    return function (dispatch, getState) {
        if (getState().selectedProfile === profileId) {
            return;
        }

        let profileList = getState().profileList.profiles.map(p => p.id);
        if (profileList.length === 0) {
            return;
        }

        if (!profileId) {
            profileId = sessionStorage.getItem("sizeme.selectedProfile") || profileList[0];
        }

        sessionStorage.setItem("sizeme.selectedProfile", profileId);
        dispatch(actions.selectProfile(profileId));
    };
}

export {
    sizemeStore,
    resolveAuthToken,
    getProfiles,
    getProduct,
    setSelectedProfile
};
