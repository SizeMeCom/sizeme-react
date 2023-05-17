import Optional from "optional-js";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { bindActionCreators } from "redux";
import "./SizeMeApp.scss";
import * as api from "./api/sizeme-api";
import uiOptions from "./api/uiOptions";
import FitTooltip from "./common/FitTooltip";
import Loading from "./common/Loading";
import LoginFrame from "./common/LoginFrame";
import ProfileMenu from "./common/ProfileMenu";
import SignupBox from "./common/SignupBox";
import SizingBar from "./common/SizingBar.jsx";
import sizemeIcon from "./images/sizeme_icon.png";
import SizeGuide from "./sizeguide/SizeGuide.jsx";

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
            loginModalOpen: false,
            unit: localStorage.getItem("sizemeMeasurementUnit") ? parseInt(localStorage.getItem("sizemeMeasurementUnit")) : uiOptions.measurementUnit
        };
        this.shopType = Optional.ofNullable(uiOptions.shopType).map((s) => `sizeme-${s}`).orElse("");
        this.skinClasses = uiOptions.skinClasses || "";
        this.inchFractionsPrecision = 8;
        this.measurementUnitChoiceDisallowed = uiOptions.measurementUnitChoiceDisallowed ? uiOptions.measurementUnitChoiceDisallowed : 0;
    }

    userLoggedIn = () => {
        const { resolveAuthToken, getProfiles, setSelectedProfile } = this.props;
        resolveAuthToken(true)
            .then(() => getProfiles())
            .then(() => setSelectedProfile());
    };

    componentDidMount () {
        document.body.classList.add("sizeme-active");
    }

    componentWillUnmount () {
        document.body.classList.remove("sizeme-active");
    }

    chooseUnit = (chosenUnit) => {
        localStorage.setItem("sizemeMeasurementUnit", parseInt(chosenUnit));
        this.setState({ unit: parseInt(chosenUnit)});
    }

    render () {
        const { resolved, loggedIn,
            profiles, selectedProfile, setSelectedProfile,
            measurementInputs, matchState, productInfo, onSignup, signupStatus, t
        } = this.props;
        const { match, state } = matchState;
        let itemTypeClass = "sizeme-item-"+productInfo.product.item.itemType.replace(/\./g,"_");

        return (
            <div className={`sizeme-content ${this.shopType} ${this.skinClasses} ${state} ${itemTypeClass}`}>
                <div className="sizeme-slider-row">
                    <SizingBar/>
                    {loggedIn && <ProfileMenu profiles={profiles}
                        selectedProfile={selectedProfile.id}
                        setSelectedProfile={setSelectedProfile}/>}
                    {(!loggedIn || signupStatus.inProgress || signupStatus.signupDone) && match &&
                    <SignupBox onSignup={onSignup} signupDone={signupStatus.signupDone}/>}
                    {!loggedIn && !match && (<div className="profile-menu-container">
                        <img src={sizemeIcon} alt="SizeMe" data-tip data-for="sizeme-tooltip"
                            ref={el => {this.tooltip = el;}} />
                        <ReactTooltip id="sizeme-tooltip" type="light" place="bottom" effect="solid">
                            <div>{t("common.sizemeTooltip")}</div>
                        </ReactTooltip>
                    </div>)}
                </div>
                {measurementInputs && <SizeForm fields={measurementInputs} unit={this.state.unit} chooseUnit={this.chooseUnit} 
                inchFractionsPrecision={this.inchFractionsPrecision} unitChoiceDisallowed={this.measurementUnitChoiceDisallowed} />}
                {resolved && !uiOptions.disableSizeGuide && <SizeGuide unit={this.state.unit} chooseUnit={this.chooseUnit} 
                inchFractionsPrecision={this.inchFractionsPrecision} unitChoiceDisallowed={this.measurementUnitChoiceDisallowed}/>}
                <FitTooltip unit={this.state.unit} inchFractionsPrecision={this.inchFractionsPrecision}/>
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
    productInfo: PropTypes.object,
    setSelectedProfile: PropTypes.func.isRequired,
    resolveAuthToken: PropTypes.func.isRequired,
    getProfiles: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
    t: PropTypes.func,
    chooseUnit: PropTypes.func,
    unit: PropTypes.number,
    inchFractionsPrecision: PropTypes.number
};

const mapStateToProps = state => ({
    resolved: state.authToken.resolved && state.productInfo.resolved,
    loggedIn: state.authToken.loggedIn,
    signupStatus: state.signupStatus,
    measurementInputs: Optional.ofNullable(state.productInfo.product).flatMap(p => Optional.ofNullable(p.model))
        .map(m => m.essentialMeasurements).orElse(null),
    profiles: state.profileList.profiles,
    selectedProfile: state.selectedProfile,
    matchState: state.matchState,
    productInfo: state.productInfo
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedProfile: api.setSelectedProfile,
    resolveAuthToken: api.resolveAuthToken,
    getProfiles: api.getProfiles,
    onSignup: api.signup
}, dispatch);

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SizeMeApp));
