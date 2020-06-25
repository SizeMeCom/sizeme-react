import { SystemState, SystemActionTypes, SET_SIZEME_HIDDEN } from "./types"

const initialState: SystemState = {
    sizemeHidden: false
}

export default function systemReducer(state = initialState, action: SystemActionTypes): SystemState {
    switch (action.type) {
        case SET_SIZEME_HIDDEN:
            return {
                sizemeHidden: action.payload
            }

        default:
            return state
    }
}
