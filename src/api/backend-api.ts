import { FitRequest, Item, MatchResult, NewProfile, Profile } from "./types"
import { getSizemeOptions } from "./options"
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios"

const sizemeOptions = getSizemeOptions()
const contextAddress = sizemeOptions.contextAddress || "https://www.sizeme.com"
const pluginVersion = sizemeOptions.pluginVersion || "UNKNOWN"

async function request<T>(
    method: Method,
    url: string,
    { body }: { body?: any } = {},
    handleResp?: (resp: AxiosResponse<T>) => T
): Promise<T> {
    const headers: any = {
        "X-Sizeme-Pluginversion": pluginVersion,
        "X-Analytics-Enabled": true
    }

    const request: AxiosRequestConfig = {
        method,
        headers,
        baseURL: `${contextAddress}/api/`,
        url,
        withCredentials: true
    }

    if (body) {
        headers["Content-Type"] = "application/json"
        request.data = body
    }

    const resp = await axios(request)

    if (handleResp) {
        return handleResp(resp)
    }
    return resp.data
}

export async function createAccount(email: string): Promise<any> {
    return await request("post", "createAccount", { body: { email } })
}

export async function createProfile(profile: NewProfile): Promise<string> {
    return await request("post", "createProfile", { body: profile })
}

export async function getProfiles(): Promise<Profile[]> {
    return await request("get", "profiles")
}

export async function getProductInfo(sku: string): Promise<Item> {
    return await request("get", `products/${encodeURIComponent(sku)}`, {}, (resp) => {
        if (resp.status === 204) {
            throw new Error(`Product '${sku}' not found`)
        }
        return resp.data
    })
}

export async function match(fitRequest: FitRequest): Promise<MatchResult> {
    return await request("post", "compareSizes", { body: fitRequest })
}
