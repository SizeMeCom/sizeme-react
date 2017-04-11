import React, { PropTypes } from "react";
import { connect } from "react-redux";
import SizeGuide from "./sizeguide/SizeGuide.jsx";
import SizeSlider from "./common/SizeSlider.jsx";
import SizeForm from "./common/SizeForm.jsx";
import * as actions from "./api/sizeme-api";
import FontAwesome from "react-fontawesome";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { hideMenu } from "react-contextmenu/modules/actions";
import i18n from "./api/i18n";
import Optional from "optional-js";
import ProfileSelect from "./common/ProfileSelect.jsx";
import { bindActionCreators } from "redux";
import LoginFrame, { openLoginFrame } from "./common/LoginFrame.jsx";

class SizeMeApp extends React.Component {
    constructor (props) {
        super(props);
        this.menuTrigger = null;
        this.state = {
            loginModalOpen: false
        };
    }

    componentDidMount () {
        const { resolveAuthToken, getProfiles, getProduct, setSelectedProfile } = this.props;
        Promise.all([
            resolveAuthToken().then(() => getProfiles()),
            getProduct()
        ]).then(() => setSelectedProfile());
    }

    toggleMenu = (e) => {
        if (this.menuTrigger) {
            this.menuTrigger.handleContextClick(e);
        }
    };

    selectProfile = profileId => {
        hideMenu();
        this.props.setSelectedProfile(profileId);
    };

    userLoggedIn = () => {
        const { resolveAuthToken, getProfiles, setSelectedProfile } = this.props;
        resolveAuthToken(true)
            .then(() => getProfiles())
            .then(() => setSelectedProfile());
    };

    render () {
        if (this.props.resolved) {
            return (
                <div className="sizeme-content">
                    <div className="sizeme-slider-row">                        
                        <SizeSlider match={this.props.currentMatch} />
                        <ContextMenuTrigger id="sizeme-menu" ref={c => { this.menuTrigger = c; }}>
                            <FontAwesome name="cog" onClick={this.toggleMenu}/>
                        </ContextMenuTrigger>
                        <ContextMenu id="sizeme-menu" className="sizeme-context-menu">
                            {this.props.loggedIn ?
                                <div className="menu-profile-select">
                                    <span>Select profile</span>
                                    <ProfileSelect onSelectProfile={this.selectProfile}
                                                   selectedProfile={this.props.selectedProfile.id}
                                                   profiles={this.props.profiles}
                                    />
                                </div> :
                                <MenuItem onClick={() => openLoginFrame("menu-login")}>{i18n.MENU.login}</MenuItem>
                            }
                            <LoginFrame id="menu-login" userLoggedIn={this.userLoggedIn}/>
                        </ContextMenu>
                    </div>
                    {this.props.measurementInputs && <SizeForm fields={this.props.measurementInputs} max={3} />}
                    {this.props.resolved && <SizeGuide/>}
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
    dispatch: PropTypes.func.isRequired,
    currentMatch: PropTypes.object,
    measurementInputs: PropTypes.arrayOf(PropTypes.string),
    profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedProfile: PropTypes.object.isRequired,
    setSelectedProfile: PropTypes.func.isRequired,
    resolveAuthToken: PropTypes.func.isRequired,
    getProfiles: PropTypes.func.isRequired,
    getProduct: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    resolved: state.authToken.resolved && state.productInfo.resolved,
    loggedIn: state.authToken.loggedIn,
    currentMatch: (state.selectedSize && state.match.matchResult) ? state.match.matchResult[state.selectedSize] : null,
    measurementInputs: Optional.ofNullable(state.productInfo.product).flatMap(p => Optional.ofNullable(p.model))
        .map(m => m.measurementOrder).orElse(null),
    profiles: state.profileList.profiles,
    selectedProfile: state.selectedProfile
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            setSelectedProfile: actions.setSelectedProfile,
            resolveAuthToken: actions.resolveAuthToken,
            getProfiles: actions.getProfiles,
            getProduct: actions.getProduct
        }, dispatch),
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(SizeMeApp);
