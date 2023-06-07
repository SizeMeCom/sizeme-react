import i18n from "i18next";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import "../common/SizeForm.scss";


const measurementUnits = [
    {id: parseInt(0), name: i18n.t("common.cm_long")},
    {id: parseInt(1), name: i18n.t("common.in_long")}
];

const DetailSection = ({ title, children, unitProp, loggedIn, showUnitSelector, handleUnitChange, unitChoiceDisallowed }) => (
    <div className="size-guide-details-section">
        <div className="size-guide-header-container">
            <div className="size-guide-header-title">
                <h2 className="header-h2">
                    <span className="header-left">{title}</span>
                    { !unitChoiceDisallowed && (!loggedIn || showUnitSelector) && (<span className={"header-right unit-selector"} data-for="unit-tooltip" data-tip="custom show" data-event="click focus">
                        {i18n.t("common.select_unit")}
                    </span>) }
                </h2>
                <ReactTooltip id="unit-tooltip" className="unit-menu" globalEventOff="click"
                    place="left" type="light" effect="solid" clickable >
                    {}
                    <div className="unit-list">
                        {measurementUnits.map(unit =>
                            <div id="unit-item" key={unit.id} value={unit.id} className={"unit-item" + (unit.id === unitProp ? " selected" : "")} onClick={(e) => handleUnitChange(e, unit.id)}>
                                <span className={"unit-name" + (unit.id === unitProp ? " selected" : "")}>{unit.name}</span>
                            </div>
                        )}
                    </div>
                </ReactTooltip>
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