/* global sizeme_options, sizeme_product */

import "isomorphic-fetch";
import { trackEvent, gaEnabled } from "./ga.js";
import * as actions from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import SizeGuideModel from "./ProductModel";
import Optional from "optional-js";

const OPTIMAL_FIT = 1070;

const contextAddress = sizeme_options.contextAddress || "https://www.sizeme.com";
const pluginVersion = sizeme_options.pluginVersion || "UNKNOWN";
const cdnLocation = "https://cdn.sizeme.com";
const storeMeasurementsKey = "sizemeMeasurements";

const sizemeStore = createStore(rootReducer, applyMiddleware(
    thunkMiddleware,
    createLogger({
        predicate: sizeme_options.debugState,
        duration: true
    })
));

class FitRequest {
    constructor (subject, item) {
        if (typeof subject === "string") {
            this.profileId = subject;
        } else {
            this.measurements = subject;
        }

        if (typeof item === "string") {
            this.sku = item;
        } else {
            this.item = item;
        }
    }
}

function createRequest (method, { token, withCredentials, body } = {}) {
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

    if (body) {
        headers.append("Content-Type", "application/json");
        request.body = JSON.stringify(body);
    }

    if (withCredentials) {
        request.credentials = "include";
    }

    return request;
}

class ApiError extends Error {
    constructor (message, response) {
        super(message);
        this.response = response;
    }

    isUnauthorized = () => this.response.status === 401 || this.response.status === 403;
}

function jsonResponse (response) {
    return response.json()
        .then(js => {
            if (response.ok) {
                return js;
            }

            if (js.message) {
                throw new ApiError(js.message, response);
            } else {
                throw new ApiError(`${response.status} - ${response.statusText || "N/A"}`, response);
            }
        });
}

function resolveAuthToken (reset = false) {
    return async (dispatch, getState) => {
        if (!reset && getState().authToken.resolved) {
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
                const tokenResp = await fetch(`${contextAddress}/api/authToken`,
                    createRequest("GET", { withCredentials: true }))
                    .then(jsonResponse);
                sessionStorage.setItem("sizeme.authtoken", JSON.stringify(tokenResp));
                dispatch(actions.resolveToken(tokenResp.token));
            } catch (reason) {
                dispatch(actions.resolveToken(reason));
            }
        }
    };
}

function signup (email) {
    return async (dispatch, getState) => {
        let token;
        dispatch(actions.signup());
        try {
            const signupResp = await fetch(`${contextAddress}/api/createAccount`,
                createRequest("POST", {
                    withCredentials: true,
                    body: { email }
                }))
                .then(jsonResponse);
            token = signupResp.token;
            if (token) {
                dispatch(actions.resolveToken(token));
            } else {
                dispatch(actions.signupDone(new Error("Token was empty")));
                return;
            }

            const profile = getState().selectedProfile;
            profile.id = await fetch(`${contextAddress}/api/createProfile`,
                createRequest("POST", { token, body: profile })).then(jsonResponse);
            dispatch(actions.receiveProfileList([profile]));
            dispatch(setSelectedProfile(profile.id));
            dispatch(actions.signupDone());
        } catch (reason) {
            dispatch(actions.signupDone(reason));
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
            const profileList = await fetch(`${contextAddress}/api/profiles`, createRequest("GET", { token }))
                .then(jsonResponse);

            trackEvent("fetchProfiles", "API: fetchProfiles");
            dispatch(actions.receiveProfileList(profileList));
        } catch (reason) {
            sessionStorage.removeItem("sizeme.authtoken");
            dispatch(actions.clearToken());
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

        // eslint-disable-next-line camelcase
        const product = sizeme_product;
        if (!product) {
            dispatch(actions.receiveProductInfo(new Error("no product")));
            return undefined;
        }

        if (!product.SKU) {
            const model = new SizeGuideModel(sizeme_product.item);
            // eslint-disable-next-line camelcase
            dispatch(actions.receiveProductInfo({ ...sizeme_product, model }));
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
            const model = new SizeGuideModel(item);
            dispatch(actions.receiveProductInfo({ ...product, item, skuMap, model }));
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

        const storedMeasurements = Optional.ofNullable(localStorage.getItem(storeMeasurementsKey))
            .map(i => JSON.parse(i))
            .orElse({});

        if (!getState().authToken.loggedIn) {
            dispatch(actions.selectProfile({
                gender: "Female",
                profileName: "My profile"
            }));
            dispatch(actions.selectProfileDone());
            dispatch(setProfileMeasurements(storedMeasurements));
            return undefined;
        }

        const profileList = getState().profileList.profiles;
        if (profileList.length === 0) {
            return undefined;
        }

        let profile;
        const storedProfileId = sessionStorage.getItem("sizeme.selectedProfile");
        profileId = profileId || storedProfileId;
        if (profileId) {
            profile = profileList.find(p => p.id === profileId);
        }

        if (!profile) {
            profile = profileList[0];
        }

        sessionStorage.setItem("sizeme.selectedProfile", profile.id);
        dispatch(actions.selectProfile(profile));
        trackEvent("activeProfileChanged", "Store: Active profile changed");

        if (storedProfileId === profile.id && Object.keys(storedMeasurements).length) {
            dispatch(actions.setMeasurements(Object.assign({}, profile.measurements, storedMeasurements)));
        } else {
            localStorage.removeItem(storeMeasurementsKey);
        }

        await dispatch(match());
        dispatch(actions.selectProfileDone());
    };
}

function doMatch (fitRequest, token, useProfile) {
    const request = createRequest("POST", { token });
    const { headers } = request;
    headers.append("Content-Type", "application/json");
    request.body = JSON.stringify(fitRequest);

    let address;
    if (useProfile) {
        address = `${contextAddress}/api/compareSizes`;
    } else {
        address = `${contextAddress}/api/compareSizesSansProfile`;
    }

    return fetch(address, request).then(jsonResponse);
}

const sizeSelector = new class {
    constructor () {
        this.el = null;
        this.sizeMapper = [];
    }

    dispatchChange = (size) => {
        sizemeStore.dispatch(actions.selectSize(size));
    };

    set selector (el) {
        this.el = el;
        this.el.addEventListener("change", (event) => {
            this.dispatchChange(event.target.value);
        });

        this.sizeMapper = [];
        const options = this.el.querySelectorAll("option");
        for (let i = 0; i < options.length; i++) {
            const option = options.item(i);
            const value = option.getAttribute("value");
            if (value) {
                this.sizeMapper.push([value, option.textContent]);
            }
        }
    }

    setSelected = (val) => {
        if (this.el) {
            this.el.value = val || "";
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

function selectBestFit (fitResults) {
    const [bestMatch] = fitResults.reduce(([accSize, fit], [size, res]) => {
        const newFit = Math.abs(res.totalFit - OPTIMAL_FIT);
        if (!accSize || newFit < fit) {
            return [size, newFit];
        } else {
            return [accSize, fit];
        }
    }, [null, 0]);
    if (bestMatch) {
        sizeSelector.setSelected(bestMatch);
    }
}

function match (doSelectBestFit = true) {
    return async (dispatch, getState) => {
        if (!getState().productInfo.resolved) {
            return undefined;
        }

        const product = getState().productInfo.product;
        const profile = getState().selectedProfile;

        const token = getState().authToken.token;
        const useProfile = token && !profile.dirty;
        let subject;
        if (useProfile) {
            subject = profile.id;
        } else {
            const localMeasurements = Object.entries(profile.measurements)
                .filter(([, p]) => !!p)
                .map(([k, v]) => ({ [k]: v }));
            if (localMeasurements.length > 0) {
                subject = Object.assign(...localMeasurements);
            }
        }

        if (subject) {
            const fitRequest = new FitRequest(
                subject, product.SKU || product.item
            );

            dispatch(actions.requestMatch());

            try {
                const matchResult = await doMatch(fitRequest, token, useProfile);
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

                if (doSelectBestFit) {
                    const fitResults = Object.entries(result);
                    // if user is logged in, don't care about the accuracy. If not,
                    // filter out results where accuracy is 0
                    selectBestFit(token ? fitResults : fitResults.filter(([, res]) => res.accuracy > 0));
                }
            } catch (reason) {
                dispatch(actions.receiveMatch(reason));
            }
        }
    };
}

function setProfileMeasurements (measurements) {
    return async (dispatch) => {
        localStorage.setItem(storeMeasurementsKey, JSON.stringify(measurements));
        dispatch(actions.setMeasurements(measurements));
        if (Object.values(measurements).some(item => item)) {
            await dispatch(match());
        } else {
            dispatch(actions.resetMatch());
        }
    };
}

export {
    sizemeStore,
    resolveAuthToken,
    signup,
    getProfiles,
    getProduct,
    setSelectedProfile,
    match,
    setProfileMeasurements,
    sizeSelector,
    contextAddress,
    cdnLocation
};
