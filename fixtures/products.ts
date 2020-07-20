import { Item, LocalProduct, SKUProduct } from "../src/api/types"

export const defaultLocalProduct: LocalProduct = {
    name: "T-SHIRT",
    item: {
        itemType: "1.1.1.3.0.4.0",
        itemLayer: 0,
        itemThickness: 1,
        itemStretch: 20,
        fitRecommendation: 0,
        measurements: {
            "7": {
                chest: 500,
                waist: 480,
                sleeve: 200,
                sleeve_top_width: 208,
                wrist_width: 170,
                underbust: 0,
                neck_opening_width: 0,
                shoulder_width: 126,
                front_height: 700,
                pant_waist: 0,
                hips: 480,
                inseam: 0,
                outseam: 0,
                thigh_width: 0,
                knee_width: 0,
                calf_width: 0,
                pant_sleeve_width: 0,
                shoe_inside_length: 0,
                shoe_inside_width: 0,
                hat_width: 0,
                hood_height: 0
            },
            "6": {
                chest: 530,
                waist: 510,
                sleeve: 220,
                sleeve_top_width: 215,
                wrist_width: 175,
                underbust: 0,
                neck_opening_width: 0,
                shoulder_width: 130,
                front_height: 720,
                pant_waist: 0,
                hips: 510,
                inseam: 0,
                outseam: 0,
                thigh_width: 0,
                knee_width: 0,
                calf_width: 0,
                pant_sleeve_width: 0,
                shoe_inside_length: 0,
                shoe_inside_width: 0,
                hat_width: 0,
                hood_height: 0
            },
            "5": {
                chest: 560,
                waist: 540,
                sleeve: 240,
                sleeve_top_width: 222,
                wrist_width: 180,
                underbust: 0,
                neck_opening_width: 0,
                shoulder_width: 134,
                front_height: 740,
                pant_waist: 0,
                hips: 540,
                inseam: 0,
                outseam: 0,
                thigh_width: 0,
                knee_width: 0,
                calf_width: 0,
                pant_sleeve_width: 0,
                shoe_inside_length: 0,
                shoe_inside_width: 0,
                hat_width: 0,
                hood_height: 0
            }
        }
    }
}

export const defaultSKUProduct: SKUProduct = {
    name: "T-SHIRT",
    SKU: "M2180B | SEA EAGLE T-SHIRT | MELANGE BLUE | 161",
    item: {
        SS16_M2180B_BLUE_S: "7",
        SS16_M2180B_BLUE_M: "6",
        SS16_M2180B_BLUE_L: "5",
        SS16_M2180B_BLUE_XL: "4"
    }
}

export const otherSKUProduct: SKUProduct = {
    name: "T-SHIRT",
    SKU: "WHITE-TEE",
    item: {
        WHITE_TEE_S: "7",
        WHITE_TEE_M: "6",
        WHITE_TEE_L: "5",
        WHITE_TEE_XL: "4"
    }
}

export const defaultSKUItem: Item = {
    itemType: "1.1.1.3.0.4.0",
    itemLayer: 0,
    itemThickness: 1,
    itemStretch: 20,
    fitRecommendation: 0,
    measurements: {
        SS16_M2180B_BLUE_S: {
            chest: 500,
            waist: 480,
            sleeve: 200,
            sleeve_top_width: 208,
            wrist_width: 170,
            underbust: 0,
            neck_opening_width: 0,
            shoulder_width: 126,
            front_height: 700,
            pant_waist: 0,
            hips: 480,
            inseam: 0,
            outseam: 0,
            thigh_width: 0,
            knee_width: 0,
            calf_width: 0,
            pant_sleeve_width: 0,
            shoe_inside_length: 0,
            shoe_inside_width: 0,
            hat_width: 0,
            hood_height: 0
        },
        SS16_M2180B_BLUE_M: {
            chest: 530,
            waist: 510,
            sleeve: 220,
            sleeve_top_width: 215,
            wrist_width: 175,
            underbust: 0,
            neck_opening_width: 0,
            shoulder_width: 130,
            front_height: 720,
            pant_waist: 0,
            hips: 510,
            inseam: 0,
            outseam: 0,
            thigh_width: 0,
            knee_width: 0,
            calf_width: 0,
            pant_sleeve_width: 0,
            shoe_inside_length: 0,
            shoe_inside_width: 0,
            hat_width: 0,
            hood_height: 0
        },
        SS16_M2180B_BLUE_L: {
            chest: 560,
            waist: 540,
            sleeve: 240,
            sleeve_top_width: 222,
            wrist_width: 180,
            underbust: 0,
            neck_opening_width: 0,
            shoulder_width: 134,
            front_height: 740,
            pant_waist: 0,
            hips: 540,
            inseam: 0,
            outseam: 0,
            thigh_width: 0,
            knee_width: 0,
            calf_width: 0,
            pant_sleeve_width: 0,
            shoe_inside_length: 0,
            shoe_inside_width: 0,
            hat_width: 0,
            hood_height: 0
        }
    }
}
