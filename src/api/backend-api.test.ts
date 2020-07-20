import * as api from "./backend-api"
import axios from "axios"
import { Profile } from "./types"
import { fail } from "assert"

jest.mock("axios")
// @ts-ignore
const mockedRequest = axios as jest.Mock

beforeEach(() => {
    mockedRequest.mockClear()
})

function checkCall(method: string, url: string, withCredentials: boolean = true) {
    const call = mockedRequest.mock.calls[0][0]
    expect(call.method).toEqual(method)
    expect(call.url).toEqual(url)
    if (withCredentials) {
        expect(call.withCredentials).toBeTruthy()
    }
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
        checkCall("get", "profiles")
    })

    it("fetches product", async () => {
        const sku = "SKU1"
        const data = {
            itemType: "1.1.1.1.1.1.1",
            itemLayer: 0,
            itemThickness: 1,
            itemStretch: 0,
            fitRecommendation: 1,
            measurements: {}
        }
        mockedRequest.mockResolvedValueOnce({
            data,
            status: 200
        })
        const product = await api.getProductInfo(sku)
        expect(product).toEqual(data)
        checkCall("get", `products/${encodeURIComponent(sku)}`)
    })

    it("handles missing product status (204) with an error", async () => {
        mockedRequest.mockResolvedValueOnce({
            status: 204
        })
        try {
            await api.getProductInfo("NA")
            fail("Error should've thrown")
        } catch (err) {
            expect(err.toString()).toEqual("Error: Product 'NA' not found")
        }
    })

    it("requests a match result", async () => {
        const data = {}
        mockedRequest.mockResolvedValueOnce({ data })
        const req = {
            profileId: "1234",
            sku: "sku"
        }
        const result = await api.match(req)
        expect(result).toEqual(data)
        checkCall("post", "compareSizes")
        expect(mockedRequest.mock.calls[0][0].data).toEqual(req)
    })

    it("fails to get match result with unknown profileId", async () => {
        const axiosError = new Error("Invalid user or profile id")
        mockedRequest.mockRejectedValueOnce(axiosError)
        try {
            await api.match({
                profileId: "unknown"
            })
            fail("Error should've thrown")
        } catch (err) {
            expect(err.toString()).toEqual("Error: Invalid user or profile id")
        }
    })
})
