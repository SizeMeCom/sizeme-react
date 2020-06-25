import { ProductInfoActionTypes, RECEIVE_PRODUCT_INFO, REQUEST_PRODUCT_INFO } from "./types"
import { Product } from "../../api/types"

export function requestProductInfo(): ProductInfoActionTypes {
    return {
        type: REQUEST_PRODUCT_INFO
    }
}

export function receiveProductInfo(product: Product): ProductInfoActionTypes {
    return {
        type: RECEIVE_PRODUCT_INFO,
        payload: product
    }
}
