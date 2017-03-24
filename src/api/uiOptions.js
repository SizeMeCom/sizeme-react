/* global sizeme_options */

const shops = {
    magento: {
        shopType: "magento",
        appendContentTo: ".product-options",
        appendSplashTo: ".product-options",
        sizeSelectionElement: "select.sizeme-magento-size-selector",
        invokeElement: "select.super-attribute-select",
        invokeEvent: "change",
        addToCartElement: "form#product_addtocart_form a.liftup-button, form#product_addtocart_form button",
        addToCartEvent: "click",
        firstRecommendation: true
    }
};

export default shops[sizeme_options.shopType];
