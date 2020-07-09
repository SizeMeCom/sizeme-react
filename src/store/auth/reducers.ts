import { AuthActionTypes, AuthState, SET_LOGGED_IN } from "./types"

const initialState: AuthState = {
    loggedIn: false,
    resolved: false
}

export default function authReducer(state = initialState, action: AuthActionTypes): AuthState {
    switch (action.type) {
        case SET_LOGGED_IN:
            return {
                loggedIn: action.payload,
                resolved: true
            }
        default:
            return state
    }
}
