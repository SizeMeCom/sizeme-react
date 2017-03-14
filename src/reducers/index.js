import {combineReducers} from "redux";
import loggedIn from "./login";

const sizeMeReducer = combineReducers({
    loggedIn
});

export default sizeMeReducer;