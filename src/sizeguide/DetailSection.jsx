import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import "../common/SizeForm.scss";

const DetailSection = ({
  title,
  children,
  unitProp,
  writeUnitSelectorInHeader,
  handleUnitChange,
  unitChoiceDisallowed,
}) => {
  const { t } = useTranslation();

  return (
    <div className="size-guide-details-section">
      <div className="size-guide-header-container">
        <div className="size-guide-header-title">
          <h2 className="header-h2">
            <span className="header-left">{title}</span>
            {!unitChoiceDisallowed && writeUnitSelectorInHeader && (
              <span
                className={"header-right unit-selector" + " unit-selector-selected-" + unitProp}
              >
                <span className="unit-selector-label" onClick={() => handleUnitChange("cm")}>
                  {t("common.cm_short")}
                </span>
                <span
                  className="unit-selector-slider"
                  onClick={() => handleUnitChange(unitProp === "cm" ? "in" : "cm")}
                ></span>
                <span className="unit-selector-label" onClick={() => handleUnitChange("in")}>
                  {t("common.in_short")}
                </span>
              </span>
            )}
          </h2>
        </div>
      </div>
      {children}
    </div>
  );
};

DetailSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  unitProp: PropTypes.string,
  loggedIn: PropTypes.bool,
  writeUnitSelectorInHeader: PropTypes.bool,
  handleUnitChange: PropTypes.func,
  unitChoiceDisallowed: PropTypes.bool,
};

export default DetailSection;
