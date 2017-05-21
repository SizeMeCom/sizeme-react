import "babel-polyfill";

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { sizemeStore } from "./api/sizeme-api";
import SizeMeApp from "./SizeMeApp";
import uiOptions from "./api/uiOptions";
import SizeSelector from "./api/SizeSelector";
import { selectSize } from "./api/actions";
import "./scss/index.scss";

const section = document.createElement("div");
section.setAttribute("class", `sizeme-content-${uiOptions.shopType}`);
document.querySelector(uiOptions.appendContentTo).appendChild(section);

//noinspection RequiredAttributes
render(
    <Provider store={sizemeStore}>
        <SizeMeApp/>
    </Provider>,
    section,
    () => SizeSelector.initSizeSelector(size => sizemeStore.dispatch(selectSize(size)))
);
