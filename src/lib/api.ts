import axios, { Axios, AxiosResponse } from "axios";
import {
  AuthTokenPresenter,
  ErrorResponse,
  IAuthPresenter,
  ProfilePresenter,
  SignInPayload,
  SuccessResponse,
} from "./api.types";
import secureCall from "./secureCall";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 500000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

export function getAxiosInstance() {
  return instance;
}

export function isSuccess(response: AxiosResponse<any>) {
  return response.status >= 200 && response.status < 300;
}

export function getHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
    Authorization: `Bearer ${getAccess()}`,
    Refresh: getRefresh(),
  };
}

export async function get<T>(url: string, params?: any) {
  return instance.get<T>(url, {
    params,
    headers: getHeaders(),
  });
}

export async function post<T>(url: string, data?: any) {
  return instance.post<T>(url, data, {
    headers: getHeaders(),
  });
}

export async function deleteRequest<T>(url: string, data?: any) {
  return instance.delete<T>(url, data);
}

export function getAccess() {
  if (typeof window !== "undefined") {
    const sTokens = localStorage.getItem("tokens");
    if (sTokens) {
      const parsed = JSON.parse(sTokens) as AuthTokenPresenter;
      return parsed.access;
    }
  }
  return "";
}

export function getRefresh() {
  if (typeof window !== "undefined") {
    const sTokens = localStorage.getItem("tokens");
    if (sTokens) {
      const parsed = JSON.parse(sTokens) as AuthTokenPresenter;
      return parsed.refresh;
    }
  }
  return "";
}

function storeAccess(token: Partial<AuthTokenPresenter>) {
  if (typeof window !== "undefined") {
    const sTokens = localStorage.getItem("tokens");
    let parsed = {};
    if (sTokens) {
      parsed = JSON.parse(sTokens);
    }
    localStorage.setItem(
      "tokens",
      JSON.stringify({
        ...parsed,
        ...token,
      })
    );
  }
}

export async function login(data: SignInPayload) {
  const res = await post<IAuthPresenter>("/auth/login", data);
  if (isSuccess(res)) {
    storeAccess(res.data.tokens);
  }
  return res;
}

export async function setHashnodePat(pat: string) {
  return post<IAuthPresenter>("/auth/set-hashnode-account", { pat });
}

export async function me() {
  return get<ProfilePresenter>("/auth/profile");
}

export async function refreshToken() {
  const res = await post<
    Pick<AuthTokenPresenter, "access" | "accessExpiresIn">
  >("/auth/refresh", { refreshToken: getRefresh() });
  if (isSuccess(res)) {
    console.log("Storing access data", res.data)
    storeAccess(res.data);
  }
  return res;
}

export function swrFetcher<T>(dispatch: any, router: any) {
  return (url: string) => {
    return secureCall(() => get<T>(url), dispatch, router).then((response) => {
      if (!response) {
        throw new Error("Not authenticated");
      }
      return response?.data;
    });
  };
}
