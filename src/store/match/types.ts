import { FitResult, MatchResult } from "../../api/types"
import { ErrorAction } from "../index"

export const REQUEST_MATCH = "REQUEST_MATCH"
export const RECEIVE_MATCH = "RECEIVE_MATCH"
export const RESET_MATCH = "RESET_MATCH"
export const SET_MATCH_STATE = "SET_MATCH_STATE"

export interface MatchState {
    matchResult: MatchResult | null
    recommendedFit: string | null
    matchState: string
    currentMatch: FitResult | null
}

export interface RequestMatchAction {
    type: typeof REQUEST_MATCH
}

export interface ReceiveMatchAction extends ErrorAction {
    type: typeof RECEIVE_MATCH
    payload?: {
        matchResult: MatchResult
        recommendedFit: string
    }
}

export interface ResetMatchAction {
    type: typeof RESET_MATCH
}

export interface SetMatchStateAction {
    type: typeof SET_MATCH_STATE
    payload: {
        matchState: string
        currentMatch: FitResult | null
    }
}

export type MatchActionTypes = RequestMatchAction | ReceiveMatchAction | ResetMatchAction | SetMatchStateAction
