import i18n from "i18next"
import { init, fitOrder } from "./ProductModel"
import { FitResult, Item } from "./types"
import { uiOptions } from "./options"

interface ArrowsType {
    [key: string]: {
        mirror: boolean
        coords: Array<{ X: number; Y: number }>
        style?: string
        lift: boolean
        midCircle?: { X: number; Y: number }
        num?: number
    }
}

interface MeasurementResult {
    componentFit: number
    importance: number
    overlap: number
}

const fitStep = 55
const norm = 1000

const fitLabelsAndColors = [
    { label: "too_small", arrowColor: "#BB5555" },
    { label: "slim", arrowColor: "#457A4C" },
    { label: "regular", arrowColor: "#42AE49" },
    { label: "loose", arrowColor: "#87B98E" },
    { label: "too_big", arrowColor: "#BB5555" }
]

class FitRange {
    readonly label: string
    readonly start: number
    readonly end: number
    readonly arrowColor: string

    constructor(label: string, start: number, end: number, arrowColor: string) {
        this.label = label
        this.start = start
        this.end = end
        this.arrowColor = arrowColor
    }

    matches(value: number) {
        return value >= this.start && value < this.end
    }
}

const fitRanges = fitLabelsAndColors.map((l, i) => {
    const start = (i - 1) * fitStep + norm
    const end = start + fitStep
    return new FitRange(l.label, start, end, l.arrowColor)
})

const subRange = new FitRange("too_small", Number.MIN_SAFE_INTEGER, fitRanges[0].start, "#999999")
const superRange = new FitRange("too_big", fitRanges.slice(-1)[0].end, Number.MAX_SAFE_INTEGER, "#BB5555")

const pinchedFits = [
    "chest",
    "waist",
    "underbust",
    "pant_waist",
    "hips",
    "thigh_width",
    "knee_width",
    "calf_width",
    "pant_sleeve_width",
    "neck_opening_width",
    "sleeve_top_width",
    "sleeve_top_opening",
    "wrist_width",
    "hat_width"
]

const longFits = ["inseam", "outseam", "sleeve", "front_height"]

export const humanMeasurementMap = new Map([
    ["sleeve", "sleeve"],
    ["chest", "chest"],
    ["waist", "shirtWaist"],
    ["neck_opening_width", "neckCircumference"],
    ["front_height", "frontHeight"],
    ["pant_waist", "pantWaist"],
    ["hips", "hips"],
    ["outseam", "outSeam"],
    ["thigh_width", "thighCircumference"],
    ["knee_width", "kneeCircumference"],
    ["calf_width", "calfCircumference"],
    ["pant_sleeve_width", "ankleCircumference"],
    ["shoe_inside_length", "footLength"],
    ["hat_width", "headCircumference"]
])

function getEssentialMeasurements(itemTypeArr: number[]) {
    const arr = []
    switch (itemTypeArr[0]) {
        case 1:
            arr.push("chest", "front_height")
            if (itemTypeArr[3] >= 6 && itemTypeArr[2] === 1) {
                arr.push("sleeve")
            }
            break

        case 2:
            arr.push("pant_waist", "hips")
            if (itemTypeArr[3] >= 6) {
                arr.push("outseam")
            }
            break

        case 3:
            arr.push("shoe_inside_length")
            if (itemTypeArr[3] > 6) {
                arr.push("calf_width")
            }
            if (itemTypeArr[3] > 7) {
                arr.push("knee_width")
            }
            break

        case 4:
            arr.push("hat_width")
            break
    }

    return arr
}

export default class SizeGuideModel {
    private measurementOrder: string[] = []
    private readonly arrows: ArrowsType
    private itemDrawing: unknown
    public essentialMeasurements: string[]
    private readonly getItemTypeComponent: (index: number) => number

    constructor(item: Item) {
        const itemTypeArr = Array.from(item.itemType)
            .filter((a) => a !== ".")
            .map((a) => parseInt(a, 10))
        const model = init(itemTypeArr)
        this.arrows = (model.arrows as unknown) as ArrowsType
        this.itemDrawing = model.itemDrawing as unknown

        const firstSize = Object.entries(item.measurements || {})[0]
        if (firstSize && firstSize[1]) {
            const measurements = firstSize[1]
            let i = 1
            for (const fit of fitOrder) {
                if (measurements[fit] && this.arrows[fit]) {
                    this.arrows[fit].num = i++
                    this.measurementOrder.push(fit)
                }
            }
        }
        this.essentialMeasurements = getEssentialMeasurements(itemTypeArr)
        this.getItemTypeComponent = (index) => itemTypeArr[index]
    }

    measurementName = (measurement: string): string | undefined => {
        if (this.getItemTypeComponent(0) === 1) {
            if (measurement === "hips" || measurement === "pantWaist") {
                return i18n.t("measurement.hem")
            }

            const sleeveLength = this.getItemTypeComponent(3)
            if (measurement === "wrist_width" && sleeveLength >= 2 && sleeveLength <= 5) {
                return i18n.t("measurement.sleeve_opening")
            }
        }

        return i18n.t(`measurement.${measurement}`)
    }

    static getFit = (measurementResult?: MeasurementResult, overflowFits: boolean = true): FitRange | undefined => {
        if (measurementResult) {
            const { componentFit, importance } = measurementResult
            let fitRange = fitRanges.find((fr) => fr.matches(componentFit))
            if (!fitRange && overflowFits) {
                fitRange = componentFit < norm ? subRange : superRange
            }
            if (importance !== 1 && fitRange?.label === "too_big") {
                fitRange = fitRanges.find((fr) => fr.label === "loose")
            }
            return fitRange
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getResult = (measurement: string, value: number, matchItem: MeasurementResult) => {
    let fitValue
    let fit
    let addPlus = false
    const pinched = pinchedFits.includes(measurement)
    if (matchItem && matchItem.componentFit > 0) {
        if (matchItem.overlap <= 0 && matchItem.componentFit >= 1000) {
            fitValue = 0
        } else if (pinched) {
            fitValue = matchItem.overlap / 40.0
        } else {
            fitValue = matchItem.overlap / 10.0
        }
        addPlus = matchItem.overlap > 0
        fit = SizeGuideModel.getFit(matchItem)
    } else if (value > 0) {
        fitValue = value / 10.0
    }
    let fitText = fitValue ? `${fitValue.toFixed(1)} cm` : ""

    if (addPlus) {
        fitText = "+" + fitText
    }

    return {
        fitValue,
        fitText,
        fit,
        isPinched: pinched,
        isLongFit: longFits.includes(measurement)
    }
}

const stretchFactor = (measurement: string) => {
    let factor = 1
    switch (measurement) {
        case "pant_waist":
            factor = 10
            break
        case "hips":
            factor = 8
            break
    }
    return factor
}

const DEFAULT_OPTIMAL_FIT = 1070
const DEFAULT_OPTIMAL_STRETCH = 5

export function getRecommendedFit(fitResults: [string, FitResult][], optimalFit: number): string {
    const optFit = optimalFit ? optimalFit : DEFAULT_OPTIMAL_FIT
    const maxDist = uiOptions.maxRecommendationDistance || 9999
    if (optFit === 1000) {
        const optStretch = DEFAULT_OPTIMAL_STRETCH
        const [bestMatch] = fitResults
            .filter(([, res]) => res.accuracy > 0)
            .reduce(
                ([accSize, fit]: [string | null, number], [size, res]) => {
                    let maxStretchArr: number[] = []
                    Object.entries(res.matchMap).forEach(([oKey, oValue]) => {
                        maxStretchArr.push(oValue.componentStretch / stretchFactor(oKey))
                    })
                    let maxStretch = Math.max.apply(null, maxStretchArr)
                    const newFit = Math.abs(res.totalFit - optFit) * 100 + Math.abs(maxStretch - optStretch)
                    if (newFit <= maxDist * 100 && (!accSize || newFit < fit)) {
                        return [size, newFit]
                    } else {
                        return [accSize, fit]
                    }
                },
                [null, 0]
            )
        return bestMatch || ""
    } else {
        const [bestMatch] = fitResults
            .filter(([, res]) => res.totalFit >= 1000 && res.accuracy > 0)
            .reduce(
                ([accSize, fit]: [string | null, number], [size, res]) => {
                    const newFit = Math.abs(res.totalFit - optFit)
                    if (newFit <= maxDist && (!accSize || newFit < fit)) {
                        return [size, newFit]
                    } else {
                        return [accSize, fit]
                    }
                },
                [null, 0]
            )
        return bestMatch || ""
    }
}
