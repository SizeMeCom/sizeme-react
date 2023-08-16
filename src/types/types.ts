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

export type ItemTypeId = string;
export type Measurements = Record<string, number>;

export interface FitItem {
  itemType: ItemTypeId;
  itemLayer: number;
  itemThickness: number;
  itemStretch: number;
  fitRecommendation: number;
  measurements: Record<string, Measurements>;
}

export interface FitRange {
  label: string;
  range: {
    start: number;
    end: number;
    step: number;
  };
}

export interface FitValues {
  importance: number;
  overlap: number;
  percentage: number;
  componentFit: number;
  componentStretch?: number;
}

export interface FitResult {
  matchMap: Record<string, FitValues>;
  totalFit: number;
  fitRangeLabel: string;
  accuracy: number;
  missingMeasurements: [string, string][];
}

export interface SKUProduct {
  name: string;
  SKU: string;
  item: Record<string, string>;
}

export interface SizemeProduct {
  name: string;
  item: FitItem;
}
