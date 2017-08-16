/* global sizeme_options, sizeme_product */

import "isomorphic-fetch";
import { trackEvent, gaEnabled } from "./ga.js";
import * as actions from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import SizeGuideModel, { DEFAULT_OPTIMAL_FIT } from "./ProductModel";
import Optional from "optional-js";
import SizeSelector from "./SizeSelector";
import uiOptions from "./uiOptions";
import equals from "shallow-equals";
import cookie from "react-cookie";

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

function observeStore (select, onChange) {
    let currentState;

    function handleChange () {
        let nextState = select(sizemeStore.getState());
        if (!equals(nextState, currentState)) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    let unsubscribe = sizemeStore.subscribe(handleChange);
    handleChange();
    return unsubscribe;
}

observeStore(
    ({ productInfo, selectedProfile }) => ({ product: productInfo.product, selectedProfile }),
    ({ product, selectedProfile }) => {
        let smAction;
        if (!product) {
            smAction = "noProduct";
        } else if (!Object.values(selectedProfile.measurements).some(item => item)) {
            smAction = "noHuman";
        } else if (!selectedProfile.id) {
            smAction = "hasUnsaved";
        } else {
            smAction = "hasProfile";
        }
        cookie.save("sm_action", smAction, { path: window.location.pathname });
    }
);

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

function getEndpointAddress (endpoint) {
    return `${contextAddress}/api/${endpoint}`;
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
            return true;
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
            return true;
        } else {
            dispatch(actions.fetchToken());
            try {
                const tokenResp = await fetch(getEndpointAddress("authToken"),
                    createRequest("GET", { withCredentials: true }))
                    .then(jsonResponse);
                sessionStorage.setItem("sizeme.authtoken", JSON.stringify(tokenResp));
                dispatch(actions.resolveToken(tokenResp.token));
                return tokenResp.token !== null;
            } catch (reason) {
                dispatch(actions.resolveToken(reason));
                return false;
            }
        }
    };
}

function signup (email) {
    return async (dispatch, getState) => {
        let token;
        dispatch(actions.signup());
        trackEvent("clickSignUp", "Store: Sign up clicked");
        try {
            const signupResp = await fetch(getEndpointAddress("createAccount"),
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
            profile.id = await fetch(getEndpointAddress("createProfile"),
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
            const profileList = await fetch(getEndpointAddress("profiles"), createRequest("GET", { token }))
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
            return true;
        }

        dispatch(actions.requestProductInfo());

        // eslint-disable-next-line camelcase
        const product = sizeme_product;
        if (!product) {
            dispatch(actions.receiveProductInfo(new Error("no product")));
            return false;
        }

        if (!product.SKU) {
            const model = new SizeGuideModel(sizeme_product.item);
            // eslint-disable-next-line camelcase
            dispatch(actions.receiveProductInfo({ ...sizeme_product, model }));
            return true;
        }

        try {
            const dbItem = await fetch(
                getEndpointAddress(`products/${encodeURIComponent(product.SKU)}`),
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
            return true;
        } catch (reason) {
            dispatch(actions.receiveProductInfo(reason));
            return false;
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
    const request = createRequest("POST", { token, body: fitRequest });
    const address = getEndpointAddress(useProfile ? "compareSizes" : "compareSizesSansProfile");
    return fetch(address, request).then(jsonResponse);
}

function getRecommendedFit (fitResults, optimalFit) {
    const optFit = optimalFit ? optimalFit : DEFAULT_OPTIMAL_FIT;
    const maxDist = uiOptions.maxRecommendationDistance || 9999;
    const [bestMatch] = fitResults
        .filter(([_, res]) => res.totalFit >= 1000 && res.accuracy > 0)
        .reduce(([accSize, fit], [size, res]) => {
            const newFit = Math.abs(res.totalFit - optFit);
            if (newFit <= maxDist && (!accSize || newFit < fit)) {
                return [size, newFit];
            } else {
                return [accSize, fit];
            }
        }, [null, 0]);
    return bestMatch;
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
                const fitResults = Object.entries(result);
                // if user is logged in, don't care about the accuracy. If not,
                // filter out results where accuracy is 0
                const recommendedFit = getRecommendedFit(
                    token ? fitResults : fitResults.filter(([, res]) => res.accuracy > 0),
                    product.item.fitRecommendation
                );
                dispatch(actions.receiveMatch(Object.assign(result, { recommendedFit })));

                if (doSelectBestFit) {
                    SizeSelector.setSelectedSize(recommendedFit);
                    dispatch(actions.selectSize({ auto: true }));
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
        dispatch(saveProfile());
        if (Object.values(measurements).some(item => item)) {
            await dispatch(match());
        } else {
            dispatch(actions.resetMatch());
        }
    };
}

function saveProfile () {
    return async (dispatch, getState) => {
        const profile = getState().selectedProfile;
        const token = getState().authToken.token;
        if (profile && token) {
            await fetch(getEndpointAddress(`updateProfileMeasurements/${profile.id}`),
                createRequest("PUT", { token, body: profile.measurements }))
                .then(() => dispatch(actions.savedMeasurements()));
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
    contextAddress,
    cdnLocation
};
