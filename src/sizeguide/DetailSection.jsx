import i18n from "i18next";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import "../common/SizeForm.scss";

const unitTexts = {
  cm: i18n.t("common.cm_short"),
  in: i18n.t("common.in_short"),
};

const DetailSection = ({
  title,
  children,
  unitProp,
  loggedIn,
  showUnitSelector,
  handleUnitChange,
  unitChoiceDisallowed,
}) => (
  <div className="size-guide-details-section">
    <div className="size-guide-header-container">
      <div className="size-guide-header-title">
        <h2 className="header-h2">
          <span className="header-left">{title}</span>
          {!unitChoiceDisallowed && (!loggedIn || showUnitSelector) && (
            <span className={"header-right unit-selector" + " unit-selector-selected-" + unitProp}>
              <span className="unit-selector-label" onClick={() => handleUnitChange("cm")}>
                {unitTexts["cm"]}
              </span>
              <span
                className="unit-selector-slider"
                onClick={() => handleUnitChange(unitProp === "cm" ? "in" : "cm")}
              ></span>
              <span className="unit-selector-label" onClick={() => handleUnitChange("in")}>
                {unitTexts["in"]}
              </span>
            </span>
          )}
        </h2>
      </div>
    </div>
    {children}
  </div>
);

DetailSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  unitProp: PropTypes.string,
  loggedIn: PropTypes.bool,
  showUnitSelector: PropTypes.bool,
  handleUnitChange: PropTypes.func,
  inchFractionsPrecision: PropTypes.number,
  unitChoiceDisallowed: PropTypes.bool,
};

export default withTranslation()(DetailSection);
