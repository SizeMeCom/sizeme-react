import { Profile } from "../src/api/types"

export const profile1: Profile = {
    id: "profile1",
    gender: "male",
    profileName: "Clyde Barrow",
    measurements: {
        chest: 80
    }
}

export const profile2: Profile = {
    id: "profile2",
    gender: "female",
    profileName: "Bonnie Parker",
    measurements: {
        chest: 80
    }
}

export const profileList: Profile[] = [profile1, profile2]
