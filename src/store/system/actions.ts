import { SET_SIZEME_HIDDEN, SystemActionTypes, TOGGLE_SIZEME_HIDDEN } from "./types"

export function toggleSizemeHidden(): SystemActionTypes {
    return {
        type: TOGGLE_SIZEME_HIDDEN
    }
}

export function setSizemeHidden(sizemeHidden: boolean): SystemActionTypes {
    return {
        type: SET_SIZEME_HIDDEN,
        payload: sizemeHidden
    }
}
