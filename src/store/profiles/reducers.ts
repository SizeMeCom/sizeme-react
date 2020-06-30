import {
    ProfilesActionTypes,
    ProfilesState,
    RECEIVE_PROFILE_LIST,
    SAVED_MEASUREMENTS,
    SELECT_PROFILE,
    SELECT_PROFILE_DONE,
    SET_MEASUREMENTS
} from "./types"

const initialState: ProfilesState = {
    profileList: [],
    selectedProfile: {
        id: null,
        selectDone: false,
        measurements: {},
        dirty: false
    }
}

export default function profileReducer(state = initialState, action: ProfilesActionTypes) {
    switch (action.type) {
        case RECEIVE_PROFILE_LIST:
            return {
                ...state,
                profileList: action.payload || []
            }

        case SELECT_PROFILE:
            return {
                ...state,
                selectedProfile: {
                    selectDone: false,
                    dirty: false,
                    measurements: {},
                    profileName: undefined,
                    id: action.payload
                }
            }

        case SELECT_PROFILE_DONE:
            const { profileName, id } = action.payload
            return {
                ...state,
                selectedProfile: {
                    ...state.selectedProfile,
                    profileName,
                    id,
                    selectDone: true
                }
            }

        case SET_MEASUREMENTS:
            return {
                ...state,
                selectedProfile: {
                    ...state.selectedProfile,
                    measurements: action.payload,
                    dirty: true
                }
            }

        case SAVED_MEASUREMENTS:
            return {
                ...state,
                selectedProfile: {
                    ...state.selectedProfile,
                    dirty: false
                }
            }

        default:
            return state
    }
}
