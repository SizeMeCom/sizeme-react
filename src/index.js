/* global sizeme_options */

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { isLoggedIn } from "./api/sizeme-api";
import sizeMeReducer from "./reducers/index";
import SizeMeApp from "./SizeMeApp.jsx";

let store = createStore(sizeMeReducer, {
    loggedIn: isLoggedIn()
});

let section = document.createElement("div");
document.getElementById("product-options-wrapper").appendChild(section);
render(
    <Provider store={store}>
        <SizeMeApp/>
    </Provider>,
    section
);
