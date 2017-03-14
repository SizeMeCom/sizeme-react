//noinspection Eslint
import React from "react";
import LoggedIn from "./LoggedIn.jsx";
import LoggedOut from "./LoggedOut.jsx";

const Section = ({loggedIn, onLogin}) => {
    if (loggedIn) {
        return <LoggedIn/>;
    } else {
        return <LoggedOut onLogin={onLogin}/>;
    }
};

export default Section;