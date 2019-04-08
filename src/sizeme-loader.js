import {findVisibleElement, selectSize, setSizemeHidden, sizemeStore} from "./api/sizeme-api";
import uiOptions from "./api/uiOptions";
import {render} from "react-dom";
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";
import {Provider} from "react-redux";
import SizeSelector from "./api/SizeSelector";
import React from "react";
import {trackEvent} from "./api/ga";
import "./scss/index.scss";
import SizeMeAppWrapper from "./SizeMeAppWrapper";

const {addToCartElement, addToCartEvent} = uiOptions;
if (addToCartElement && addToCartEvent) {
    const elements = document.querySelectorAll(addToCartElement);
    const fn = () => {
        const {authToken, productInfo} = sizemeStore.getState();
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

if (uiOptions.toggler) {
    const sizemeHidden = !JSON.parse(localStorage.getItem("sizemeToggledVisible"));
    setSizemeHidden(sizemeHidden)(sizemeStore.dispatch);
}

const el = findVisibleElement(uiOptions.appendContentTo);

if (el) {
    const section = el.appendChild(document.createElement("div"));
    //noinspection RequiredAttributes
    render(
        <I18nextProvider i18n={i18n}>
            <Provider store={sizemeStore}>
                <SizeMeAppWrapper/>
            </Provider>
        </I18nextProvider>,
        section,
        () => SizeSelector.initSizeSelector(size => sizemeStore.dispatch(selectSize(size, false)))
    );
}
