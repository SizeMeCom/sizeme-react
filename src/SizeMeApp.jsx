import React from "react";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import SizeGuide from "./sizeguide/SizeGuide.jsx";
import SizingBar from "./common/SizingBar.jsx";
import * as api from "./api/sizeme-api";
import Optional from "optional-js";
import {bindActionCreators} from "redux";
import SignupBox from "./common/SignupBox";
import "./SizeMeApp.scss";
import uiOptions from "./api/uiOptions";
import ProfileMenu from "./common/ProfileMenu";
import {trackEvent} from "./api/ga";
import FitTooltip from "./common/FitTooltip";
import LoginFrame from "./common/LoginFrame";
import sizemeIcon from "./images/sizeme_icon.png";
import ReactTooltip from "react-tooltip";
import Loadable from "react-loadable";
import Loading from "./common/Loading";

const SizeForm = Loadable({
    loader: () => import("./common/SizeForm.jsx"),
    loading() {
        return <Loading/>;
    }
});

class SizeMeApp extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loginModalOpen: false
        };
        this.shopType = Optional.ofNullable(uiOptions.shopType).map((s) => `sizeme-${s}`).orElse("");
        this.skinClasses = uiOptions.skinClasses || "";
    }

    userLoggedIn = () => {
        const { resolveAuthToken, getProfiles, setSelectedProfile } = this.props;
        trackEvent("apiLogin", "API: login");
        resolveAuthToken(true)
            .then(() => getProfiles())
            .then(() => setSelectedProfile());
    };

    render () {
        const { resolved, loggedIn,
            profiles, selectedProfile, setSelectedProfile,
            measurementInputs, matchState, onSignup, signupStatus, t
        } = this.props;
        const { match, state } = matchState;

        return (
            <div className={`sizeme-content ${this.shopType} ${this.skinClasses} ${state}`}>
                <div className="sizeme-slider-row">
                    <SizingBar/>
                    {loggedIn && <ProfileMenu profiles={profiles}
                        selectedProfile={selectedProfile.id}
                        setSelectedProfile={setSelectedProfile}/>}
                    {!loggedIn && (<div className="profile-menu-container">
                        <img src={sizemeIcon} alt="SizeMe" data-tip data-for="sizeme-tooltip"
                            ref={el => {this.tooltip = el;}} />
                        <ReactTooltip id="sizeme-tooltip" type="light" place="bottom" effect="solid">
                            <div>{t("common.sizemeTooltip")}</div>
                        </ReactTooltip>
                    </div>)}
                </div>
                {measurementInputs && <SizeForm fields={measurementInputs} />}
                {(!loggedIn || signupStatus.inProgress || signupStatus.signupDone) && match &&
                <SignupBox onSignup={onSignup} signupDone={signupStatus.signupDone}/>}
                {resolved && !uiOptions.disableSizeGuide && <SizeGuide/>}
                <FitTooltip/>
                <LoginFrame id="login-frame" onLogin={this.userLoggedIn}/>
            </div>
        );
    }
}

SizeMeApp.propTypes = {
    resolved: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool,
    signupStatus: PropTypes.object,
    measurementInputs: PropTypes.arrayOf(PropTypes.string),
    profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedProfile: PropTypes.object.isRequired,
    matchState: PropTypes.object,
    setSelectedProfile: PropTypes.func.isRequired,
    resolveAuthToken: PropTypes.func.isRequired,
    getProfiles: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
    t: PropTypes.func
};

const mapStateToProps = state => ({
    resolved: state.authToken.resolved && state.productInfo.resolved,
    loggedIn: state.authToken.loggedIn,
    signupStatus: state.signupStatus,
    measurementInputs: Optional.ofNullable(state.productInfo.product).flatMap(p => Optional.ofNullable(p.model))
        .map(m => m.essentialMeasurements).orElse(null),
    profiles: state.profileList.profiles,
    selectedProfile: state.selectedProfile,
    matchState: state.matchState
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedProfile: api.setSelectedProfile,
    resolveAuthToken: api.resolveAuthToken,
    getProfiles: api.getProfiles,
    onSignup: api.signup
}, dispatch);

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SizeMeApp));
