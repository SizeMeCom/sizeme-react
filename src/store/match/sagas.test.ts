import SagaTester from "redux-saga-tester"
import { RootState } from "../index"
import systemReducer from "../system/reducers"
import matchReducer from "./reducers"
import productInfoReducer from "../productInfo/reducers"
import { watchRequestMatch } from "./sagas"
import { requestMatch } from "./actions"
import profileReducer from "../profiles/reducers"
import { REQUEST_MATCH } from "./types"

describe("Match saga", () => {
    let sagaTester: SagaTester<Partial<RootState>>
    beforeEach(() => {
        sagaTester = new SagaTester({
            initialState: {
                match: {
                    matchResult: null,
                    recommendedFit: null,
                    matchState: "no-meas",
                    currentMatch: null
                }
            },
            reducers: {
                match: matchReducer,
                system: systemReducer
            }
        })
        jest.resetAllMocks()
    })

    it("does nothing is product is unresolved", () => {
        const sagaTester = new SagaTester({
            initialState: {},
            reducers: {
                productInfo: () => ({ resolved: false })
            }
        })
        sagaTester.start(watchRequestMatch)
        sagaTester.dispatch(requestMatch())
        expect(sagaTester.getCalledActions()).toHaveLength(1)
        expect(sagaTester.getLatestCalledAction().type).toEqual(REQUEST_MATCH)
    })
})
