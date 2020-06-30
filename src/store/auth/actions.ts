import { AuthActionTypes, CLEAR_TOKEN, FETCH_TOKEN, RESET_TOKEN, RESOLVE_TOKEN } from "./types"

export function resetToken(): AuthActionTypes {
    return {
        type: RESET_TOKEN
    }
}

export function fetchToken(reset = false): AuthActionTypes {
    return {
        type: FETCH_TOKEN,
        payload: reset
    }
}

export function resolveToken(token: string): AuthActionTypes {
    return {
        type: RESOLVE_TOKEN,
        payload: token
    }
}

export function clearToken(): AuthActionTypes {
    return {
        type: CLEAR_TOKEN
    }
}
