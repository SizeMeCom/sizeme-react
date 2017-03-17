import "babel-polyfill";

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { sizemeStore } from "./api/sizeme-api";
import SizeMeApp from "./SizeMeApp.jsx";

let section = document.createElement("div");
document.getElementById("product-options-wrapper").appendChild(section);
render(
    <Provider store={sizemeStore}>
        <SizeMeApp/>
    </Provider>,
    section
);
