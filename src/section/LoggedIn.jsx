/* global sizeme_product */

import React from "react";
import PropTypes from "prop-types";
import { trackEvent } from "../api/ga";
import ProfileSelect from "../common/ProfileSelect.jsx";

class LoggedIn extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        // TODO: fix sizeme_product, should be in props etc
        let eventLabel = sizeme_product ? "productPage" : "productPageNonSM";
        trackEvent(`${eventLabel}LoggedIn`, "Store: Product page load, logged in");
    }

    render () {
        return (
            <div className="logged-in-content">
                <ProfileSelect onSelectProfile={this.props.onSelectProfile}
                               selectedProfile={this.props.selectedProfile.id}
                               profiles={this.props.profiles}
                />
            </div>
        );
    }
}

LoggedIn.propTypes = {
    profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedProfile: PropTypes.object.isRequired,
    onSelectProfile: PropTypes.func.isRequired
};

export default LoggedIn;
