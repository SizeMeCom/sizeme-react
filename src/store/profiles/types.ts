import { Gender, Measurements, Profile } from "../../api/types"
import { ErrorAction } from "../index"

export const REQUEST_PROFILE_LIST = "REQUEST_PROFILE_LIST"
export const RECEIVE_PROFILE_LIST = "RECEIVE_PROFILE_LIST"
export const SELECT_PROFILE = "SELECT_PROFILE"
export const SELECT_PROFILE_DONE = "SELECT_PROFILE_DONE"
export const SET_MEASUREMENTS = "SET_MEASUREMENTS"
export const SAVED_MEASUREMENTS = "SAVED_MEASUREMENTS"

export interface ProfilesState {
    profileList: Profile[]
    selectedProfile: {
        id: string | null
        profileName?: string
        gender?: Gender
        selectDone: boolean
        measurements: Measurements
        dirty: boolean
    }
}

export interface RequestProfileListAction {
    type: typeof REQUEST_PROFILE_LIST
}

export interface ReceiveProfileListAction extends ErrorAction {
    type: typeof RECEIVE_PROFILE_LIST
    payload?: Profile[]
}

export interface SelectProfileAction {
    type: typeof SELECT_PROFILE
    payload: string | null
}

export interface SelectProfileDoneAction {
    type: typeof SELECT_PROFILE_DONE
    payload: Profile
}

export interface SetMeasurementsAction {
    type: typeof SET_MEASUREMENTS
    payload: Measurements
}

export interface SavedMeasurementsAction {
    type: typeof SAVED_MEASUREMENTS
}

export type ProfilesActionTypes =
    | RequestProfileListAction
    | ReceiveProfileListAction
    | SelectProfileAction
    | SelectProfileDoneAction
    | SetMeasurementsAction
    | SavedMeasurementsAction
