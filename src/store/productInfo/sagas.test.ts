import productInfoReducer from "./reducers"
import { watchRequestProductInfo } from "./sagas"
import { requestProductInfo } from "./actions"
import { RootState } from "../index"
import SagaTester from "redux-saga-tester"
import { RECEIVE_PRODUCT_INFO, RECEIVE_PRODUCT_INFO_ERROR } from "./types"
import systemReducer from "../system/reducers"
import * as options from "../../api/options"
import { defaultLocalProduct, defaultSKUItem, defaultSKUProduct, otherSKUProduct } from "../../../fixtures/products"
import * as api from "../../api/backend-api"

describe("ProductInfo saga", () => {
    let sagaTester: SagaTester<Partial<RootState>>
    beforeEach(() => {
        sagaTester = new SagaTester({
            initialState: {
                productInfo: {
                    resolved: false
                }
            },
            reducers: {
                productInfo: productInfoReducer,
                system: systemReducer
            }
        })
        jest.resetAllMocks()
    })

    it("fails when no product", async () => {
        sagaTester.start(watchRequestProductInfo)
        sagaTester.dispatch(requestProductInfo())
        await sagaTester.waitFor(RECEIVE_PRODUCT_INFO_ERROR)
        expect(sagaTester.getState().productInfo?.resolved).toBeFalsy()
        expect(sagaTester.getState().system?.error?.message).toEqual("no product")
    })

    it("fails with invalid local product", async () => {
        // @ts-ignore
        jest.spyOn(options, "getSizemeProduct").mockReturnValueOnce({
            name: "Invalid product"
        })
        sagaTester.start(watchRequestProductInfo)
        sagaTester.dispatch(requestProductInfo())
        await sagaTester.waitFor(RECEIVE_PRODUCT_INFO_ERROR)
        expect(sagaTester.getState().productInfo?.resolved).toBeFalsy()
        expect(sagaTester.getState().system?.error?.message).toEqual("Local product missing item type")
    })

    it("resolves local product successfully", async () => {
        jest.spyOn(options, "getSizemeProduct").mockReturnValueOnce(defaultLocalProduct)
        sagaTester.start(watchRequestProductInfo)
        sagaTester.dispatch(requestProductInfo())
        await sagaTester.waitFor(RECEIVE_PRODUCT_INFO)
        expect(sagaTester.getState().productInfo?.resolved).toBeTruthy()
        expect(sagaTester.getState().productInfo?.product).toMatchObject(defaultLocalProduct)
        expect(sagaTester.getState().productInfo?.product).toHaveProperty("model")
    })

    it("resolves SKU product successfully", async () => {
        jest.spyOn(options, "getSizemeProduct").mockReturnValueOnce(defaultSKUProduct)
        jest.spyOn(api, "getProductInfo").mockResolvedValueOnce(defaultSKUItem)
        sagaTester.start(watchRequestProductInfo)
        sagaTester.dispatch(requestProductInfo())
        await sagaTester.waitFor(RECEIVE_PRODUCT_INFO)
        expect(sagaTester.getState().productInfo?.resolved).toBeTruthy()
        expect(sagaTester.getState().productInfo?.product).toMatchObject(defaultLocalProduct)
        expect(sagaTester.getState().productInfo?.product).toHaveProperty("model")
        expect(api.getProductInfo).toHaveBeenCalledTimes(1)
    })

    it("fails to resolve SKU product with unknown sub-SKU's", async () => {
        jest.spyOn(options, "getSizemeProduct").mockReturnValueOnce(otherSKUProduct)
        jest.spyOn(api, "getProductInfo").mockResolvedValueOnce(defaultSKUItem)
        sagaTester.start(watchRequestProductInfo)
        sagaTester.dispatch(requestProductInfo())
        await sagaTester.waitFor(RECEIVE_PRODUCT_INFO_ERROR)
        expect(sagaTester.getState().productInfo?.resolved).toBeFalsy()
        expect(api.getProductInfo).toHaveBeenCalledTimes(1)
    })

    it("fails to resolve unknown SKU product", async () => {
        const apiError = new Error("Product not found")
        jest.spyOn(options, "getSizemeProduct").mockReturnValueOnce(defaultSKUProduct)
        jest.spyOn(api, "getProductInfo").mockRejectedValueOnce(apiError)
        sagaTester.start(watchRequestProductInfo)
        sagaTester.dispatch(requestProductInfo())
        await sagaTester.waitFor(RECEIVE_PRODUCT_INFO_ERROR)
        expect(sagaTester.getState().productInfo?.resolved).toBeFalsy()
        expect(sagaTester.getState().system?.error).toEqual(apiError)
        expect(api.getProductInfo).toHaveBeenCalledTimes(1)
    })
})
