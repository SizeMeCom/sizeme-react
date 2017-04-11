import React from "react";
import { connect } from "react-redux";
import SizeGuide from "./sizeguide/SizeGuide.jsx";
import SizeSlider from "./common/SizeSlider.jsx";
import SizeForm from "./common/SizeForm.jsx";
import { resolveAuthToken, getProfiles, getProduct, setSelectedProfile } from "./api/sizeme-api";
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
        const { dispatch } = this.props;
        Promise.all([
            dispatch(resolveAuthToken()).then(() => dispatch(getProfiles())),
            dispatch(getProduct())
        ]).then(() => dispatch(setSelectedProfile()));
    }

    toggleMenu = (e) => {
        if (this.menuTrigger) {
            this.menuTrigger.handleContextClick(e);
        }
    };

    selectProfile = profileId => {
        hideMenu();
        this.props.onSelectProfile(profileId);
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
                            <LoginFrame id="menu-login"/>
                        </ContextMenu>
                    </div>
                    {this.props.measurementInputs && <SizeForm fields={this.props.measurementInputs} max={3} />}
                    <SizeGuide/>
                </div>
            );
        } else {
            return null;
        }
    }
}

SizeMeApp.propTypes = {
    resolved: React.PropTypes.bool.isRequired,
    loggedIn: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired,
    currentMatch: React.PropTypes.object,
    measurementInputs: React.PropTypes.arrayOf(React.PropTypes.string),
    profiles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    selectedProfile: React.PropTypes.object.isRequired,
    onSelectProfile: React.PropTypes.func.isRequired
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
            onSelectProfile: setSelectedProfile
        }, dispatch),
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(SizeMeApp);
