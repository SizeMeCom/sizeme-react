import { SELECT_SIZE, SizeActionTypes } from "./types"

export function selectSize(size: string, auto: boolean): SizeActionTypes {
    return {
        type: SELECT_SIZE,
        payload: {
            size,
            auto
        }
    }
}
