import PropTypes, { bool, string, object, number } from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { getResult } from "../api/ProductModel";

const inchFractionOptions = ["", "⅛", "¼", "⅜", "½", "⅝", "¾", "⅞"];

const convertToInches = (size, inchFractionsPrecision) => {
  const precision = parseInt(inchFractionsPrecision);
  const inchesWhole = Math.floor(Math.round((size / 2.54) * precision) / precision);
  const inchesPartial = Math.round((size / 2.54) * precision) - inchesWhole * precision;
  return inchesWhole > 0
    ? `${inchesWhole} ${inchFractionOptions[inchesPartial]}`
    : inchFractionOptions[inchesPartial];
};

const getStretchedTxt = (stretchValue, t) => {
  if (stretchValue > 0) {
    if (stretchValue < 25) {
      return t("fitInfo.stretchedLittle");
    } else if (stretchValue < 75) {
      return t("fitInfo.stretchedSomewhat");
    } else if (stretchValue < 95) {
      return t("fitInfo.stretchedMuch");
    } else {
      return t("fitInfo.stretchedMax");
    }
  }
  return "";
};

const Overlap = ({ matchItem, fitText, fitValue, isPinched, unit, inchFractionsPrecision }) => {
  const { t } = useTranslation();
  if (matchItem && matchItem.overlap > 0) {
    return (
      <span>
        {t("fitInfo.overlapsYou")}
        <strong>
          {" "}
          {unit === "cm" ? fitText : convertToInches(fitValue, inchFractionsPrecision)}{" "}
          {t("common.in_short")}
        </strong>
        {isPinched && t("fitInfo.whenPinched")}.
      </span>
    );
  } else {
    return null;
  }
};

Overlap.propTypes = {
  fitText: string.isRequired,
  fitValue: number,
  matchItem: object,
  isPinched: bool.isRequired,
  unit: string.isRequired,
  inchFractionsPrecision: number,
};

const NoOverlap = ({ matchItem, fitText, isPinched }) => {
  const { t } = useTranslation();
  if (matchItem && matchItem.overlap <= 0) {
    if (matchItem.componentFit >= 1000) {
      return (
        <span>
          {t("fitInfo.noOverlap")} {getStretchedTxt(matchItem.componentStretch, t)}
        </span>
      );
    } else {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html:
              t("fitInfo.isSmaller", {
                value: fitText.replace("-", ""),
                whenPinched: isPinched ? t("fitInfo.whenPinched") : " ",
              }) + ".",
          }}
        />
      );
    }
  } else {
    return null;
  }
};

NoOverlap.propTypes = {
  fitText: string.isRequired,
  matchItem: object,
  isPinched: bool.isRequired,
};

const NoMatchItem = ({ missingMeasurement, fitText, matchItem }) => {
  const { t } = useTranslation();
  if (!matchItem) {
    return (
      <span>
        {t("fitInfo.noMatchItem", {
          value: fitText,
          add: missingMeasurement ? t("message.addThisMeasurement") : " ",
        })}
      </span>
    );
  } else {
    return null;
  }
};

NoMatchItem.propTypes = {
  missingMeasurement: bool.isRequired,
  fitText: string.isRequired,
  matchItem: object,
};

const FitTooltip = ({
  measurement,
  product,
  unit,
  selectedSize,
  matchResult,
  inchFractionsPrecision,
}) => {
  const [fitData, setFitData] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (matchResult) {
      const item = Object.assign({}, product.item, {
        measurements: product.item.measurements[selectedSize],
      });
      const matchItem = matchResult.matchMap[measurement];
      const missingMeasurement =
        matchResult.missingMeasurements.findIndex(([meas]) => meas === measurement) >= 0;
      setFitData({
        matchItem,
        missingMeasurement,
        ...getResult(measurement, item.measurements[measurement], matchItem),
      });
    } else {
      setFitData(null);
    }
  }, [matchResult, product, selectedSize, measurement]);

  const { measurementName } = product.model;
  if (!fitData || !measurement) {
    return <ReactTooltip id="fit-tooltip" type="light" place="right" className="fit-tooltip" />;
  } else {
    return (
      <ReactTooltip
        id="fit-tooltip"
        type="light"
        place="right"
        className={`fit-tooltip ${measurement}`}
      >
        {t("fitInfo.tooltipDefaultText", { measurement: measurementName(measurement) })}
        <Overlap {...fitData} unit={unit} inchFractionsPrecision={inchFractionsPrecision} />
        <NoOverlap {...fitData} />
        <NoMatchItem {...fitData} />
      </ReactTooltip>
    );
  }
};

FitTooltip.propTypes = {
  measurement: PropTypes.string,
  product: PropTypes.object,
  selectedSize: PropTypes.string,
  matchResult: PropTypes.object,
  unit: PropTypes.string,
  inchFractionsPrecision: PropTypes.number,
};

const mapStateToProps = (state) => ({
  measurement: state.tooltip,
  product: state.productInfo.product,
  selectedSize: state.selectedSize.size,
  matchResult:
    state.selectedSize.size && state.match.matchResult
      ? state.match.matchResult[state.selectedSize.size]
      : null,
});

export default connect(mapStateToProps)(FitTooltip);
