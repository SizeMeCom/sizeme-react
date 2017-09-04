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
        const { resolveAuthToken, getProfiles, getProduct, setSelectedProfile } = this.props;
        Promise.all([
            resolveAuthToken().then(resolved => getProfiles().then(() => resolved)),
            getProduct()
        ]).then(([tokenResolved, productResolved]) => {
            if (tokenResolved && productResolved) {
                trackEvent("productPageLoggedIn", "Store: Product page load, SM product, logged in");
            } else if (tokenResolved && !productResolved) {
                trackEvent("productPageNonSMLoggedIn", "Store: Product page load, Non-SM product, logged in");
            } else if (!tokenResolved && productResolved) {
                trackEvent("productPageLoggedOut", "Store: Product page load, SM product, logged out");
            } else {
                trackEvent("productPageNonSMLoggedOut", "Store: Product page load, Non-SM product, logged out");
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
            matchResult, selectedSize,
            profiles, selectedProfile, setSelectedProfile,
            measurementInputs,
            onSignup,
            product
        } = this.props;

        let currentMatch = null;
        let matchState = "match";
        const currentSize = selectedSize.size;
        if (matchResult && currentSize) {
            const match = matchResult[currentSize];
            if (match.accuracy > 0) {
                currentMatch = match;
            } else {
                matchState = "no-fit";
            }
        } else if (matchResult) {
            if (Object.values(matchResult).some(match => match && match.accuracy > 0)) {
                matchState = "no-size";
            } else {
                matchState = "no-fit";
            }
        } else {
            matchState = "no-fit";
        }


        if (resolved) {
            return (
                <div className={`sizeme-content ${this.shopType} ${this.skinClasses} ${matchState}`}>
                    <div className="sizeme-slider-row">                        
                        <SizingBar match={currentMatch} fitRecommendation={product.item.fitRecommendation || 0}
                                   selectedSize={selectedSize} matchState={matchState}/>
                        {loggedIn && <ProfileMenu profiles={profiles}
                                                             selectedProfile={selectedProfile.id}
                                                             setSelectedProfile={setSelectedProfile}/>}
                    </div>
                    {measurementInputs && <SizeForm fields={measurementInputs} />}
                    {!loggedIn && currentMatch && <SignupBox onSignup={onSignup}/>}
                    {resolved && !uiOptions.disableSizeGuide && <SizeGuide/>}
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
    selectedSize: PropTypes.object,
    matchResult: PropTypes.object,
    measurementInputs: PropTypes.arrayOf(PropTypes.string),
    profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedProfile: PropTypes.object.isRequired,
    setSelectedProfile: PropTypes.func.isRequired,
    resolveAuthToken: PropTypes.func.isRequired,
    getProfiles: PropTypes.func.isRequired,
    getProduct: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
    product: PropTypes.object
};

const mapStateToProps = state => ({
    resolved: state.authToken.resolved && state.productInfo.resolved,
    selectedSize: state.selectedSize,
    matchResult: state.match.matchResult,
    loggedIn: state.authToken.loggedIn,
    measurementInputs: Optional.ofNullable(state.productInfo.product).flatMap(p => Optional.ofNullable(p.model))
        .map(m => m.essentialMeasurements).orElse(null),
    profiles: state.profileList.profiles,
    selectedProfile: state.selectedProfile,
    product: state.productInfo.product
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedProfile: api.setSelectedProfile,
    resolveAuthToken: api.resolveAuthToken,
    getProfiles: api.getProfiles,
    getProduct: api.getProduct,
    onSignup: api.signup
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SizeMeApp);
