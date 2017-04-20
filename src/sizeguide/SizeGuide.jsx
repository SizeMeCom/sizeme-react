import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import SizeGuideItem from "./SizeGuideItem.jsx";
import SizeGuideDetails from "./SizeGuideDetails.jsx";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSelectedProfile, contextAddress } from "../api/sizeme-api";
import SizeGuideProductInfo from "./SizeGuideProductInfo.jsx";
import i18n from "../api/i18n";
import FitTooltip from "./FitTooltip.jsx";
import ReactTooltip from "react-tooltip";

class SizeGuide extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            guideIsOpen: false,
            highlight: "",
            tooltips: Object.assign(...this.props.product.model.measurementOrder.map(m => ({ [m]: {} })))
        };
    }

    onHover = (measurement) => {
        if (!measurement) {
            this.removeTimeout = setTimeout(() => {
                this.setState({ highlight: measurement });
            }, 100);
        } else {
            this.setState({ highlight: measurement });
            if (this.removeTimeout) {
                clearTimeout(this.removeTimeout);
            }
        }
    };

    updateTooltip = (measurement, tooltip) => {
        this.setState({
            tooltips: Object.assign(this.state.tooltips, {
                [measurement]: tooltip
            })
        });
    };


    openGuide = () => {
        this.setState({ guideIsOpen: true });
    };

    closeGuide = () => {
        this.setState({ guideIsOpen: false }, () => {
            ReactTooltip.rebuild();
        });
    };

    render () {
        const selectedMatchResult = this.props.matchResult ? this.props.matchResult[this.props.selectedSize] : null;
        const matchMap = selectedMatchResult ? new Map(Object.entries(selectedMatchResult.matchMap)) : new Map();
        const measurements = new Map(Object.entries(this.props.product.item.measurements));
        const button = this.props.loggedIn ? i18n.DETAILED.button_text : i18n.SIZE_GUIDE.button_text;

        const detailSection = () => {
            if (this.props.loggedIn) {
                return (
                    <SizeGuideDetails onSelectProfile={this.props.onSelectProfile}
                                      selectedProfile={this.props.selectedProfile ?
                                          this.props.selectedProfile.id : ""}
                                      profiles={this.props.profiles}
                                      selectedSize={this.props.selectedSize}
                                      measurementOrder={this.props.product.model.measurementOrder}
                                      onHover={this.onHover}
                                      matchResult={this.props.matchResult}
                                      product={this.props.product}
                                      updateTooltip={this.updateTooltip}
                    />
                );
            } else {
                return (
                    <SizeGuideProductInfo measurements={this.props.product.item.measurements}
                                          measurementOrder={this.props.product.model.measurementOrder}
                                          onHover={this.onHover}
                                          getItemTypeComponent={this.props.product.model.getItemTypeComponent}
                    />
                );
            }
        };

        return (
            <div>
                <a className="link-btn size-guide"
                   onClick={this.openGuide}>{button} <FontAwesome name="caret-right"/></a>
                {this.state.guideIsOpen &&
                <Modal
                    isOpen={this.state.guideIsOpen}
                    onRequestClose={this.closeGuide}
                    contentLabel="Size Guide"
                    className="size-guide-modal"
                    overlayClassName="size-guide-overlay"
                >
                    <div className="modal-wrapper">
                        <div className="modal-header">
                            <span className="size-guide-title">
                                {this.props.loggedIn ? i18n.DETAILED.window_title : i18n.SIZE_GUIDE.window_title} <span
                                className="item-name">{this.props.product.name}</span>
                            </span>
                            <a className="size-guide-close" role="button" onClick={this.closeGuide}>
                                <FontAwesome name="times" title={i18n.COMMON.close_text}/>
                            </a>
                        </div>

                        <div className="modal-body">
                            <div className="size-guide-content">
                                <SizeGuideItem measurements={measurements} selectedSize={this.props.selectedSize}
                                               highlight={this.state.highlight} matchMap={matchMap}
                                               selectedProfile={this.props.selectedProfile}
                                               model={this.props.product.model} isGuide={!this.props.loggedIn}
                                />
                                {detailSection()}
                            </div>
                        </div>

                        <div className="modal-footer">
                            {!this.props.loggedIn &&
                            <span className="sizeme-advertisement">
                                {i18n.SIZE_GUIDE.advertisement}
                                <a id="sizeme_ad_link" href={contextAddress} target="_blank"/>
                            </span>
                            }
                        </div>
                    </div>
                </Modal>}
                {this.props.product.model.measurementOrder.map(measurement => {
                    return (<FitTooltip measurement={measurement} key={measurement}
                                        fitData={this.state.tooltips[measurement]}/>);
                })}
            </div>
        );
    }
}

SizeGuide.propTypes = {
    product: PropTypes.object.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.object),
    selectedProfile: PropTypes.object,
    selectedSize: PropTypes.string,
    onSelectProfile: PropTypes.func.isRequired,
    matchResult: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    product: state.productInfo.product,
    profiles: state.profileList.profiles,
    selectedProfile: state.selectedProfile,
    selectedSize: state.selectedSize,
    matchResult: state.match.matchResult,
    loggedIn: state.authToken.loggedIn
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onSelectProfile: setSelectedProfile
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeGuide);
