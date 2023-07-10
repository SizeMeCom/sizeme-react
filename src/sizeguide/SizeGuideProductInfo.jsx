import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import SizeSelector from "../api/SizeSelector";
import uiOptions from "../api/uiOptions";
import { CookieHideWrapper, hideSizeMe } from "../common/CookieHideWrapper";
import { openLoginFrame } from "../common/LoginFrame";
import DetailSection from "./DetailSection.jsx";
import HoverContainer from "./HoverContainer.jsx";
import { convertToInches as toInches, INCH_FRACTION_OPTIONS } from "../common/unit-convertions";

const SizeGuideProductInfo = ({
  productModel,
  unit,
  chooseUnit,
  unitChoiceDisallowed,
  measurements,
  onHover,
}) => {
  const { t } = useTranslation();
  const { measurementOrder, measurementName, pinchedFits, getItemTypeComponent } = productModel;

  const hasNeckOpening = () => measurementOrder.includes("neck_opening_width");

  const isInside = () => {
    const zero = getItemTypeComponent(0);
    return zero === 3 || zero === 4;
  };

  const loginFrameOpener = (mode) => () => openLoginFrame("login-frame", mode);

  const convertToInches = (size) => {
    const [inchesWhole, inchesPartial] = toInches(size);
    return inchesWhole > 0
      ? `${inchesWhole} ${INCH_FRACTION_OPTIONS[inchesPartial]}`
      : INCH_FRACTION_OPTIONS[inchesPartial];
  };

  const handleUnitChange = (unit) => {
    chooseUnit(unit);
  };

  const measurementCellCm = (size, measurement) => (
    <HoverContainer measurement={measurement} key={measurement} onHover={onHover} Elem="td">
      {(
        measurements[size][measurement] /
        (!pinchedFits.includes(measurement) || uiOptions.flatMeasurements ? 10.0 : 5.0)
      ).toFixed(1)}{" "}
      {t("common.cm_short")}
    </HoverContainer>
  );
  const measurementCellInches = (size, measurement) => {
    const originalSizeToShow =
      measurements[size][measurement] /
      (!pinchedFits.includes(measurement) || uiOptions.flatMeasurements ? 10.0 : 5.0);
    const sizeInInches = convertToInches(originalSizeToShow);
    return (
      <HoverContainer measurement={measurement} key={measurement} onHover={onHover} Elem="td">
        {sizeInInches} {t("common.in_short")}
      </HoverContainer>
    );
  };

  return (
    <div className="size-guide-data size-guide-product-info">
      <DetailSection
        title={t("sizeGuide.tableTitle")}
        handleUnitChange={handleUnitChange}
        unitProp={unit}
        writeUnitSelectorInHeader={true}
        unitChoiceDisallowed={unitChoiceDisallowed}
      >
        <table className="product-info-table">
          <thead>
            <tr>
              <th className="size-col">{t("common.sizeItself")}</th>
              {measurementOrder.map((measurement, i) => (
                <HoverContainer
                  measurement={measurement}
                  key={measurement}
                  onHover={onHover}
                  Elem="th"
                  elemProps={{ className: "measurement-head" }}
                >
                  <span className="num">{i + 1}</span>
                  {measurementName(measurement)}
                </HoverContainer>
              ))}
            </tr>
          </thead>
          {unit === "cm" && (
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
          {unit === "in" && (
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
        {isInside() && (
          <div className="sizeme-explanation">
            <div dangerouslySetInnerHTML={{ __html: t("sizeGuide.measurementDisclaimerInside") }} />
          </div>
        )}
        {uiOptions.flatMeasurements && !isInside() && (
          <div className="sizeme-explanation">
            <div dangerouslySetInnerHTML={{ __html: t("sizeGuide.measurementDisclaimer") }} />
            {hasNeckOpening() && (
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
              onClick={loginFrameOpener("signup")}
              className="sign-up link-btn"
              title={t("splash.btnSignUpTitle")}
            >
              {t("splash.btnSignUpLabel")}
            </a>

            <a
              onClick={loginFrameOpener("login")}
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
};

SizeGuideProductInfo.propTypes = {
  measurements: PropTypes.objectOf(PropTypes.object),
  productModel: PropTypes.object.isRequired,
  onHover: PropTypes.func.isRequired,
  unit: PropTypes.string,
  chooseUnit: PropTypes.func,
  unitChoiceDisallowed: PropTypes.bool,
};

export default SizeGuideProductInfo;
