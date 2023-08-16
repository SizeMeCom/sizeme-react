import { FitResult, Measurements } from "./types";

export interface AuthToken {
  token: string | null;
}

export interface LoggedInAuthToken extends AuthToken {
  token: string;
  login: string;
  displayName: string;
  expires: string;
}

export const isLoggedInAuthToken = (authToken: AuthToken): authToken is LoggedInAuthToken =>
  authToken.token !== null;

export type CompareSizesResponse = Record<string, FitResult>;

export type Gender = "Male" | "Female";

export interface Profile {
  id: string;
  profileName: string;
  gender: Gender;
  measurements?: Measurements;
}
