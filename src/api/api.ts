import { contextAddress } from "./sizeme-api";

const pluginVersion = window.sizeme_options.pluginVersion ?? "UNKNOWN";

interface RequestOptions {
  token?: string;
  withCredentials?: boolean;
  body?: unknown;
  responseInterceptor?: (res: Response) => Response;
}

const createRequest = (
  method: string,
  { token, withCredentials, body }: RequestOptions = {}
): RequestInit => {
  const headers = new Headers({
    "X-Sizeme-Pluginversion": pluginVersion,
    "X-Analytics-Enabled": "true",
    Accept: "application/json",
    "Csrf-Token": "nocheck",
  });

  if (token) {
    headers.append("Authorization", "Bearer " + token);
  }

  const request: RequestInit = {
    method,
    headers,
    mode: "cors",
  };

  if (body) {
    headers.append("Content-Type", "application/json");
    request.body = JSON.stringify(body);
  }

  if (withCredentials) {
    request.credentials = "include";
  }

  return request;
};

const getEndpointAddress = (endpoint: string) => `${contextAddress}/api/${endpoint}`;

export class ApiError extends Error {
  constructor(message: string, public response: Response) {
    super(message);
  }

  isUnauthorized = () => this.response.status === 401 || this.response.status === 403;
}

export interface ApiResponse {
  error?: {
    message: string;
  };
}

const jsonResponse = <R>(response: Response): Promise<R> => {
  return response.json().then((js: R & ApiResponse) => {
    if (response.ok) {
      return js;
    }

    if (js.error) {
      throw new ApiError(js.error.message, response);
    } else {
      throw new ApiError(`${response.status} - ${response.statusText || "N/A"}`, response);
    }
  });
};

export const apiFetch = async <R>(
  method: string,
  endpoint: string,
  options: RequestOptions = {}
) => {
  const resp = await fetch(getEndpointAddress(endpoint), createRequest(method, options));
  return options.responseInterceptor
    ? jsonResponse<R>(options.responseInterceptor(resp))
    : jsonResponse<R>(resp);
};
