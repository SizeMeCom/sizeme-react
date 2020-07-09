import * as api from "./backend-api"
import axios from "axios"
import { Profile } from "./types"

jest.mock("axios")
// @ts-ignore
const mockedRequest = axios as jest.Mock

function haveCredentials(call: any) {
    expect(call.withCredentials).toBeTruthy()
}

describe("Backend API", () => {
    it("fetches profiles", async () => {
        const profileList: Profile[] = [
            {
                id: "1",
                profileName: "Profile 1",
                measurements: {},
                gender: "male"
            },
            {
                id: "2",
                profileName: "Profile 2",
                measurements: {},
                gender: "female"
            }
        ]
        mockedRequest.mockResolvedValueOnce({
            data: profileList
        })
        const profiles = await api.getProfiles()
        expect(profiles).toEqual(profileList)
        const call = mockedRequest.mock.calls[0][0]
        expect(call.method).toEqual("get")
        expect(call.url).toEqual("profiles")
        haveCredentials(call)
    })
})
