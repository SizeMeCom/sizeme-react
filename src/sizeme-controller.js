/* global sizeme_options */

//noinspection Eslint
import React from "react";
import {render} from "react-dom";
import SizeMe from "./api/sizeme-api";
import SizeMeSection from "./section/SizeMeSection.jsx";
import SizeGuide from "./sizeguide/SizeGuide.jsx";

let section = document.createElement("div");
let sizeGuide = document.createElement("div");

document.getElementById("sizeme-content").appendChild(sizeGuide);
document.getElementById("sizeme-content").appendChild(section);

const sizeme = new SizeMe(sizeme_options.contextAddress, null, sizeme_options.pluginVersion);

render(<SizeMeSection/>, section);
render(<SizeGuide/>, sizeGuide);


