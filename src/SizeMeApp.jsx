import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SizeGuide from "./sizeguide/SizeGuide.jsx";
import SizeSlider from "./common/SizeSlider.jsx";
import SizeForm from "./common/SizeForm.jsx";
import * as api from "./api/sizeme-api";
import Optional from "optional-js";
import { bindActionCreators } from "redux";
import SignupBox from "./common/SignupBox";
import "./SizeMeApp.scss";
import uiOptions from "./api/uiOptions";
import ProfileMenu from "./common/ProfileMenu";
import { trackEvent } from "./api/ga";
import FitTooltip2 from "./common/FitTooltip";

class SizeMeApp extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loginModalOpen: false
        };
    }

    componentDidMount () {
        const { resolveAuthToken, getProfiles, getProduct, setSelectedProfile } = this.props;
        Promise.all([
            resolveAuthToken().then(resolved => getProfiles().then(() => resolved)),
            getProduct()
        ]).then(([tokenResolved, productResolved]) => {
            if (tokenResolved && productResolved) {
                trackEvent("productPageLoggedIn", "Store: Product page load, logged in");
            } else if (tokenResolved && !productResolved) {
                trackEvent("productPageNonSMLoggedIn", "Store: Product page load, logged in");
            } else if (!tokenResolved && productResolved) {
                trackEvent("productPageLoggedOut", "Store: Product page load, logged out");
            } else {
                trackEvent("productPageNonSMLoggedOut", "Store: Product page load, logged out");
            }
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
            currentMatch, recommendedMatch,
            profiles, selectedProfile, setSelectedProfile,
            measurementInputs,
            onSignup, signupStatus
        } = this.props;

        if (resolved) {
            return (
                <div className={`${currentMatch ? "" : "no-fit"} sizeme-content`}>
                    <div className="sizeme-slider-row">                        
                        <SizeSlider match={currentMatch} recommendedMatch={recommendedMatch}/>
                        {loggedIn && <ProfileMenu profiles={profiles}
                                                             selectedProfile={selectedProfile.id}
                                                             setSelectedProfile={setSelectedProfile}/>}
                    </div>
                    {measurementInputs && <SizeForm fields={measurementInputs} />}
                    {!loggedIn && currentMatch && <SignupBox onLogin={this.userLoggedIn}
                                                        onSignup={onSignup}
                                                        signupStatus={signupStatus}/>}
                    {resolved && !uiOptions.disableSizeGuide && <SizeGuide/>}
                    <FitTooltip2/>
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
    currentMatch: PropTypes.object,
    recommendedMatch: PropTypes.object,
    measurementInputs: PropTypes.arrayOf(PropTypes.string),
    profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedProfile: PropTypes.object.isRequired,
    setSelectedProfile: PropTypes.func.isRequired,
    resolveAuthToken: PropTypes.func.isRequired,
    getProfiles: PropTypes.func.isRequired,
    getProduct: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
    signupStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    resolved: state.authToken.resolved && state.productInfo.resolved,
    loggedIn: state.authToken.loggedIn,
    sizemeProductPage: state.productInfo.product !== null,
    currentMatch: (state.selectedSize && state.match.matchResult) ? state.match.matchResult[state.selectedSize] : null,
    recommendedMatch: Optional.ofNullable(state.match.matchResult)
        .map(res => res.recommendedFit ? res[res.recommendedFit] : null).orElse(null),
    measurementInputs: Optional.ofNullable(state.productInfo.product).flatMap(p => Optional.ofNullable(p.model))
        .map(m => m.essentialMeasurements).orElse(null),
    profiles: state.profileList.profiles,
    selectedProfile: state.selectedProfile,
    signupStatus: state.signupStatus
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedProfile: api.setSelectedProfile,
    resolveAuthToken: api.resolveAuthToken,
    getProfiles: api.getProfiles,
    getProduct: api.getProduct,
    onSignup: api.signup
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SizeMeApp);
