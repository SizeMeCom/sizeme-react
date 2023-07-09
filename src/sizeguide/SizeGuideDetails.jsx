import Optional from "optional-js";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import SizeSelector from "../api/SizeSelector";
import ProfileSelect from "../common/ProfileSelect";
import SizingBar from "../common/SizingBar.jsx";
import DetailSection from "./DetailSection.jsx";
import DetailedFit from "./DetailedFit.jsx";
import HoverContainer from "./HoverContainer.jsx";

class DetailsSizeSelector extends React.Component {
  componentDidMount() {
    this.select = SizeSelector.getClone();
    this.container.appendChild(this.select);
  }

  componentDidUpdate() {
    this.select.value = this.props.selectedSize || "";
  }

  render() {
    return (
      <div
        ref={(container) => {
          this.container = container;
        }}
      />
    );
  }
}

DetailsSizeSelector.propTypes = {
  selectedSize: PropTypes.string,
};

class SizeGuideDetails extends React.Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  handleUnitChange = (unit) => {
    this.props.chooseUnit(unit);
  };

  render() {
    const {
      product,
      onHover,
      selectedSize,
      matchResult,
      onSelectProfile,
      selectedProfile,
      profiles,
      t,
      unit,
      unitChoiceDisallowed,
    } = this.props;

    const item = Object.assign({}, product.item, {
      measurements: product.item.measurements[selectedSize],
    });
    const match = Optional.ofNullable(selectedSize)
      .flatMap((size) => Optional.ofNullable(matchResult).map((r) => r[size]))
      .orElse(null);

    return (
      <div className="size-guide-data size-guide-details">
        <DetailSection title={t("common.shoppingFor")} writeUnitSelectorInHeader={false}>
          <ProfileSelect
            onSelectProfile={onSelectProfile}
            selectedProfile={selectedProfile}
            profiles={profiles}
          />
        </DetailSection>
        <DetailSection title={t("common.selectedSize")} writeUnitSelectorInHeader={false}>
          <DetailsSizeSelector selectedSize={selectedSize} />
        </DetailSection>
        <DetailSection title={t("fitInfo.overallFit")} writeUnitSelectorInHeader={false}>
          <SizingBar />
        </DetailSection>
        <DetailSection
          title={t("detailed.tableTitle")}
          writeUnitSelectorInHeader={true}
          handleUnitChange={this.handleUnitChange}
          unitProp={unit}
          unitChoiceDisallowed={unitChoiceDisallowed}
        >
          <div className="fit-table">
            {product.model.measurementOrder.map((measurement, i) => (
              <HoverContainer
                measurement={measurement}
                onHover={onHover}
                key={i}
                Elem="div"
                elemProps={{
                  className: "fit-wrapper",
                  "data-tip": true,
                  "data-for": "fit-tooltip",
                }}
              >
                {selectedSize && (
                  <DetailedFit
                    measurement={measurement}
                    num={i + 1}
                    item={item}
                    measurementName={product.model.measurementName}
                    match={match}
                    unit={unit}
                  />
                )}
              </HoverContainer>
            ))}
          </div>
        </DetailSection>
      </div>
    );
  }
}

SizeGuideDetails.propTypes = {
  onSelectProfile: PropTypes.func.isRequired,
  selectedProfile: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object),
  selectedSize: PropTypes.string,
  onHover: PropTypes.func.isRequired,
  matchResult: PropTypes.object,
  product: PropTypes.object.isRequired,
  t: PropTypes.func,
  unit: PropTypes.string,
  chooseUnit: PropTypes.func,
  unitChoiceDisallowed: PropTypes.bool,
};

export default withTranslation()(SizeGuideDetails);
