const shopTypes = ["magento", "woocommerce", "vilkas", "crasmanKooKenka", "shopify"] as const;

export type ShopType = (typeof shopTypes)[number];

export type MeasurementUnit = "cm" | "in";

export interface ShopOptions {
  appendContentTo: string;
  invokeElement: string;
  invokeEvent: string;
  addToCartElement: string;
  addToCartEvent: string;
  firstRecommendation: boolean;
  sizeSelectorType: "default" | "crasman-koo";
}

export interface UIOptions extends ShopOptions {
  lang?: string;
  shopType: ShopType;
  disableSizeGuide: boolean;
  maxRecommendationDistance?: number;
  skinClasses?: string;
  toggler: boolean;
  firstRecommendation: boolean;
  flatMeasurements: boolean;
  measurementUnit?: MeasurementUnit;
  measurementUnitChoiceDisallowed?: boolean;
  matchGenderFromNameMale?: string;
}

export interface SizemeOptions {
  serviceStatus: "on" | "off" | "ab";
  shopType: ShopType;
  pluginVersion: "MAG1-0.1.0";
  contextAddress: "https://test.sizeme.com";
  debugState: false;
  uiOptions: UIOptions;
  additionalTranslations: Record<string, string>;
}

export interface MeasurementResult {
  overlap: number;
  componentFit: number;
  importance: number;
  componentStretch: number;
}
