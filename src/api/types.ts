import SizeGuideModel from "./SizeGuideModel"

type ShopType = "magento" | "woocommerce" | "vilkas" | "crasmanKooKenka"

export interface UiOptions {
    shopType?: ShopType
    disableSizeGuide?: boolean
    toggler?: boolean
    firstRecommendation?: boolean
    appendContentTo?: string
    invokeElement?: string
    invokeEvent?: string
    addToCartElement?: string
    addToCartEvent?: string
    sizeSelectorType?: string
    lang?: string
    maxRecommendationDistance?: number
}

export interface SizemeOptions {
    serviceStatus: "on" | "off"
    pluginVersion?: string
    contextAddress: string
    shopType: ShopType
    debugState: boolean
    uiOptions: UiOptions
    additionalTranslations?: {
        [key: string]: any
    }
}

export interface AuthToken {
    login?: string
    displayName?: string
    token: string | null
    expires?: string
}

export type Measurements = Record<string, number>

export interface NewProfile {
    profileName: string
    gender: "male" | "female"
    measurements: Measurements
}

export interface Profile extends NewProfile {
    id: string
}

export interface Item {
    itemType: string
    itemLayer: number
    itemThickness: number
    itemStretch: number
    fitRecommendation: number
    measurements: {
        [key: string]: Measurements
    }
}

export interface SKUProduct {
    name: string
    SKU: string
    item: Record<string, string>
}

export interface LocalProduct {
    name: string
    item: Item
}

export interface Product {
    name: string
    SKU?: string
    item: Item
    model: SizeGuideModel
    skuMap?: Map<string, string>
}

export interface FitRequest {
    profileId?: string
    measurements?: Measurements
    sku?: string
    item?: Item
}

export interface FitValues {
    importance: number
    overlap: number
    percentage: number
    componentFit: number
    componentStretch: number
}

export interface FitResult {
    matchMap: { [key: string]: FitValues }
    totalFit: number
    fitRangeLabel: string
    accuracy: number
    missingMeasurements: [[string, string]]
}

export type MatchResult = Record<string, FitResult>
