import { takeLatest, put, call } from "redux-saga/effects"
import { RECEIVE_PRODUCT_INFO_ERROR, REQUEST_PRODUCT_INFO } from "./types"
import { Item, LocalProduct, SKUProduct } from "../../api/types"
import SizeGuideModel from "../../api/SizeGuideModel"
import { receiveProductInfo } from "./actions"
import * as api from "../../api/backend-api"
import { sizemeProduct, isSKUProduct } from "../../api/options"

export function* watchRequestProductInfo() {
    yield takeLatest(REQUEST_PRODUCT_INFO, getProductInfo)
}

function* getProductInfo() {
    if (!sizemeProduct) {
        yield put({
            type: RECEIVE_PRODUCT_INFO_ERROR,
            error: new Error("no product")
        })
        return
    }

    if (!isSKUProduct(sizemeProduct)) {
        const product = sizemeProduct as LocalProduct
        if (!product.item.itemType) {
            yield put({
                type: RECEIVE_PRODUCT_INFO_ERROR,
                error: new Error("no product")
            })
            return
        }
        const model = new SizeGuideModel(product.item)
        yield put(receiveProductInfo({ ...product, model }))
        return
    }

    try {
        const product = sizemeProduct as SKUProduct
        const dbItem: Item = yield call(api.getProductInfo, product.SKU)
        const skuMap = new Map(Object.entries(product.item))
        const measurementEntries = Object.entries(dbItem.measurements)
            .filter(([sku]) => skuMap.has(sku))
            .map(([sku, val]) => ({ [skuMap.get(sku) as string]: val }))

        if (measurementEntries.length) {
            const measurements = Object.assign({}, ...measurementEntries)
            const item = { ...dbItem, measurements }
            const model = new SizeGuideModel(item)
            yield put(receiveProductInfo({ ...product, item, skuMap, model, SKU: product.SKU }))
        } else {
            console.log("Initializing SizeMe failed: Couldn't map product measurements")
            yield put({
                type: RECEIVE_PRODUCT_INFO_ERROR,
                error: new Error("Couldn't map product measurements")
            })
        }
    } catch (error) {
        yield put({
            type: RECEIVE_PRODUCT_INFO_ERROR,
            error
        })
    }
}
