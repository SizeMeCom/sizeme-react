import { AuthActionTypes, SET_LOGGED_IN } from "./types"

export function setLoggedIn(loggedIn: boolean): AuthActionTypes {
    return {
        type: SET_LOGGED_IN,
        payload: loggedIn
    }
}
