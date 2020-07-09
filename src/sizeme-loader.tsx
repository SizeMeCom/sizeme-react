import React from "react"
import { selectSize } from "./store/size/actions"
import { findVisibleElement } from "./api/utils"
import sizemeStore from "./store"
import { getUiOptions } from "./api/options"
import { render } from "react-dom"
import { I18nextProvider } from "react-i18next"
import i18n from "./i18n"
import { Provider } from "react-redux"
import SizeSelector from "./api/SizeSelector"
import SizeMeAppWrapper from "./SizeMeAppWrapper"
import { initializeSizeme, setSizemeHidden } from "./store/system/actions"

const uiOptions = getUiOptions()

if (uiOptions.toggler) {
    const sizemeToggledVisible = localStorage.getItem("sizemeToggledVisible") || "true"
    const sizemeHidden = !JSON.parse(sizemeToggledVisible)
    sizemeStore.dispatch(setSizemeHidden(sizemeHidden))
}

const el = findVisibleElement(uiOptions.appendContentTo)

if (el) {
    sizemeStore.dispatch(initializeSizeme())
    const section = el.appendChild(document.createElement("div"))
    render(
        <I18nextProvider i18n={i18n}>
            <Provider store={sizemeStore}>
                <SizeMeAppWrapper />
            </Provider>
        </I18nextProvider>,
        section,
        () => SizeSelector.initSizeSelector((size) => sizemeStore.dispatch(selectSize(size, false)))
    )
}
