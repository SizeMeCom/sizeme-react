import { LocalProduct, SizemeOptions, SKUProduct, UiOptions } from "./types"

export const sizemeOptions: SizemeOptions = {
    serviceStatus: "off",
    contextAddress: "",
    shopType: "magento",
    debugState: false,
    uiOptions: {},
    ...(window as any).sizeme_options
}

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

export const uiOptions: UiOptions = {
    shopType: sizemeOptions.shopType,
    ...general,
    ...shops[sizemeOptions.shopType],
    ...sizemeOptions.uiOptions
}

export const sizemeProduct: SKUProduct | LocalProduct = (window as any).sizeme_product
export function isSKUProduct(product: SKUProduct | LocalProduct): product is SKUProduct {
    return "SKU" in product
}
