import React from "react";
import PropTypes from "prop-types";
import cookie from "react-cookie";
import { trackEvent } from "../api/ga";

const maxAge = 90 * 24 * 60 * 60; // 90 days
const cookieName = "sizeme_no_product_splash";
const listeners = [];

export const hideSizeMe = () => {
    trackEvent("noThanks", "Store: SizeMe, no thanks");
    cookie.save(cookieName, "true", { path: "/", maxAge: maxAge });
    for (const wrapper of listeners) {
        wrapper.hide();
    }
};

export const isSizeMeHidden = () => !!(cookie.load(cookieName));

class CookieHideWrapper extends React.Component {
    constructor (props) {
        super(props);
        let noThanks = isSizeMeHidden();
        this.state = {
            hidden: noThanks
        };
        listeners.push(this);
    }

    componentWillUnmount () {
        const idx = listeners.indexOf(this);
        if (idx >= 0) {
            listeners.splice(idx, 1);
        }
    }

    hide = () => {
        this.setState({ hidden: true });
    };

    render () {
        if (this.state.hidden) {
            return null;
        } else {
            return (
                <div>
                    {this.props.children}
                </div>
            );
        } 
    }
}

CookieHideWrapper.propTypes = {
    children: PropTypes.node
};

export default CookieHideWrapper;

