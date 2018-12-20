/* global sizeme_options */

const general = {
    disableSizeGuide: false,
    toggler: false
};

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
    }
};

export default Object.assign({ shopType: sizeme_options.shopType }, general,
    shops[sizeme_options.shopType], sizeme_options.uiOptions);
