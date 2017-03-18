/* global sizeme_product */

import React from "react";
import { trackEvent } from "../api/ga";

class LoggedIn extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        // TODO: fix sizeme_product, should be in props etc
        let eventLabel = sizeme_product ? "productPage" : "productPageNonSM";
        trackEvent(`${eventLabel}LoggedIn`, "Store: Product page load, logged in");
    }

    handleChange = (event) => {
        this.props.onSelectProfile(event.target.value);
    };

    render () {
        return (
            <div>
                <select value={this.props.selectedProfile.id} onChange={this.handleChange}>
                    {this.props.profiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>{profile.profileName}</option>
                    ))}
                </select>
            </div>
        );
    }
}

LoggedIn.propTypes = {
    profiles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    selectedProfile: React.PropTypes.object.isRequired,
    onSelectProfile: React.PropTypes.func.isRequired
};

export default LoggedIn;
