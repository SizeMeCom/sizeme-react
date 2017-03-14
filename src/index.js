/* global sizeme_options */

//noinspection Eslint
import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import sizeMeReducer from "./reducers/index";
import {initSizeMe} from "./api/sizeme-api";
import SizeMeApp from "./SizeMeApp.jsx";

initSizeMe(sizeme_options.contextAddress, undefined, sizeme_options.pluginVersion);

let store = createStore(sizeMeReducer);

let section = document.createElement("div");
document.getElementById("product-options-wrapper").appendChild(section);
render(
    <Provider store={store}>
        <SizeMeApp/>
    </Provider>,
    section
);