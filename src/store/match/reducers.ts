import { MatchActionTypes, MatchState, RECEIVE_MATCH, RESET_MATCH, SET_MATCH_STATE } from "./types"

const initialState: MatchState = {
    matchResult: null,
    recommendedFit: null,
    matchState: "no-meas",
    currentMatch: null
}

export default function matchReducer(state = initialState, action: MatchActionTypes): MatchState {
    switch (action.type) {
        case RECEIVE_MATCH:
            return {
                ...state,
                matchResult: action.payload?.matchResult || null,
                recommendedFit: action.payload?.recommendedFit || null
            }

        case RESET_MATCH:
            return initialState

        case SET_MATCH_STATE:
            return {
                ...state,
                ...action.payload
            }

        default:
            return state
    }
}
