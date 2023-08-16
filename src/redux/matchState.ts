import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  match: string | null;
  state: string;
}

const initialState: State = {
  match: null,
  state: "no-meas",
};

const matchStateSlice = createSlice({
  name: "matchState",
  initialState,
  reducers: {
    setMatchState: (_, { payload }: PayloadAction<State>) => payload,
  },
});

export const { setMatchState } = matchStateSlice.actions;
export default matchStateSlice.reducer;
