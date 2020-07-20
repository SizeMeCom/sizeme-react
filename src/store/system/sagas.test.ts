import { RootState } from "../index"
import SagaTester from "redux-saga-tester"
import systemReducer from "./reducers"
import { watchInitializeSizeme, watchToggleSizemeHidden } from "./sagas"
import { initializeSizeme, toggleSizemeHidden } from "./actions"
import { REQUEST_PRODUCT_INFO } from "../productInfo/types"
import { RECEIVE_PROFILE_LIST, REQUEST_PROFILE_LIST, SELECT_PROFILE } from "../profiles/types"

describe("System saga", () => {
    let sagaTester: SagaTester<Partial<RootState>>
    beforeEach(() => {
        sagaTester = new SagaTester({
            initialState: {
                system: {
                    sizemeHidden: false
                }
            },
            reducers: {
                system: systemReducer
            }
        })
        jest.resetAllMocks()
    })

    it("toggles sizeme hidden state", () => {
        sagaTester.start(watchToggleSizemeHidden)
        sagaTester.dispatch(toggleSizemeHidden())
        expect(sagaTester.getState().system?.sizemeHidden).toBeTruthy()
        sagaTester.dispatch(toggleSizemeHidden())
        expect(sagaTester.getState().system?.sizemeHidden).toBeFalsy()
    })

    it("initializes sizeme", async () => {
        sagaTester.start(watchInitializeSizeme)
        sagaTester.dispatch(initializeSizeme())
        await sagaTester.waitFor(REQUEST_PRODUCT_INFO)
        await sagaTester.waitFor(REQUEST_PROFILE_LIST)
        sagaTester.dispatch({
            type: RECEIVE_PROFILE_LIST,
            payload: []
        })
        await sagaTester.waitFor(SELECT_PROFILE)
    })
})
