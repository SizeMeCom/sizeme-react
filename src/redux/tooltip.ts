import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = string | null;

const tooltipSlice = createSlice({
  name: "tooltip",
  initialState: null as State,
  reducers: {
    setTooltip: (_, { payload }: PayloadAction<string>) => payload,
  },
});

export const { setTooltip } = tooltipSlice.actions;
export default tooltipSlice.reducer;
