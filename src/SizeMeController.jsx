/* global sizeme_options */

import React from "react";
import {render} from "react-dom";
import SizeMe from "./api/sizeme-api";
import LoggedIn from "./section/LoggedIn.jsx";
import LoggedOut from "./section/LoggedOut.jsx";
import SizeGuide from "./sizeguide/SizeGuide.jsx";

class SizeMeController extends React.Component {
    constructor (props) {
        super(props);
        this.sizeme = new SizeMe(props.contextAddress, props.trackingId, props.pluginVersion);
        this.state = {
            loggedIn: this.sizeme.isLoggedIn()
        };
    }

    doLogin = () => {
        this.setState({loggedIn:true});
    };

    render() {
        let section = null;
        if (this.state.loggedIn) {
            section = <LoggedIn/>;
        } else {
            section = <LoggedOut doLogin={this.doLogin}/>;
        }
        
        return (
            <div className="sizeme-content">
                <SizeGuide/>
                {section}
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


