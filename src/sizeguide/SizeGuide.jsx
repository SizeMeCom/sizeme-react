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
import FitTooltip from "../common/FitTooltip.jsx";
import ReactTooltip from "react-tooltip";
import { trackEvent } from "../api/ga";
import { translate } from "react-i18next";
import "./SizeGuide.scss";

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
        this.setState({ guideIsOpen: true }, () => {
            if (this.props.loggedIn) {
                trackEvent("detailedViewOpened", "Store: Detailed view opened");
            } else {
                trackEvent("sizeGuideOpened", "Store: Size guide opened");
            }
        });
    };

    closeGuide = () => {
        this.setState({ guideIsOpen: false }, () => {
            ReactTooltip.rebuild();
        });
    };

    render () {
        const {
            t, onSelectProfile, selectedProfile, profiles, selectedSize, product, matchResult, loggedIn
        } = this.props;
        const { guideIsOpen, highlight, tooltips } = this.state;
        const selectedMatchResult = matchResult ? matchResult[selectedSize] : null;
        const matchMap = selectedMatchResult ? new Map(Object.entries(selectedMatchResult.matchMap)) : new Map();
        const measurements = new Map(Object.entries(product.item.measurements));
        const button = loggedIn ? t("detailed.buttonText") : t("sizeGuide.buttonText");

        const detailSection = () => {
            if (loggedIn) {
                return (
                    <SizeGuideDetails onSelectProfile={onSelectProfile}
                                      selectedProfile={selectedProfile ? selectedProfile.id : ""}
                                      profiles={profiles}
                                      selectedSize={selectedSize}
                                      measurementOrder={product.model.measurementOrder}
                                      onHover={this.onHover}
                                      matchResult={matchResult}
                                      product={product}
                                      updateTooltip={this.updateTooltip}
                    />
                );
            } else {
                return (
                    <SizeGuideProductInfo measurements={product.item.measurements}
                                          measurementOrder={product.model.measurementOrder}
                                          onHover={this.onHover}
                                          getItemTypeComponent={product.model.getItemTypeComponent}
                    />
                );
            }
        };

        return (
            <div>
                <a className="link-btn size-guide"
                   onClick={this.openGuide}>{button} <FontAwesome name="caret-right"/></a>
                {guideIsOpen &&
                <Modal
                    isOpen={guideIsOpen}
                    onRequestClose={this.closeGuide}
                    contentLabel="Size Guide"
                    className="size-guide-modal"
                    overlayClassName="size-guide-overlay"
                >
                    <div className="modal-wrapper">
                        <div className="modal-header">
                            <span className="size-guide-title">
                                {loggedIn ? t("detailed.windowTitle") : t("sizeGuide.windowTitle")} <span
                                className="item-name">{product.name}</span>
                            </span>
                            <a className="size-guide-close" role="button" onClick={this.closeGuide}>
                                <FontAwesome name="times" title={t("common.closeText")}/>
                            </a>
                        </div>

                        <div className="modal-body">
                            <div className="size-guide-content">
                                <SizeGuideItem measurements={measurements} selectedSize={selectedSize}
                                               highlight={highlight} matchMap={matchMap}
                                               selectedProfile={selectedProfile}
                                               model={product.model} isGuide={!loggedIn}
                                />
                                {detailSection()}
                            </div>
                        </div>

                        <div className="modal-footer">
                            {!loggedIn &&
                            <span className="sizeme-advertisement">
                                {t("sizeGuide.advertisement")}
                                <a id="sizeme_ad_link" href={contextAddress} target="_blank"/>
                            </span>
                            }
                        </div>
                    </div>
                </Modal>}
                {product.model.measurementOrder.map(measurement => {
                    // TODO: change this to use FitTooltip2, which doesn't need multiple ReactTooltip-components
                    return (<FitTooltip measurement={measurement} key={measurement}
                                        fitData={tooltips[measurement]}/>);
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
    loggedIn: PropTypes.bool.isRequired,
    t: PropTypes.func
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

export default translate()(connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeGuide));
