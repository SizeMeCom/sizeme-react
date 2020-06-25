import { AuthActionTypes, AuthState, CLEAR_TOKEN, FETCH_TOKEN, RESET_TOKEN, RESOLVE_TOKEN } from "./types"

const initialState: AuthState = {
    loggedIn: false,
    resolved: false
}

export default function authReducer(state = initialState, action: AuthActionTypes): AuthState {
    switch (action.type) {
        case RESET_TOKEN:
            return initialState

        case RESOLVE_TOKEN:
            return {
                loggedIn: !!action.token,
                resolved: true,
                token: action.token
            }

        case CLEAR_TOKEN:
            return {
                ...initialState,
                resolved: true
            }

        case FETCH_TOKEN:
        default:
            return state
    }
}
