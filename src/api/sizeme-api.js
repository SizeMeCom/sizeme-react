/* global sizeme_options, sizeme_product */

import "isomorphic-fetch";
import { trackEvent, gaEnabled } from "./ga.js";
import * as actions from "./actions";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import { FitRequest } from "./SizeMe";
import SizeGuideModel from "./ProductModel";

const OPTIMAL_FIT = 1070;

const contextAddress = sizeme_options.contextAddress || "https://www.sizeme.com";
const pluginVersion = sizeme_options.pluginVersion || "UNKNOWN";
const cdnLocation = "https://cdn.sizeme.com";

const sizemeStore = createStore(rootReducer, applyMiddleware(
    thunkMiddleware,
    createLogger({
        predicate: sizeme_options.debugState,
        duration: true
    })
));

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

class ApiError extends Error {
    constructor (response) {
        super(`${response.status} - ${response.statusText || "N/A"}`);
        this.response = response;
    }

    isUnauthorized = () => this.response.status === 401 || this.response.status === 403;
}

function jsonResponse (response) {
    if (response.ok) {
        return response.json();
    }
    throw new ApiError(response);
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

        if (!getState().authToken.loggedIn) {
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
        dispatch(actions.selectProfileDone());
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
        // TODO: fix forEach, which doesn't work with olders browsers?
        this.el.querySelectorAll("option").forEach((option) => {
            const value = option.getAttribute("value");
            if (value) {
                this.sizeMapper.push([value, option.textContent]);
            }
        }, this);
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
        let subject;
        if (token) {
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
    return async (dispatch, getState) => {
        dispatch(actions.setMeasurements(measurements));
        if (Object.values(measurements).some(item => item)) {
            await dispatch(match(!getState().selectedSize));
        } else {
            dispatch(actions.resetMatch());
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
    setProfileMeasurements,
    sizeSelector,
    contextAddress,
    cdnLocation
};
