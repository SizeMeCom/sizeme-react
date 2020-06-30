import { SET_SELECTED_SIZE, SizeActionTypes, SizeState } from "./types"

const initialState: SizeState = {
    size: "",
    auto: false,
    firstMatch: true
}

export default function (state: SizeState = initialState, action: SizeActionTypes) {
    switch (action.type) {
        case SET_SELECTED_SIZE:
            return {
                ...action.payload,
                firstMatch: false
            }

        default:
            return state
    }
}
