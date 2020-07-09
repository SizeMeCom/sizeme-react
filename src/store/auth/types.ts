export const SET_LOGGED_IN = "SET_LOGGED_IN"

export interface AuthState {
    loggedIn: boolean
    resolved: boolean
}

export interface SetLoggedInAction {
    type: typeof SET_LOGGED_IN
    payload: boolean
}

export type AuthActionTypes = SetLoggedInAction
