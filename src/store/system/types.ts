export const SET_SIZEME_HIDDEN = "SET_SIZEME_HIDDEN"
export const TOGGLE_SIZEME_HIDDEN = "TOGGLE_SIZEME_HIDDEN"
export const INITIALIZE_SIZEME = "INITIALIZE_SIZEME"

export interface SystemState {
    sizemeHidden: boolean
    error?: Error
}

export interface ToggleSizemeHiddenAction {
    type: typeof TOGGLE_SIZEME_HIDDEN
}

export interface SetSizemeHiddenAction {
    type: typeof SET_SIZEME_HIDDEN
    payload: boolean
}

export interface InitializeSizemeAction {
    type: typeof INITIALIZE_SIZEME
}

export type SystemActionTypes = ToggleSizemeHiddenAction | SetSizemeHiddenAction | InitializeSizemeAction
