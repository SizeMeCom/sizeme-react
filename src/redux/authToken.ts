import { AuthToken, isLoggedInAuthToken } from "../types/api";
import { createAction, createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { apiFetch } from "../api/api";
import { AppThunk } from "./store";

interface State {
  token?: string;
  loggedIn: boolean;
  isFetching: boolean;
  resolved: boolean;
  error?: string;
}

const initialState: State = {
  loggedIn: false,
  isFetching: false,
  resolved: false,
};

export const fetchToken = createAsyncThunk("fetchToken", () =>
  apiFetch<AuthToken>("GET", "authToken", { withCredentials: true })
);

export const resolveToken = createAction<AuthToken>("resolveToken");

const authTokenSlice = createSlice({
  name: "authToken",
  initialState,
  reducers: {
    checkToken: () => initialState,
    clearToken: () => ({ ...initialState, resolved: true }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToken.pending, (state) => ({ ...state, isFetching: true }))
      .addCase(fetchToken.rejected, (state, { error }) => ({
        ...state,
        isFetching: false,
        resolved: true,
        loggedIn: false,
        error: error.message,
      }))
      .addMatcher(isAnyOf(fetchToken.fulfilled, resolveToken), (state, { payload }) => ({
        ...state,
        isFetching: false,
        resolved: true,
        loggedIn: isLoggedInAuthToken(payload),
        token: payload.token ?? undefined,
      }));
  },
});

export const { checkToken, clearToken } = authTokenSlice.actions;

export default authTokenSlice.reducer;

export const resolveAuthToken =
  (reset = false): AppThunk =>
  async (dispatch, getState) => {
    if (!reset && getState().authToken.resolved) {
      return true;
    }

    dispatch(checkToken());

    const tokenObj = sessionStorage.getItem("sizeme.authtoken");
    let authToken: AuthToken | undefined;
    if (tokenObj) {
      let storedToken: AuthToken;
      try {
        storedToken = JSON.parse(tokenObj) as AuthToken;
        if (
          isLoggedInAuthToken(storedToken) &&
          Date.parse(storedToken.expires) > new Date().getTime()
        ) {
          authToken = storedToken;
        }
      } catch (e) {
        // no action
      }
    }

    if (authToken) {
      dispatch(resolveToken(authToken));
      return true;
    } else {
      try {
        const tokenResp = await dispatch(fetchToken()).unwrap();
        sessionStorage.setItem("sizeme.authtoken", JSON.stringify(tokenResp));
        return isLoggedInAuthToken(tokenResp);
      } catch (reason) {
        return false;
      }
    }
  };
