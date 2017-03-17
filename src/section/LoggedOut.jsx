/* global sizeme_product */

import React from "react";
import cookie from "react-cookie";
import { trackEvent } from "../api/ga";

const maxAge = 90 * 24 * 60 * 60; // 90 days
const cookieName = "sizeme_no_product_splash";

class LoggedOut extends React.Component {
    constructor (props) {
        super(props);
        let noThanks = cookie.load(cookieName);
        this.state = {
            hidden: noThanks != null
        };
    }

    componentDidMount () {
        // TODO: fix sizeme_product, should be in props etc
        let eventLabel = sizeme_product ? "productPage" : "productPageNonSM";
        if (this.state.hidden) {
            trackEvent(eventLabel + "NoSM", "Store: Product page load, SizeMe refused");
        } else {
            trackEvent(eventLabel + "LoggedOut", "Store: Product page load, logged out");
        }
    };

    hide = () => {
        trackEvent("noThanks", "Store: SizeMe, no thanks");
        cookie.save(cookieName, "true", { path: "/", maxAge: maxAge });
        this.setState({ hidden: true });
    };

    render () {
        if (this.state.hidden) {
            return null;
        } else {
            return (
                <div id="sizeme_product_splash">
                    <p>Unsure about the right size? Try <a
                        href="https://sizeme.greitco.com"
                        target="_blank"
                        id="sizeme_product_page_link"
                        title="SizeMe is a free service to help you know how this item will fit _you_"/>
                        <a id="sizeme_btn_no_thanks_product_splash" title="Close" onClick={this.hide}/>
                    </p>
                </div>
            );
        }
    }
}

export default LoggedOut;
