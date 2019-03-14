import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import SizeGuide from "./sizeguide/SizeGuide.jsx";
import SizingBar from "./common/SizingBar.jsx";
import SizeForm from "./common/SizeForm.jsx";
import * as api from "./api/sizeme-api";
import Optional from "optional-js";
import { bindActionCreators } from "redux";
import SignupBox from "./common/SignupBox";
import "./SizeMeApp.scss";
import uiOptions from "./api/uiOptions";
import ProfileMenu from "./common/ProfileMenu";
import { trackEvent } from "./api/ga";
import FitTooltip from "./common/FitTooltip";
import LoginFrame from "./common/LoginFrame";
import sizemeIcon from "./images/sizeme_icon.png";
import ReactTooltip from "react-tooltip";

class SizeMeTogglerComp extends React.Component {

    toggle = () => {
        const { sizemeHidden, setSizemeHidden } = this.props;
        setSizemeHidden(!sizemeHidden);
    };

    render () {
        const { t, sizemeHidden } = this.props;
        return (
            <div className={`sizeme-toggler ${sizemeHidden ? "sm-hidden" : "sm-visible"}`}>
                <a onClick={this.toggle}>{t("common.togglerText")} <i className="fa" aria-hidden/></a>
            </div>
        );
    }
}

const SizemeToggler = translate()(SizeMeTogglerComp);

SizeMeTogglerComp.propTypes = SizemeToggler.propTypes = {
    sizemeHidden: PropTypes.bool.isRequired,
    setSizemeHidden: PropTypes.func.isRequired
};


class SizeMeApp extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loginModalOpen: false
        };
        this.shopType = Optional.ofNullable(uiOptions.shopType).map((s) => `sizeme-${s}`).orElse("");
        this.skinClasses = uiOptions.skinClasses || "";
    }

    componentDidMount () {
        const { resolveAuthToken, getProfiles, getProduct, setSelectedProfile, sizemeHidden } = this.props;
        Promise.all([
            resolveAuthToken().then(resolved => getProfiles().then(() => resolved)),
            getProduct()
        ]).then(([tokenResolved, productResolved]) => {
            const pageEvent = productResolved ? ["", "SM product"] : ["NonSM", "Non-SM product"];
            const logInStatus = tokenResolved ? ["LoggedIn", "logged in"] : ["LoggedOut", "logged out"];
            const hidden = sizemeHidden ? ["Hidden", ", SM hidden"] : ["", ""];

            trackEvent(`productPage${pageEvent[0]}${logInStatus[0]}${hidden[0]}`,
                `Store: Product page load, ${pageEvent[1]}, ${logInStatus[1]}${hidden[1]}`);
            setSelectedProfile();
        });
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
            measurementInputs, matchState, onSignup, sizemeHidden,
            setSizemeHidden, signupStatus, t
        } = this.props;
        const { match, state } = matchState;

        if (resolved) {
            return (
                <>
                    {uiOptions.toggler && <SizemeToggler
                        sizemeHidden={sizemeHidden} setSizemeHidden={setSizemeHidden}/>}
                    {!sizemeHidden && <div className={`sizeme-content ${this.shopType} ${this.skinClasses} ${state}`}>
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
                    </div>}
                </>
            );
        } else {
            return null;
        }
    }
}

SizeMeApp.propTypes = {
    resolved: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool,
    signupStatus: PropTypes.object,
    measurementInputs: PropTypes.arrayOf(PropTypes.string),
    profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedProfile: PropTypes.object.isRequired,
    setSelectedProfile: PropTypes.func.isRequired,
    resolveAuthToken: PropTypes.func.isRequired,
    getProfiles: PropTypes.func.isRequired,
    getProduct: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
    product: PropTypes.object,
    matchState: PropTypes.object,
    sizemeHidden: PropTypes.bool.isRequired,
    setSizemeHidden: PropTypes.func.isRequired,
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
    product: state.productInfo.product,
    matchState: state.matchState,
    sizemeHidden: state.sizemeHidden
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedProfile: api.setSelectedProfile,
    resolveAuthToken: api.resolveAuthToken,
    getProfiles: api.getProfiles,
    getProduct: api.getProduct,
    onSignup: api.signup,
    setSizemeHidden: api.setSizemeHidden
}, dispatch);

export default translate()(connect(mapStateToProps, mapDispatchToProps)(SizeMeApp));
