/* global VERSION, BUILD_DATE, sizeme_options */
import "babel-polyfill";

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { sizemeStore, selectSize } from "./api/sizeme-api";
import SizeMeApp from "./SizeMeApp";
import uiOptions from "./api/uiOptions";
import SizeSelector from "./api/SizeSelector";
import { setAbStatus } from "./api/actions";
import { I18nextProvider } from "react-i18next";
import { trackEvent } from "./api/ga";
import i18n from "./i18n";
import "./scss/index.scss";

console.log("Initializing SizeMe, version " + VERSION + ", built on " + BUILD_DATE);

let sizemeDisabled = false;

if (sizeme_options.serviceStatus === "ab") {
    const storageABValue = localStorage.getItem("sizemeABDisabled");

    if (!storageABValue) {
        sizemeDisabled = Math.floor(Math.random() * 100) % 2 === 0;
        localStorage.setItem("sizemeABDisabled", JSON.stringify(sizemeDisabled));
    } else {
        sizemeDisabled = JSON.parse(storageABValue);
    }

    const abStatus = sizemeDisabled ? "B" : "A";
    console.log("SizeMe A/B testing, status: " + abStatus);
    sizemeStore.dispatch(setAbStatus(abStatus));

    if (sizemeDisabled) {
        trackEvent("productPageLoggedOutABDenied", "Store: Product page load, logged out, AB SM denied");
    } else {
        trackEvent("productPageLoggedOutABEnabled", "Store: Product page load, logged out, AB SM enabled");
    }
}

const { addToCartElement, addToCartEvent } = uiOptions;
if (addToCartElement && addToCartEvent) {
    const elements = document.querySelectorAll(addToCartElement);
    const fn = () => {
        const { authToken, productInfo } = sizemeStore.getState();
        const loggedIn = authToken.loggedIn;
        const sizemeProductPage = productInfo.product !== null;
        if (loggedIn && sizemeProductPage) {
            trackEvent("addToCartSM", "Store: Product added to cart by SizeMe user");
        } else if (loggedIn && !sizemeProductPage) {
            trackEvent("addNonSMToCartSM", "Store: Non-SizeMe product added to cart by SizeMe user");
        } else if (!loggedIn && sizemeProductPage) {
            trackEvent("addToCart", "Store: Product added to cart");
        } else {
            trackEvent("addNonSMToCart", "Store: Non-SizeMe product added to cart");
        }
    };
    for (let i = 0; i < elements.length; i++) {
        elements.item(i).addEventListener(addToCartEvent, fn);
    }
}

if (!sizemeDisabled) {
    const section = document.createElement("div");
    document.querySelector(uiOptions.appendContentTo).appendChild(section);

    //noinspection RequiredAttributes
    render(
        <I18nextProvider i18n={i18n}>
            <Provider store={sizemeStore}>
                <SizeMeApp/>
            </Provider>
        </I18nextProvider>,
        section,
        () => SizeSelector.initSizeSelector(size => sizemeStore.dispatch(selectSize(size, false)))
    );
}
