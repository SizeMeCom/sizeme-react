import { ProductInfoActionTypes, ProductInfoState, RECEIVE_PRODUCT_INFO, RECEIVE_PRODUCT_INFO_ERROR } from "./types"

const initialState: ProductInfoState = {
    resolved: false
}

export default function (state: ProductInfoState = initialState, action: ProductInfoActionTypes) {
    switch (action.type) {
        case RECEIVE_PRODUCT_INFO:
            return {
                product: action.payload,
                resolved: true
            }

        case RECEIVE_PRODUCT_INFO_ERROR:
            return {
                resolved: false
            }

        default:
            return state
    }
}
