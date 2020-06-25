import { takeLatest, put, call } from "redux-saga/effects"
import { RECEIVE_PRODUCT_INFO_ERROR, REQUEST_PRODUCT_INFO } from "./types"
import { Item, Product } from "../../api/types"
import SizeGuideModel from "../../api/SizeGuideModel"
import { receiveProductInfo } from "./actions"
import * as api from "../../api/backend-api"

export function* watchRequestProductInfo() {
    yield takeLatest(REQUEST_PRODUCT_INFO, getProductInfo)
}

function* getProductInfo() {
    const product = (window as any).sizeme_product as Product
    if (!product) {
        yield put({
            type: RECEIVE_PRODUCT_INFO_ERROR,
            error: new Error("no product")
        })
        return
    }

    if (!product.SKU) {
        if (!product.item.itemType) {
            yield put({
                type: RECEIVE_PRODUCT_INFO_ERROR,
                error: new Error("no product")
            })
            return
        }
        const model = new SizeGuideModel(product.item as Item)
        yield put(receiveProductInfo({ ...product, model }))
        return
    }

    try {
        const dbItem: Item = yield call(api.getProductInfo, product.SKU)
        const skuMap = new Map(Object.entries(product.item))
        const measurementEntries = Object.entries(dbItem.measurements)
            .filter(([sku]) => skuMap.has(sku))
            .map(([sku, val]) => ({ [skuMap.get(sku)]: val }))

        if (measurementEntries.length) {
            const measurements = Object.assign({}, ...measurementEntries)
            const item = { ...dbItem, measurements }
            const model = new SizeGuideModel(item)
            yield put(receiveProductInfo({ ...product, item, skuMap, model }))
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

/*
return async (dispatch, getState) => {
        if (getState().productInfo.resolved) {
            return true;
        }

        dispatch(actions.requestProductInfo());

        // eslint-disable-next-line camelcase
        const product = sizeme_product;
        if (!product) {
            dispatch(actions.receiveProductInfo(new Error("no product")));
            return false;
        }

        if (!product.SKU) {
            if (!product.item.itemType) {
                dispatch(actions.receiveProductInfo(new Error("no product")));
                return false;
            }
            const model = new SizeGuideModel(sizeme_product.item);
            // eslint-disable-next-line camelcase
            dispatch(actions.receiveProductInfo({ ...sizeme_product, model }));
            return true;
        }

        try {
            const dbItem = await fetch(
                getEndpointAddress(`products/${encodeURIComponent(product.SKU)}`),
                createRequest("GET")
            )
                .then((response) => {
                    if (response.status === 204) {
                        throw new ApiError("Product not found", response);
                    } else {
                        return response;
                    }
                })
                .then(jsonResponse);

            const skuMap = new Map(Object.entries(product.item));
            const measurementEntries = Object.entries(dbItem.measurements)
                .filter(([sku]) => skuMap.has(sku))
                .map(([sku, val]) => ({ [skuMap.get(sku)]: val }));

            if (measurementEntries.length) {
                const measurements = Object.assign({}, ...measurementEntries);
                const item = { ...dbItem, measurements };
                const model = new SizeGuideModel(item);
                dispatch(actions.receiveProductInfo({ ...product, item, skuMap, model }));
                return true;
            } else {
                console.log("Initializing SizeMe failed: Couldn't map product measurements");
                dispatch(actions.requestProductInfo(new ApiError("Couldn't map product measurements")));
            }
        } catch (reason) {
            dispatch(actions.receiveProductInfo(reason));
            return false;
        }
    }
 */
