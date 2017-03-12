import React from "react";
import LoggedIn from "./LoggedIn.jsx";
import LoggedOut from "./LoggedOut.jsx";

class SizeMeSection extends React.Component {

    render() {
        if (this.props.sizeme.isLoggedIn()) {
            return <LoggedIn sizeme={this.props.sizeme}/>;
        } else {
            return <LoggedOut sizeme={this.props.sizeme}/>;
        }
    }

}

export default SizeMeSection;