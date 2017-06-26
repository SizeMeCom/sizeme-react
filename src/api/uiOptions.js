/* global sizeme_options */

const general = {
    disableSizeGuide: false,
    lang: "en"
};

const shops = {
    magento: {
        appendContentTo: ".product-options",
        sizeSelectionElement: "select.sizeme-magento-size-selector",
        invokeElement: "select.super-attribute-select",
        invokeEvent: "change",
        addToCartElement: "button.btn-cart",
        addToCartEvent: "click",
        firstRecommendation: true,
        sizeSelectorType: "default",
        maxRecommendationDistance: null
    }
};

export default Object.assign({ shopType: sizeme_options.shopType }, general,
    shops[sizeme_options.shopType], sizeme_options.uiOptions);
