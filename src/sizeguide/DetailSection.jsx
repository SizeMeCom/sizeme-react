import i18n from "i18next";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import "../common/SizeForm.scss";

const unitTexts = {
    0: i18n.t("common.select_unit_from_cm"),
    1: i18n.t("common.select_unit_from_in")
};

const DetailSection = ({ title, children, unitProp, loggedIn, showUnitSelector, handleUnitChange, unitChoiceDisallowed }) => (
    <div className="size-guide-details-section">
        <div className="size-guide-header-container">
            <div className="size-guide-header-title">
                <h2 className="header-h2">
                    <span className="header-left">{title}</span>
                    { !unitChoiceDisallowed && (!loggedIn || showUnitSelector) && (<span className={"header-right unit-selector"} onClick={() => handleUnitChange(1 - unitProp)}>
                        {unitTexts[unitProp]}
                    </span>) }
                </h2>
            </div>
        </div>
        {children}
    </div>
);

DetailSection.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    unitProp: PropTypes.number,
    loggedIn: PropTypes.bool,
    showUnitSelector: PropTypes.bool,
    handleUnitChange: PropTypes.func,
    inchFractionsPrecision: PropTypes.number,
    unitChoiceDisallowed: PropTypes.number
};

export default withTranslation()(DetailSection);