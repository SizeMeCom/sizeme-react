import { combineReducers } from "redux";
import { Action, handleAction, handleActions } from "redux-actions";
import * as actions from "./actions";
import authToken from "../redux/authToken";

function resolvePayload<A>(action: Action<A>, payloadKey: string, errorPayload: unknown = null) {
  return {
    [payloadKey]: action.error ? errorPayload : action.payload,
    error: action.error ? action.payload : null,
  };
}

interface SignupStatus {
  signupDone?: boolean;
  inProgress: boolean;
  error: unknown | null;
  message?: string;
}

const signupStatus = handleActions<SignupStatus>(
  {
    [actions.SIGNUP]: () => ({ error: null, inProgress: true }),

    [actions.SIGNUP_DONE]: (state, action) => ({
      ...state,
      inProgress: false,
      error: action.error ? action.payload.message : null,
      signupDone: !action.error,
    }),
  },
  {
    signupDone: false,
    inProgress: false,
    error: null,
  }
);

export const profileList = handleActions(
  {
    [actions.REQUEST_PROFILE_LIST]: (state) => ({ ...state, isFetching: true }),

    [actions.RECEIVE_PROFILE_LIST]: (state, action) => ({
      ...state,
      isFetching: false,
      ...resolvePayload(action, "profiles", []),
    }),
  },
  {
    profiles: [],
    isFetching: false,
  }
);

export const productInfo = handleActions(
  {
    [actions.REQUEST_PRODUCT_INFO]: (state) => ({ ...state, isFetching: true }),

    [actions.RECEIVE_PRODUCT_INFO]: (state, action) => ({
      ...state,
      isFetching: false,
      resolved: !action.error,
      ...resolvePayload(action, "product"),
    }),
  },
  {
    product: null,
    isFetching: false,
    resolved: false,
  }
);

export const selectedProfile = handleActions(
  {
    [actions.SELECT_PROFILE]: (state, action) => ({
      ...state,
      ...action.payload,
      selectDone: false,
      dirty: false,
    }),
    [actions.SELECT_PROFILE_DONE]: (state) => ({
      ...state,
      selectDone: true,
    }),
    [actions.SET_MEASUREMENTS]: (state, action) => ({
      ...state,
      ...resolvePayload(action, "measurements"),
      dirty: true,
    }),
    [actions.SAVED_MEASUREMENTS]: (state) => ({
      ...state,
      dirty: false,
    }),
  },
  {
    id: "",
    profileName: null,
    selectDone: false,
    measurements: {},
    dirty: false,
  }
);

export const match = handleActions(
  {
    [actions.REQUEST_MATCH]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.RECEIVE_MATCH]: (state, action) => ({
      ...state,
      isFetching: false,
      ...resolvePayload(action, "matchResult"),
    }),

    [actions.RESET_MATCH]: () => ({
      matchResult: null,
      isFetching: false,
    }),
  },
  {
    matchResult: null,
    isFetching: false,
  }
);

interface SelectedSizePayload {
  size: string;
  auto?: boolean;
}

export const selectedSize = handleAction<
  SelectedSizePayload & { firstMatch: boolean },
  SelectedSizePayload
>(
  actions.SELECT_SIZE,
  (state, action) => ({
    ...state,
    ...action.payload,
    firstMatch: false,
  }),
  {
    size: "",
    auto: false,
    firstMatch: true,
  }
);

const abStatus = handleAction<string | null, string | null>(
  actions.SET_AB_STATUS,
  (state, action) => action.payload,
  null
);

interface MatchStateAction {
  match: string | null;
  state: string;
}
export const matchState = handleAction<MatchStateAction, MatchStateAction>(
  actions.SET_MATCH_STATE,
  (state, action) => action.payload,
  {
    match: null,
    state: "no-meas",
  }
);

const sizemeHidden = handleAction<boolean, boolean>(
  actions.SET_SIZEME_HIDDEN,
  (state, action) => action.payload,
  false
);

const rootReducer = combineReducers({
  authToken,
  signupStatus,
  profileList,
  productInfo,
  selectedProfile,
  match,
  selectedSize,
  abStatus,
  matchState,
  sizemeHidden,
});

export default rootReducer;
