import { REQUEST_PROFILE_LIST, RequestProfileListAction, SELECT_PROFILE, SelectProfileAction } from "./types"

export function getProfiles(): RequestProfileListAction {
    return {
        type: REQUEST_PROFILE_LIST
    }
}

export function selectProfile(profileId: string | null): SelectProfileAction {
    return {
        type: SELECT_PROFILE,
        payload: profileId
    }
}
