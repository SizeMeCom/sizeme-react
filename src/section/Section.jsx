import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoggedIn from "./LoggedIn.jsx";
import LoggedOut from "./LoggedOut.jsx";
import { setSelectedProfile } from "../api/sizeme-api";

const SectionElem = ({ loggedIn, profiles, selectedProfile, onSelectProfile }) => {
    if (loggedIn) {
        return <LoggedIn profiles={profiles} selectedProfile={selectedProfile} onSelectProfile={onSelectProfile} />;
    } else {
        return <LoggedOut/>;
    }
};

SectionElem.propTypes = {
    loggedIn: React.PropTypes.bool.isRequired,
    profiles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    selectedProfile: React.PropTypes.object.isRequired,
    onSelectProfile: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        loggedIn: state.authToken.loggedIn,
        profiles: state.profileList.profiles,
        selectedProfile: state.selectedProfile
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onSelectProfile: setSelectedProfile
    }, dispatch);
};

const Section = connect(
    mapStateToProps,
    mapDispatchToProps
)(SectionElem);

export default Section;
