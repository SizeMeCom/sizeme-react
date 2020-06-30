import { MatchActionTypes, RECEIVE_MATCH, REQUEST_MATCH, RESET_MATCH, SET_MATCH_STATE } from "./types"
import { FitResult, MatchResult } from "../../api/types"

export function requestMatch(): MatchActionTypes {
    return {
        type: REQUEST_MATCH
    }
}

export function receiveMatch(matchResult: MatchResult, recommendedFit: string): MatchActionTypes {
    return {
        type: RECEIVE_MATCH,
        payload: {
            matchResult,
            recommendedFit
        }
    }
}

export function receiveMatchError(error: Error): MatchActionTypes {
    return {
        type: RECEIVE_MATCH,
        error: error
    }
}

export function resetMatch(): MatchActionTypes {
    return {
        type: RESET_MATCH
    }
}

export function setMatchState(matchState: string, currentMatch: FitResult | null = null): MatchActionTypes {
    return {
        type: SET_MATCH_STATE,
        payload: {
            matchState,
            currentMatch
        }
    }
}
