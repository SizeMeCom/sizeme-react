import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = string | null;

const abStatusSlice = createSlice({
  name: "abStatus",
  initialState: null as State,
  reducers: {
    setABStatus: (state, { payload }: PayloadAction<string>) => payload,
  },
});

export const { setABStatus } = abStatusSlice.actions;

export default abStatusSlice.reducer;
