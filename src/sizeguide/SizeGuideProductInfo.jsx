import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import SizeSelector from "../api/SizeSelector";
import uiOptions from "../api/uiOptions";
import { CookieHideWrapper, hideSizeMe } from "../common/CookieHideWrapper";
import { openLoginFrame } from "../common/LoginFrame";
import DetailSection from "./DetailSection.jsx";
import HoverContainer from "./HoverContainer.jsx";
import { convertToInches as toInches, INCH_FRACTION_OPTIONS } from "../common/unit-convertions";

class SizeGuideProductInfo extends React.Component {
  hasNeckOpening = () => this.props.productModel.measurementOrder.includes("neck_opening_width");

  isInside = () => {
    const zero = this.props.productModel.getItemTypeComponent(0);
    return zero === 3 || zero === 4;
  };

  loginFrameOpener = (mode) => () => openLoginFrame("login-frame", mode);

  convertToInches = (size) => {
    const [inchesWhole, inchesPartial] = toInches(size);
    return inchesWhole > 0
      ? `${inchesWhole} ${INCH_FRACTION_OPTIONS[inchesPartial]}`
      : INCH_FRACTION_OPTIONS[inchesPartial];
  };

  changeMeasurementUnit = (event) => {
    this.props.chooseUnit(event.target.value);
  };

  handleUnitChange = (unit) => {
    this.props.chooseUnit(unit);
  };

  render() {
    const { t, measurements, onHover, productModel, unit, unitChoiceDisallowed } = this.props;
    const { measurementOrder, measurementName, pinchedFits } = productModel;

    const measurementCellCm = (size, measurement) => (
      <HoverContainer measurement={measurement} key={measurement} onHover={onHover}>
        <td>
          {(
            measurements[size][measurement] /
            (!pinchedFits.includes(measurement) || uiOptions.flatMeasurements ? 10.0 : 5.0)
          ).toFixed(1)}{" "}
          {t("common.cm_short")}
        </td>
      </HoverContainer>
    );
    const measurementCellInches = (size, measurement) => {
      const originalSizeToShow =
        measurements[size][measurement] /
        (!pinchedFits.includes(measurement) || uiOptions.flatMeasurements ? 10.0 : 5.0);
      const sizeInInches = this.convertToInches(originalSizeToShow);
      return (
        <HoverContainer measurement={measurement} key={measurement} onHover={onHover}>
          <td>
            {sizeInInches} {t("common.in_short")}
          </td>
        </HoverContainer>
      );
    };

    return (
      <div className="size-guide-data size-guide-product-info">
        <DetailSection
          title={t("sizeGuide.tableTitle")}
          handleUnitChange={this.handleUnitChange}
          unitProp={unit}
          writeUnitSelectorInHeader={true}
          unitChoiceDisallowed={unitChoiceDisallowed}
        >
          <table className="product-info-table">
            <thead>
              <tr>
                <th className="size-col">{t("common.sizeItself")}</th>
                {measurementOrder.map((measurement, i) => (
                  <HoverContainer measurement={measurement} key={measurement} onHover={onHover}>
                    <th className="measurement-head">
                      <span className="num">{i + 1}</span>
                      {measurementName(measurement)}
                    </th>
                  </HoverContainer>
                ))}
              </tr>
            </thead>
            {this.props.unit === "cm" && (
              <tbody>
                {SizeSelector.getSizeMapper()
                  .filter(([size]) => !!measurements[size])
                  .map(([size, sizeName]) => (
                    <tr key={sizeName}>
                      <td className="size-col">{sizeName}</td>
                      {measurementOrder.map((measurement) => measurementCellCm(size, measurement))}
                    </tr>
                  ))}
              </tbody>
            )}
            {this.props.unit === "in" && (
              <tbody>
                {SizeSelector.getSizeMapper()
                  .filter(([size]) => !!measurements[size])
                  .map(([size, sizeName]) => (
                    <tr key={sizeName}>
                      <td className="size-col">{sizeName}</td>
                      {measurementOrder.map((measurement) =>
                        measurementCellInches(size, measurement)
                      )}
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
          {this.isInside() && (
            <div className="sizeme-explanation">
              <div
                dangerouslySetInnerHTML={{ __html: t("sizeGuide.measurementDisclaimerInside") }}
              />
            </div>
          )}
          {uiOptions.flatMeasurements && !this.isInside() && (
            <div className="sizeme-explanation">
              <div dangerouslySetInnerHTML={{ __html: t("sizeGuide.measurementDisclaimer") }} />
              {this.hasNeckOpening() && (
                <div
                  dangerouslySetInnerHTML={{ __html: t("sizeGuide.measurementDisclaimerCollar") }}
                />
              )}
            </div>
          )}
        </DetailSection>

        <CookieHideWrapper>
          <div className="size-guide-splash">
            <p dangerouslySetInnerHTML={{ __html: t("splash.detailedText") }} />
            <div className="splash-choices">
              <a
                onClick={this.loginFrameOpener("signup")}
                className="sign-up link-btn"
                title={t("splash.btnSignUpTitle")}
              >
                {t("splash.btnSignUpLabel")}
              </a>

              <a
                onClick={this.loginFrameOpener("login")}
                className="log-in link-btn"
                title={t("splash.btnLogInTitle")}
              >
                {t("splash.btnLogInLabel")}
              </a>

              <a
                href="#"
                className="no-thanks link-btn"
                onClick={hideSizeMe}
                title={t("splash.btnNoThanksTitle")}
              >
                {t("splash.btnNoThanksLabel")}
              </a>
            </div>
          </div>
        </CookieHideWrapper>
      </div>
    );
  }
}

SizeGuideProductInfo.propTypes = {
  measurements: PropTypes.objectOf(PropTypes.object),
  productModel: PropTypes.object.isRequired,
  onHover: PropTypes.func.isRequired,
  t: PropTypes.func,
  unit: PropTypes.string,
  chooseUnit: PropTypes.func,
  unitChoiceDisallowed: PropTypes.bool,
};

export default withTranslation()(SizeGuideProductInfo);
