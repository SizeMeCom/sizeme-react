/* global sizeme_options */
import "babel-polyfill";

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { sizemeStore, sizeSelector } from "./api/sizeme-api";
import SizeMeApp from "./SizeMeApp.jsx";
import * as uiOpts from "./api/uiOptions";

const uiOptions = uiOpts[sizeme_options.shopType];

const section = document.createElement("div");
section.setAttribute("class", `sizeme-content-${sizeme_options.shopType}`);
document.querySelector(uiOptions.appendContentTo).appendChild(section);

sizeSelector.selector = document.querySelector(uiOptions.invokeElement);

render(
    <Provider store={sizemeStore}>
        <SizeMeApp/>
    </Provider>,
    section
);
