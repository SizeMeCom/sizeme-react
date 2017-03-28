/* global sizeme_product */

import React from "react";
import { trackEvent } from "../api/ga";
import CookieHideWrapper, { hideSizeMe, isSizeMeHidden } from "../common/CookieHideWrapper.jsx";

class LoggedOut extends React.Component {
    
    componentDidMount () {
        // TODO: fix sizeme_product, should be in props etc
        let eventLabel = sizeme_product ? "productPage" : "productPageNonSM";
        if (isSizeMeHidden()) {
            trackEvent(`${eventLabel}NoSM`, "Store: Product page load, SizeMe refused");
        } else {
            trackEvent(`${eventLabel}LoggedOut`, "Store: Product page load, logged out");
        }
    }

    render () {
        return (
            <CookieHideWrapper>
                <div id="sizeme_product_splash">
                    <p>Unsure about the right size? Try <a
                        href="https://sizeme.greitco.com"
                        target="_blank"
                        id="sizeme_product_page_link"
                        title="SizeMe is a free service to help you know how this item will fit _you_"/>
                        <a id="sizeme_btn_no_thanks_product_splash" title="Close" onClick={hideSizeMe}/>
                    </p>
                </div>
            </CookieHideWrapper>
        );
    }
}

export default LoggedOut;
