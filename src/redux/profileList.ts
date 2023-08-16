import { Profile } from "../types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "../api/api";
import { createAppAsyncThunk } from "./utils";

interface State {
  profiles: Profile[];
}

const initialState: State = {
  profiles: [],
};

export const getProfiles = createAppAsyncThunk("getProfiles", (_, { getState }) => {
  const token = getState().authToken.token;
  return apiFetch<Profile[]>("GET", "profiles", { token });
});

const profileListSlice = createSlice({
  name: "profileList",
  initialState,
  reducers: {},
  extraReducers: {
    "getProfiles/fulfilled": (state, { payload }: PayloadAction<Profile[]>) => {
      state.profiles = payload ?? [];
    },
  },
});

export default profileListSlice.reducer;
