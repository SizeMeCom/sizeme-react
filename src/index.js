import "babel-polyfill";

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { sizemeStore, sizeSelector } from "./api/sizeme-api";
import SizeMeApp from "./SizeMeApp";
import uiOptions from "./api/uiOptions";

const section = document.createElement("div");
section.setAttribute("class", `sizeme-content-${uiOptions.shopType}`);
document.querySelector(uiOptions.appendContentTo).appendChild(section);

sizeSelector.selector = document.querySelector(uiOptions.invokeElement);

//noinspection RequiredAttributes
render(
    <Provider store={sizemeStore}>
        <SizeMeApp/>
    </Provider>,
    section
);
