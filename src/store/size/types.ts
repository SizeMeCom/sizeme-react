export const SELECT_SIZE = "SELECT_SIZE"
export const SET_SELECTED_SIZE = "SET_SELECTED_SIZE"

export interface SizeState {
    size: string
    auto: boolean
    firstMatch: boolean
}

export interface SelectSizeAction {
    type: typeof SELECT_SIZE | typeof SET_SELECTED_SIZE
    payload: {
        size: string
        auto: boolean
    }
}

export type SizeActionTypes = SelectSizeAction
