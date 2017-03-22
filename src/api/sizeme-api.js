/* global sizeme_options, sizeme_product */

import "isomorphic-fetch";
import { trackEvent, gaEnabled } from "./ga.js";
import * as actions from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import rootReducer from "./reducers";
import { FitRequest } from "./SizeMe";

const OPTIMAL_FIT = 1070;

let contextAddress = sizeme_options.contextAddress || "https://www.sizeme.com";
let pluginVersion = sizeme_options.pluginVersion || "UNKNOWN";

const sizemeStore = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

function createRequest (method, token, withCredentials = false) {
    const headers = new Headers({
        "X-Sizeme-Pluginversion": pluginVersion
    });

    if (gaEnabled) {
        headers.append("X-Analytics-Enabled", true);
    }

    if (token) {
        headers.append("Authorization", "Bearer " + token);
    }

    const request = {
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

        const tokenObj = sessionStorage.getItem("sizeme.authtoken");
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
                const tokenResp = await fetch(`${contextAddress}/api/authToken`, createRequest("GET", null, true))
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
        const token = getState().authToken.token;
        try {
            const profileList = await fetch(`${contextAddress}/api/profiles`, createRequest("GET", token))
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
        const product = sizeme_product;
        if (!product) {
            dispatch(actions.receiveProductInfo(new Error("no product")));
            return undefined;
        }

        if (!product.SKU) {
            dispatch(actions.receiveProductInfo(sizeme_product));
            return undefined;
        }

        try {
            const dbItem = await fetch(
                `${contextAddress}/api/products/${encodeURIComponent(product.SKU)}`,
                createRequest("GET")
            ).then(jsonResponse);

            const skuMap = new Map(Object.entries(product.item));
            const measurements = Object.assign(
                {},
                ...Object.entries(dbItem.measurements)
                    .filter(([sku]) => skuMap.has(sku))
                    .map(([sku, val]) => ({ [skuMap.get(sku)]: val }))
            );
            const item = { ...dbItem, measurements };
            dispatch(actions.receiveProductInfo({ ...product, item, skuMap }));
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

        const profileList = getState().profileList.profiles;
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
    const request = createRequest("POST", token);
    const { headers } = request;
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

const sizeSelector = new class {
    constructor () {
        this.el = null;
    }

    dispatchChange = (size) => {
        sizemeStore.dispatch(actions.selectSize(size));
    };

    set selector (el) {
        this.el = el;
        this.el.addEventListener("change", (event) => {
            this.dispatchChange(event.target.value);
        });
    }

    setSelected = (val) => {
        if (this.el) {
            this.el.value = val;
            this.dispatchChange(val);
        }
    };

    getSelected = () => {
        if (this.el) {
            return this.el.value;
        } else {
            return "";
        }
    };

    clone = () => {
        if (this.el) {
            return this.el.cloneNode(true);
        } else {
            return null;
        }
    }
}();


function match () {
    return async (dispatch, getState) => {
        if (!getState().productInfo.resolved) {
            return undefined;
        }

        const product = getState().productInfo.product;
        const profile = getState().selectedProfile;

        const token = getState().authToken.token;
        const fitRequest = new FitRequest(
            token ? profile.id : profile.measurements,
            product.SKU || product.item
        );

        dispatch(actions.requestMatch());

        try {
            const matchResult = await doMatch(fitRequest, token);
            trackEvent("match", "API: match");

            let result = matchResult;
            if (product.SKU) {
                const skuMap = product.skuMap;
                result = Object.assign(
                    {},
                    ...Object.entries(matchResult)
                        .filter(([sku]) => skuMap.has(sku))
                        .map(([sku, res]) => ({ [skuMap.get(sku)]: res }))
                );
            }

            dispatch(actions.receiveMatch(result));

            const [bestMatch] = Object.entries(result).reduce(([accSize, fit], [size, res]) => {
                const newFit = Math.abs(res.totalFit - OPTIMAL_FIT);
                if (!accSize || newFit < fit) {
                    return [size, newFit];
                } else {
                    return [accSize, fit];
                }
            }, [null, 0]);
            sizeSelector.setSelected(bestMatch);
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
    match,
    sizeSelector
};
