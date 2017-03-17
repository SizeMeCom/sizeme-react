/* global sizeme_product */

import React from "react";
import { trackEvent } from "../api/ga";

class LoggedIn extends React.Component {

    componentDidMount () {
        // TODO: fix sizeme_product, should be in props etc
        let eventLabel = sizeme_product ? "productPage" : "productPageNonSM";
        trackEvent(eventLabel + "LoggedIn", "Store: Product page load, logged in");
    };

    render () {
        return <div>Logged in content</div>;
    }
}

export default LoggedIn;
