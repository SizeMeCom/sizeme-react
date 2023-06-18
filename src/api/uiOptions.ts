import { ShopOptions, ShopType, UIOptions } from "../types/types";

const defaults = {
  disableSizeGuide: false,
  toggler: false,
  firstRecommendation: true,
  flatMeasurements: true,
};

const shops: Record<ShopType, ShopOptions> = {
  magento: {
    appendContentTo: ".product-options",
    invokeElement: "select.super-attribute-select",
    invokeEvent: "change",
    addToCartElement: "button.btn-cart",
    addToCartEvent: "click",
    firstRecommendation: true,
    sizeSelectorType: "default",
  },
  woocommerce: {
    appendContentTo: ".sizeme-container",
    invokeElement: ".sizeme-selection-container select",
    invokeEvent: "change",
    addToCartElement: "button.single_add_to_cart_button",
    addToCartEvent: "click",
    firstRecommendation: true,
    sizeSelectorType: "default",
  },
  vilkas: {
    appendContentTo: ".PriceContainer",
    invokeElement: "#SelectedVariation0",
    invokeEvent: "change",
    addToCartElement: "button.AddToBasketButton",
    addToCartEvent: "click",
    firstRecommendation: false,
    sizeSelectorType: "default",
  },
  crasmanKooKenka: {
    appendContentTo: ".js-product-sizes",
    invokeElement: ".a-product-sizes",
    invokeEvent: "click",
    addToCartElement: "button.AddToBasketButton",
    addToCartEvent: "click",
    firstRecommendation: true,
    sizeSelectorType: "crasman-koo",
  },
  shopify: {
    appendContentTo: ".sizeme-container",
    invokeElement: ".single-option-selector",
    invokeEvent: "change",
    addToCartElement: "button.product-form__cart-submit",
    addToCartEvent: "click",
    firstRecommendation: true,
    sizeSelectorType: "default",
  },
};

export default ((sizemeOptions): UIOptions => {
  const shopType = sizemeOptions?.shopType ?? "magento";
  return {
    ...defaults,
    ...shops[shopType],
    ...sizemeOptions?.uiOptions,
    shopType,
  };
})(window.sizeme_options);
