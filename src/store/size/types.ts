export const SELECT_SIZE = "SELECT_SIZE"

export interface SizeState {
    size: string
    auto: boolean
    firstMatch: boolean
}

export interface SelectSizeAction {
    type: typeof SELECT_SIZE
    payload: {
        size: string
        auto: boolean
    }
}

export type SizeActionTypes = SelectSizeAction
