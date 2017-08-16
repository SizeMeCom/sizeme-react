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
import ReactTooltip from "react-tooltip";
import { trackEvent } from "../api/ga";
import { translate } from "react-i18next";
import "./SizeGuide.scss";
import { setTooltip } from "../api/actions";

class SizeGuide extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            guideIsOpen: false,
            highlight: ""
        };
    }

    onHover = (measurement) => {
        if (!measurement) {
            this.removeTimeout = setTimeout(() => {
                this.setState({ highlight: measurement });
            }, 100);
        } else {
            this.props.onFitHover(measurement);
            this.setState({ highlight: measurement });
            if (this.removeTimeout) {
                clearTimeout(this.removeTimeout);
            }
        }
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
        const { guideIsOpen, highlight } = this.state;
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
                                      onHover={this.onHover}
                                      matchResult={matchResult}
                                      product={product}
                    />
                );
            } else {
                return (
                    <SizeGuideProductInfo measurements={product.item.measurements}
                                          productModel={product.model}
                                          onHover={this.onHover}
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
    onFitHover: PropTypes.func,
    matchResult: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    t: PropTypes.func
};

const mapStateToProps = (state) => ({
    product: state.productInfo.product,
    profiles: state.profileList.profiles,
    selectedProfile: state.selectedProfile,
    selectedSize: state.selectedSize.size,
    matchResult: state.match.matchResult,
    loggedIn: state.authToken.loggedIn
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onSelectProfile: setSelectedProfile,
    onFitHover: setTooltip
}, dispatch);

export default translate()(connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeGuide));
