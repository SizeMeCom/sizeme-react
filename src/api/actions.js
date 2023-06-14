import { createActions } from "redux-actions";

export const CHECK_TOKEN = "CHECK_TOKEN";
export const FETCH_TOKEN = "FETCH_TOKEN";
export const RESOLVE_TOKEN = "RESOLVE_TOKEN";
export const CLEAR_TOKEN = "CLEAR_TOKEN";
export const SIGNUP = "SIGNUP";
export const SIGNUP_DONE = "SIGNUP_DONE";
export const REQUEST_PROFILE_LIST = "REQUEST_PROFILE_LIST";
export const RECEIVE_PROFILE_LIST = "RECEIVE_PROFILE_LIST";
export const REQUEST_PRODUCT_INFO = "REQUEST_PRODUCT_INFO";
export const RECEIVE_PRODUCT_INFO = "RECEIVE_PRODUCT_INFO";
export const SELECT_PROFILE = "SELECT_PROFILE";
export const SELECT_PROFILE_DONE = "SELECT_PROFILE_DONE";
export const SET_MEASUREMENTS = "SET_MEASUREMENTS";
export const SAVED_MEASUREMENTS = "SAVED_MEASUREMENTS";
export const REQUEST_MATCH = "REQUEST_MATCH";
export const RECEIVE_MATCH = "RECEIVE_MATCH";
export const RESET_MATCH = "RESET_MATCH";
export const SELECT_SIZE = "SELECT_SIZE";
export const SET_TOOLTIP = "SET_TOOLTIP";
export const SET_AB_STATUS = "SET_AB_STATUS";
export const SET_MATCH_STATE = "SET_MATCH_STATE";
export const SET_SIZEME_HIDDEN = "SET_SIZEME_HIDDEN";

export const { checkToken, fetchToken, resolveToken, clearToken } = createActions(
  CHECK_TOKEN,
  FETCH_TOKEN,
  RESOLVE_TOKEN,
  CLEAR_TOKEN
);
export const { signup, signupDone } = createActions(SIGNUP, SIGNUP_DONE);
export const { requestProfileList, receiveProfileList } = createActions(
  REQUEST_PROFILE_LIST,
  RECEIVE_PROFILE_LIST
);
export const { requestProductInfo, receiveProductInfo } = createActions(
  REQUEST_PRODUCT_INFO,
  RECEIVE_PRODUCT_INFO
);
export const { selectProfile, selectProfileDone, setMeasurements, savedMeasurements } =
  createActions(SELECT_PROFILE, SELECT_PROFILE_DONE, SET_MEASUREMENTS, SAVED_MEASUREMENTS);
export const { requestMatch, receiveMatch, resetMatch } = createActions(
  REQUEST_MATCH,
  RECEIVE_MATCH,
  RESET_MATCH
);
export const { selectSize } = createActions(SELECT_SIZE);
export const { setTooltip } = createActions(SET_TOOLTIP);
export const { setAbStatus } = createActions(SET_AB_STATUS);
export const { setMatchState } = createActions(SET_MATCH_STATE);
export const { setSizemeHidden } = createActions(SET_SIZEME_HIDDEN);
