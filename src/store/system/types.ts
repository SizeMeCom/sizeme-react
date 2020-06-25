export const SET_SIZEME_HIDDEN = "SET_SIZEME_HIDDEN"
export const TOGGLE_SIZEME_HIDDEN = "TOGGLE_SIZEME_HIDDEN"

export interface SystemState {
    sizemeHidden: boolean
}

export interface ToggleSizemeHiddenAction {
    type: typeof TOGGLE_SIZEME_HIDDEN
}

export interface SetSizemeHiddenAction {
    type: typeof SET_SIZEME_HIDDEN
    payload: boolean
}

export type SystemActionTypes = ToggleSizemeHiddenAction | SetSizemeHiddenAction
