import React from "react";
import FontAwesome from "react-fontawesome";
import SizeGuideItem from "./SizeGuideItem";
import {contextAddress} from "../api/sizeme-api";
import Modal from "react-modal";
import PropTypes from "prop-types";
import SizeGuideDetails from "./SizeGuideDetails";
import SizeGuideProductInfo from "./SizeGuideProductInfo";
import { withTranslation } from "react-i18next";
import uiOptions from "../api/uiOptions";

Modal.setAppElement(uiOptions.appendContentTo + " div");

class SizeGuideModal extends React.Component {

    static propTypes = {
        guideIsOpen: PropTypes.bool.isRequired,
        loggedIn: PropTypes.bool.isRequired,
        product: PropTypes.object.isRequired,
        selectedSize: PropTypes.string,
        highlight: PropTypes.string,
        matchResult: PropTypes.object,
        selectedProfile: PropTypes.object,
        matchState: PropTypes.object,
        t: PropTypes.func,
        closeGuide: PropTypes.func.isRequired,
        onSelectProfile: PropTypes.func.isRequired,
        profiles: PropTypes.arrayOf(PropTypes.object),
        onHover: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            guideIsOpen, loggedIn, product, t, closeGuide, onSelectProfile, onHover,
            selectedSize, highlight, matchResult, selectedProfile, profiles, matchState
        } = this.props;

        const selectedMatchResult = matchResult ? matchResult[selectedSize] : null;
        const matchMap = selectedMatchResult ? new Map(Object.entries(selectedMatchResult.matchMap)) : new Map();
        const measurements = new Map(Object.entries(product.item.measurements));

        const detailSection = () => {
            if (loggedIn) {
                return (
                    <SizeGuideDetails onSelectProfile={onSelectProfile}
                        selectedProfile={selectedProfile ? selectedProfile.id : ""}
                        profiles={profiles}
                        selectedSize={selectedSize}
                        onHover={onHover}
                        matchResult={matchResult}
                        product={product}
                    />
                );
            } else {
                return (
                    <SizeGuideProductInfo measurements={product.item.measurements}
                        productModel={product.model}
                        onHover={onHover}
                    />
                );
            }
        };

        return (<Modal
            isOpen={guideIsOpen}
            onRequestClose={closeGuide}
            contentLabel="Size Guide"
            className={`size-guide-modal ${matchState.state}`}
            overlayClassName="size-guide-overlay"
        >
            <div className="modal-wrapper">
                <div className="modal-header">
                    <span className="size-guide-title">
                        {loggedIn ? t("detailed.windowTitle") : t("sizeGuide.windowTitle")} <span
                        className="item-name">{product.name}</span>
                    </span>
                    <a className="size-guide-close" role="button" onClick={closeGuide}>
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
                    <span className="sizeme-advertisement">
                        <a id="sizeme_ad_link" href={contextAddress}
                            title={t("sizeGuide.advertisement")} target="_blank" rel="noopener noreferrer"/>
                    </span>
                </div>
            </div>
        </Modal>);
    }
}

export default withTranslation()(SizeGuideModal);
