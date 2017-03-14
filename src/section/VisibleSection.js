import {connect} from "react-redux";
import {login} from "../actions/index";
import Section from "./Section.jsx";

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

const VisibleSection = connect(
    mapStateToProps,
    mapDispatchToProps
)(Section);

export default VisibleSection;