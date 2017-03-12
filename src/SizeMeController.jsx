/* global sizeme_options */

import React from "react";
import {render} from "react-dom";
import SizeMe from "./api/sizeme-api";
import SizeMeSection from "./section/SizeMeSection.jsx";
import SizeGuide from "./sizeguide/SizeGuide.jsx";

class SizeMeController extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            sizeme: new SizeMe(props.contextAddress, props.trackingId, props.pluginVersion)
        };
    }

    render() {
        return (
            <div className="sizeme-content">
                <SizeGuide sizeme={this.state.sizeme}/>
                <SizeMeSection sizeme={this.state.sizeme}/>
            </div>
        );
    }
}

let section = document.createElement("div");
document.getElementById("product-options-wrapper").appendChild(section);
render(
    <SizeMeController
        contextAddress={sizeme_options.contextAddress}
        pluginVersion={sizeme_options.pluginVersion}
    />,
    section);


