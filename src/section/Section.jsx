import React from "react";
import { connect } from "react-redux";
import LoggedIn from "./LoggedIn.jsx";
import LoggedOut from "./LoggedOut.jsx";

const SectionElem = ({ loggedIn }) => {
    if (loggedIn) {
        return <LoggedIn/>;
    } else {
        return <LoggedOut/>;
    }
};

SectionElem.propTypes = {
    loggedIn: React.PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        loggedIn: state.authToken.loggedIn
    };
};

const Section = connect(
    mapStateToProps
)(SectionElem);

export default Section;
