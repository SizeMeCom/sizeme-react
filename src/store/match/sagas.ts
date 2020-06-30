import { takeLatest, put, call, select } from "redux-saga/effects"
import { REQUEST_MATCH } from "./types"
import { RootState } from "../index"
import { FitRequest, Item, MatchResult, Measurements, Product } from "../../api/types"
import { humanMeasurementMap } from "../../api/SizeGuideModel"
import * as api from "../../api/backend-api"
import { getRecommendedFit } from "../../api/SizeGuideModel"
import { receiveMatch, receiveMatchError, resetMatch } from "./actions"
import { SELECT_PROFILE_DONE, SET_MEASUREMENTS } from "../profiles/types"
import { selectSize } from "../size/actions"

export function* watchRequestMatch() {
    yield takeLatest([REQUEST_MATCH, SELECT_PROFILE_DONE, SET_MEASUREMENTS], requestMatch)
}

function* requestMatch() {
    const { productInfo, profile: profileState, auth }: RootState = yield select()

    if (!productInfo.resolved) {
        return
    }

    const product = productInfo.product as Product
    const profile = profileState.selectedProfile
    const token = auth.token
    const useProfile: boolean = !!token && !profile.dirty
    let subject: string | Measurements | null = null
    if (useProfile) {
        subject = profile.id
    } else {
        const essentialMeasurements = product.model.essentialMeasurements.map((v) => humanMeasurementMap.get(v))
        const localMeasurements = Object.entries(profile.measurements).filter(
            ([m, p]) => !!p && essentialMeasurements.includes(m)
        )
        if (localMeasurements.length > 0) {
            subject = Object.fromEntries(localMeasurements)
        }
    }

    if (subject) {
        const fitRequest: FitRequest = {}
        if (typeof subject === "string") {
            fitRequest.profileId = subject
        } else {
            fitRequest.measurements = subject
        }
        if (product.SKU) {
            fitRequest.sku = product.SKU
        } else {
            fitRequest.item = product.item as Item
        }

        try {
            const matchResult: MatchResult = yield call(api.match, fitRequest, token, useProfile)
            let result = matchResult
            if (product.SKU) {
                const skuMap = product.skuMap as Map<string, string>
                result = Object.fromEntries(
                    Object.entries(matchResult)
                        .filter(([sku]) => skuMap.has(sku))
                        .map(([sku, res]) => [skuMap.get(sku) as string, res])
                )
            }
            const fitResults = Object.entries(result)
            // if user is logged in, don't care about the accuracy. If not,
            // filter out results where accuracy is 0
            const recommendedFit = getRecommendedFit(
                token ? fitResults : fitResults.filter(([, res]) => res.accuracy > 0),
                product.item.fitRecommendation
            )
            yield put(receiveMatch(result, recommendedFit))
            yield put(selectSize(recommendedFit, true))
        } catch (reason) {
            yield put(receiveMatchError(reason))
        }
    } else {
        yield put(resetMatch())
    }
}
