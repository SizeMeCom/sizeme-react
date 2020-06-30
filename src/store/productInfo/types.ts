import { Product } from "../../api/types"
import { ErrorAction } from "../index"

export const REQUEST_PRODUCT_INFO = "REQUEST_PRODUCT_INFO"
export const RECEIVE_PRODUCT_INFO = "RECEIVE_PRODUCT_INFO"
export const RECEIVE_PRODUCT_INFO_ERROR = "RECEIVE_PRODUCT_INFO_ERROR"

export interface ProductInfoState {
    product?: Product
    resolved: boolean
}

export interface RequestProductInfoAction {
    type: typeof REQUEST_PRODUCT_INFO
}

export interface ReceiveProductInfoAction extends ErrorAction {
    type: typeof RECEIVE_PRODUCT_INFO | typeof RECEIVE_PRODUCT_INFO_ERROR
    payload?: Product
}

export type ProductInfoActionTypes = RequestProductInfoAction | ReceiveProductInfoAction
