export const RESET_TOKEN = "RESET_TOKEN"
export const FETCH_TOKEN = "FETCH_TOKEN"
export const RESOLVE_TOKEN = "RESOLVE_TOKEN"
export const CLEAR_TOKEN = "CLEAR_TOKEN"

export interface AuthState {
    loggedIn: boolean
    resolved: boolean
    token?: string
}

export interface ResetTokenAction {
    type: typeof RESET_TOKEN
}

export interface FetchTokenAction {
    type: typeof FETCH_TOKEN
    reset: boolean
}

export interface ResolveTokenAction {
    type: typeof RESOLVE_TOKEN
    token: string
}

export interface ClearTokenAction {
    type: typeof CLEAR_TOKEN
}

export type AuthActionTypes = ResetTokenAction | FetchTokenAction | ResolveTokenAction | ClearTokenAction
