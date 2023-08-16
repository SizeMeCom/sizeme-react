import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import uiOptions from "../api/uiOptions";

const sizemeHiddenSlice = createSlice({
  name: "sizemeHidden",
  initialState: uiOptions.toggler ? localStorage.getItem("sizemeToggledVisible") !== "true" : false,
  reducers: {
    setSizemeHidden: (state, { payload }: PayloadAction<boolean>) => {
      localStorage.setItem("sizemeToggledVisible", payload ? "false" : "true");
      return payload;
    },
  },
});

export const { setSizemeHidden } = sizemeHiddenSlice.actions;
export default sizemeHiddenSlice.reducer;
