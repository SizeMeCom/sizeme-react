import {findVisibleElement, selectSize, setSizemeHidden, sizemeStore} from "./api/sizeme-api";
import uiOptions from "./api/uiOptions";
import {render} from "react-dom";
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";
import {Provider} from "react-redux";
import SizeSelector from "./api/SizeSelector";
import React from "react";
import "./scss/index.scss";
import SizeMeAppWrapper from "./SizeMeAppWrapper";

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
