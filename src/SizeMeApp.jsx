import React from "react";
import PropTypes from "prop-types";
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
            measurementInputs, matchState, onSignup, sizemeHidden
        } = this.props;
        const { match, state } = matchState;

        if (resolved && !sizemeHidden) {
            return (
                <div className={`sizeme-content ${this.shopType} ${this.skinClasses} ${state}`}>
                    <div className="sizeme-slider-row">                        
                        <SizingBar/>
                        {loggedIn && <ProfileMenu profiles={profiles}
                                                             selectedProfile={selectedProfile.id}
                                                             setSelectedProfile={setSelectedProfile}/>}
                    </div>
                    {measurementInputs && <SizeForm fields={measurementInputs} />}
                    {!loggedIn && match && <SignupBox onSignup={onSignup}/>}
                    {resolved && !uiOptions.disableSizeGuide && <SizeGuide/>}
                    <FitTooltip/>
                    <LoginFrame id="login-frame" onLogin={this.userLoggedIn}/>
                </div>
            );
        } else {
            return null;
        }
    }
}

SizeMeApp.propTypes = {
    resolved: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool,
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
    sizemeHidden: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    resolved: state.authToken.resolved && state.productInfo.resolved,
    loggedIn: state.authToken.loggedIn,
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
    onSignup: api.signup
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SizeMeApp);
