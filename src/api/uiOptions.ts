import { UiOptions } from "./types"
import sizemeOptions from "./sizemeOptions"

const general = {
    disableSizeGuide: false,
    toggler: false,
    firstRecommendation: true
}

const shops = {
    magento: {
        appendContentTo: ".product-options",
        invokeElement: "select.super-attribute-select",
        invokeEvent: "change",
        addToCartElement: "button.btn-cart",
        addToCartEvent: "click",
        firstRecommendation: true,
        sizeSelectorType: "default"
    },
    woocommerce: {
        appendContentTo: ".sizeme-container",
        invokeElement: ".sizeme-selection-container select",
        invokeEvent: "change",
        addToCartElement: "button.single_add_to_cart_button",
        addToCartEvent: "click",
        firstRecommendation: true,
        sizeSelectorType: "default"
    },
    vilkas: {
        appendContentTo: ".PriceContainer",
        invokeElement: "#SelectedVariation0",
        invokeEvent: "change",
        addToCartElement: "button.AddToBasketButton",
        addToCartEvent: "click",
        firstRecommendation: false,
        sizeSelectorType: "default"
    },
    crasmanKooKenka: {
        appendContentTo: ".js-product-sizes",
        invokeElement: ".a-product-sizes",
        invokeEvent: "click",
        addToCartElement: "button.AddToBasketButton",
        addToCartEvent: "click",
        firstRecommendation: true,
        sizeSelectorType: "crasman-koo"
    }
}

const uiOptions: UiOptions = {
    shopType: sizemeOptions.shopType,
    ...general,
    ...shops[sizemeOptions.shopType],
    ...sizemeOptions.uiOptions
}

export default uiOptions
