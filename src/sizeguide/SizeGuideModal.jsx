import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import Modal from "react-modal";
import uiOptions from "../api/uiOptions";
import SizeGuideDetails from "./SizeGuideDetails";
import SizeGuideItem from "./SizeGuideItem";
import SizeGuideProductInfo from "./SizeGuideProductInfo";

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
    onHover: PropTypes.func.isRequired,
    unit: PropTypes.string,
    chooseUnit: PropTypes.func,
    inchFractionsPrecision: PropTypes.number,
    unitChoiceDisallowed: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      guideIsOpen,
      loggedIn,
      product,
      t,
      closeGuide,
      onSelectProfile,
      onHover,
      selectedSize,
      highlight,
      matchResult,
      selectedProfile,
      profiles,
      matchState,
      unit,
      chooseUnit,
      inchFractionsPrecision,
      unitChoiceDisallowed,
    } = this.props;

    const selectedMatchResult = matchResult ? matchResult[selectedSize] : null;
    const matchMap = selectedMatchResult
      ? new Map(Object.entries(selectedMatchResult.matchMap))
      : new Map();
    const measurements = new Map(Object.entries(product.item.measurements));

    const detailSection = () => {
      if (loggedIn) {
        return (
          <SizeGuideDetails
            onSelectProfile={onSelectProfile}
            selectedProfile={selectedProfile ? selectedProfile.id : ""}
            profiles={profiles}
            selectedSize={selectedSize}
            onHover={onHover}
            matchResult={matchResult}
            product={product}
            loggedIn={loggedIn}
            unit={unit}
            chooseUnit={chooseUnit}
            inchFractionsPrecision={inchFractionsPrecision}
            unitChoiceDisallowed={unitChoiceDisallowed}
          />
        );
      } else {
        return (
          <SizeGuideProductInfo
            measurements={product.item.measurements}
            productModel={product.model}
            onHover={onHover}
            loggedIn={loggedIn}
            unit={unit}
            chooseUnit={chooseUnit}
            inchFractionsPrecision={inchFractionsPrecision}
            unitChoiceDisallowed={unitChoiceDisallowed}
          />
        );
      }
    };

    return (
      <Modal
        isOpen={guideIsOpen}
        onRequestClose={closeGuide}
        contentLabel="Size Guide"
        className={`size-guide-modal ${matchState.state}`}
        overlayClassName="size-guide-overlay"
      >
        <div className="modal-wrapper">
          <div className="modal-header">
            <span className="size-guide-title">
              {loggedIn ? t("detailed.windowTitle") : t("sizeGuide.windowTitle")}{" "}
              <span className="item-name" dangerouslySetInnerHTML={{ __html: product.name }} />
            </span>
            <a className="size-guide-close" role="button" onClick={closeGuide}>
              <i className="fa-solid fa-times" title={t("common.closeText")} />
            </a>
          </div>

          <div className="modal-body">
            <div className="size-guide-content">
              <SizeGuideItem
                measurements={measurements}
                selectedSize={selectedSize}
                highlight={highlight}
                matchMap={matchMap}
                selectedProfile={selectedProfile}
                model={product.model}
                isGuide={!loggedIn}
              />
              {detailSection()}
            </div>
          </div>

          <div className="modal-footer">
            <span className="sizeme-advertisement"></span>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withTranslation()(SizeGuideModal);
