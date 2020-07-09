import { SystemState, SystemActionTypes, SET_SIZEME_HIDDEN, SetSizemeHiddenAction } from "./types"
import { ErrorAction } from "../index"

const initialState: SystemState = {
    sizemeHidden: false
}

function isError(action: any): action is ErrorAction {
    return "error" in action
}

export default function systemReducer(state = initialState, action: SystemActionTypes | ErrorAction): SystemState {
    switch (action.type) {
        case SET_SIZEME_HIDDEN:
            return {
                sizemeHidden: (action as SetSizemeHiddenAction).payload
            }

        default:
            if (isError(action)) {
                // TODO: better error handling
                console.error("Error: ", action.error?.message)
                return {
                    ...state,
                    error: action.error
                }
            }
            return state
    }
}
