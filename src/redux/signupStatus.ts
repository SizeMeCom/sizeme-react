import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../api/api";
import { AuthToken } from "../types/api";

interface State {
  signupDone: boolean;
  inProgress: boolean;
  error?: string;
}

const initialState: State = {
  signupDone: false,
  inProgress: false,
};

export const signup = createAsyncThunk("signup", (email: string) =>
  apiFetch<AuthToken>("POST", "createAccount", { withCredentials: true, body: { email } })
);

const signupStatusSlice = createSlice({
  name: "signupStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, () => ({ ...initialState, inProgress: true }))
      .addCase(signup.fulfilled, (state) => ({
        ...state,
        inProgress: false,
        signupDone: true,
      }))
      .addCase(signup.rejected, (state, action) => ({
        ...state,
        inProgress: false,
        error: action.error.message,
        signupDone: false,
      }));
  },
});

export default signupStatusSlice.reducer;
