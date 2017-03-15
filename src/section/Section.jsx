import React from "react";
import { connect } from "react-redux";
import { login } from "../actions/index";
import LoggedIn from "./LoggedIn.jsx";
import LoggedOut from "./LoggedOut.jsx";

const SectionElem = ({ loggedIn, onLogin }) => {
    if (loggedIn) {
        return <LoggedIn/>;
    } else {
        return <LoggedOut onLogin={onLogin}/>;
    }
};

SectionElem.propTypes = {
    loggedIn: React.PropTypes.bool.isRequired,
    onLogin: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        loggedIn: state.loggedIn
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: () => {
            dispatch(login());
        }
    };
};

const Section = connect(
    mapStateToProps,
    mapDispatchToProps
)(SectionElem);

export default Section;
