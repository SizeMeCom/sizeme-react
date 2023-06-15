const general = {
  disableSizeGuide: false,
  toggler: false,
  firstRecommendation: true,
  flatMeasurements: true,
  measurementUnit: "cm",
  measurementUnitChoiceDisallowed: false,
  matchGenderFromNameMale: "",
};

const shops = {
  magento: {
    appendContentTo: ".product-options",
    invokeElement: "select.super-attribute-select",
    addToCartElement: "button.btn-cart",
    addToCartEvent: "click",
    firstRecommendation: true,
    sizeSelectorType: "default",
  },
  woocommerce: {
    appendContentTo: ".sizeme-container",
    invokeElement: ".sizeme-selection-container select",
    addToCartElement: "button.single_add_to_cart_button",
    addToCartEvent: "click",
    firstRecommendation: true,
    sizeSelectorType: "default",
  },
  vilkas: {
    appendContentTo: ".PriceContainer",
    invokeElement: "#SelectedVariation0",
    addToCartElement: "button.AddToBasketButton",
    addToCartEvent: "click",
    firstRecommendation: false,
    sizeSelectorType: "default",
  },
  crasmanKooKenka: {
    appendContentTo: ".js-product-sizes",
    invokeElement: ".a-product-sizes",
    addToCartElement: "button.AddToBasketButton",
    addToCartEvent: "click",
    firstRecommendation: true,
    sizeSelectorType: "crasman-koo",
  },
  shopify: {
    appendContentTo: ".sizeme-container",
    invokeElement: ".single-option-selector",
    addToCartElement: "button.product-form__cart-submit",
    addToCartEvent: "click",
    firstRecommendation: true,
    sizeSelectorType: "default",
  },
};

export default ((sizemeOptions) => {
  if (sizemeOptions) {
    return Object.assign(
      { shopType: sizemeOptions.shopType },
      general,
      shops[sizemeOptions.shopType],
      sizemeOptions.uiOptions
    );
  } else {
    return {};
  }
})(window.sizeme_options);
