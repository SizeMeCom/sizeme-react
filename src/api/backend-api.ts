import { AuthToken, FitRequest, FitResult, NewProfile, Product, Profile } from "./types"
import sizemeOptions from "./sizemeOptions"
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios"

const contextAddress = sizemeOptions.contextAddress || "https://www.sizeme.com"
const pluginVersion = sizemeOptions.pluginVersion || "UNKNOWN"

export class ApiError extends Error {
    response: AxiosResponse
    constructor(message: string, response: AxiosResponse) {
        super(message)
        this.response = response
    }

    isUnauthorized = () => this.response.status === 401 || this.response.status === 403
}

async function request<T>(
    method: Method,
    url: string,
    { token, body }: { token?: string; body?: any } = {},
    handleResp?: (resp: AxiosResponse<T>) => T
): Promise<T> {
    const headers: any = {
        "X-Sizeme-Pluginversion": pluginVersion,
        "X-Analytics-Enabled": true
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const request: AxiosRequestConfig = {
        method,
        headers,
        baseURL: `${contextAddress}/api/`,
        url
    }

    if (body) {
        headers["Content-Type"] = "application/json"
        request.data = body
    }

    try {
        const resp = await axios(request)
        if (handleResp) {
            return handleResp(resp)
        }
        return resp.data
    } catch (err) {
        if (err.response) {
            throw new ApiError(err.response.statusText, err.response)
        }
        throw err
    }
}

export async function getAuthToken(): Promise<AuthToken> {
    return await request("get", "authToken")
}

export async function createAccount(email: string): Promise<AuthToken> {
    return await request("post", "createAccount", { body: { email } })
}

export async function createProfile(token: string, profile: NewProfile): Promise<string> {
    return await request("post", "createProfile", { token, body: profile })
}

export async function getProfiles(token: string): Promise<[Profile]> {
    return await request("get", "profiles", { token })
}

export async function getProductInfo(sku: string): Promise<Product> {
    return await request("get", `products/${encodeURIComponent(sku)}`, {}, (resp) => {
        if (resp.status === 204) {
            throw new ApiError("Product not found", resp)
        }
        return resp.data
    })
}

export async function match(fitRequest: FitRequest, token: string, useProfile: boolean): Promise<FitResult> {
    return await request("post", useProfile ? "compareSizes" : "compareSizesSansProfile", { token, body: fitRequest })
}
