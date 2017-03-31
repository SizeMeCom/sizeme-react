import { createActions } from "redux-actions";

export const CHECK_TOKEN = "CHECK_TOKEN";
export const FETCH_TOKEN = "FETCH_TOKEN";
export const RESOLVE_TOKEN = "RESOLVE_TOKEN";
export const REQUEST_PROFILE_LIST = "REQUEST_PROFILE_LIST";
export const RECEIVE_PROFILE_LIST = "RECEIVE_PROFILE_LIST";
export const REQUEST_PRODUCT_INFO = "REQUEST_PRODUCT_INFO";
export const RECEIVE_PRODUCT_INFO = "RECEIVE_PRODUCT_INFO";
export const SELECT_PROFILE = "SELECT_PROFILE";
export const SELECT_PROFILE_DONE = "SELECT_PROFILE_DONE";
export const SET_MEASUREMENTS = "SET_MEASUREMENTS";
export const REQUEST_MATCH = "REQUEST_MATCH";
export const RECEIVE_MATCH = "RECEIVE_MATCH";
export const SELECT_SIZE = "SELECT_SIZE";

export const { checkToken, fetchToken, resolveToken } = createActions(CHECK_TOKEN, FETCH_TOKEN, RESOLVE_TOKEN);
export const { requestProfileList, receiveProfileList } = createActions(REQUEST_PROFILE_LIST, RECEIVE_PROFILE_LIST);
export const { requestProductInfo, receiveProductInfo } = createActions(REQUEST_PRODUCT_INFO, RECEIVE_PRODUCT_INFO);
export const { selectProfile, selectProfileDone, setMeasurements } = createActions(
    SELECT_PROFILE, SELECT_PROFILE_DONE, SET_MEASUREMENTS
);
export const { requestMatch, receiveMatch } = createActions(REQUEST_MATCH, RECEIVE_MATCH);
export const { selectSize } = createActions(SELECT_SIZE);