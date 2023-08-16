/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authToken from "./authToken";
import signupStatus from "./signupStatus";
import abStatus from "./abStatus";
import sizemeHidden from "./sizemeHidden";
import profileList from "./profileList";
import productInfo from "./productInfo";
import matchState from "./matchState";
import tooltip from "./tooltip";
import { match, selectedProfile, selectedSize } from "../api/reducers";
import Cookies from "universal-cookie";
import equals from "shallow-equals";

export const store = configureStore({
  reducer: {
    authToken,
    signupStatus,
    abStatus,
    sizemeHidden,
    profileList,
    productInfo,
    // @ts-ignore
    selectedProfile,
    // @ts-ignore
    match,
    // @ts-ignore
    selectedSize,
    tooltip,
    matchState,
  },
  // @ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload.model"],
        // Ignore these action types
        ignoredActions: ["setProductInfo"],
        // Ignore these paths in the state
        ignoredPaths: ["productInfo.product.model", "productInfo.product.skuMap"],
      },
    }).concat(
      createLogger({
        predicate: () => window.sizeme_options.debugState,
        duration: true,
      })
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, undefined, AnyAction>;

const cookies = new Cookies();

interface ObservedState {
  product?: RootState["productInfo"]["product"];
  selectedProfile: RootState["selectedProfile"];
  abStatus?: RootState["abStatus"];
}

const observeStore = (
  select: (state: RootState) => ObservedState,
  onChange: (currentState: ObservedState) => void
) => {
  let currentState: ObservedState;

  const handleChange = () => {
    const nextState = select(store.getState());
    if (!equals(nextState, currentState)) {
      currentState = nextState;
      onChange(currentState);
    }
  };

  const unsusbscribe = store.subscribe(handleChange);
  handleChange();
  return unsusbscribe();
};

observeStore(
  ({ productInfo, selectedProfile, abStatus }) => ({
    product: productInfo.product,
    selectedProfile,
    abStatus,
  }),
  ({ product, selectedProfile, abStatus }) => {
    let smAction;
    const statusPostFix = abStatus ? "-" + abStatus : "";
    if (!product) {
      smAction = "noProduct" + statusPostFix;
    } else if (!Object.values(selectedProfile.measurements).some((item) => item)) {
      smAction = "noHuman";
    } else if (!selectedProfile.id) {
      smAction = "hasUnsaved";
    } else {
      smAction = "hasProfile";
    }
    cookies.set("sm_action", smAction, { path: "/" });
  }
);
