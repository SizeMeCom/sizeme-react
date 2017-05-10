/* global sizeme_options */

const general = {
    disableSizeGuide: false
};

const shops = {
    magento: {
        appendContentTo: ".product-options",
        sizeSelectionElement: "select.sizeme-magento-size-selector",
        invokeElement: "select.super-attribute-select",
        invokeEvent: "change",
        addToCartElement: "form#product_addtocart_form a.liftup-button, form#product_addtocart_form button",
        addToCartEvent: "click",
        firstRecommendation: true
    }
};

export default Object.assign({}, general, shops[sizeme_options.shopType], sizeme_options.uiOptions);
