import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
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

const overlap = (fitData, t) => {
  const { matchItem, fitText, isPinched, isLongFit } = fitData;
  if (matchItem && matchItem.overlap > 0) {
    return (
      <span>
        {t(isLongFit ? "fitInfo.overlapsYouLongs" : "fitInfo.overlapsYou")}
        <strong> {fitText}</strong>
        {isPinched && t("fitInfo.whenPinched")}.
      </span>
    );
  } else {
    return null;
  }
};

const overlapInches = (fitData, t, inchFractionsPrecision) => {
  const { matchItem, isPinched, isLongFit } = fitData;
  if (matchItem && matchItem.overlap > 0) {
    return (
      <span>
        {t(isLongFit ? "fitInfo.overlapsYouLongs" : "fitInfo.overlapsYou")}
        <strong>
          {" "}
          {convertToInches(fitData.fitValue, inchFractionsPrecision)} {t("common.in_short")}
        </strong>
        {isPinched && t("fitInfo.whenPinched")}.
      </span>
    );
  } else {
    return null;
  }
};

const noOverlap = (fitData, t) => {
  const { matchItem, fitText, isPinched, isLongFit } = fitData;
  if (matchItem && matchItem.overlap <= 0) {
    if (matchItem.componentFit >= 1000) {
      return (
        <span>
          {t(isLongFit ? "fitInfo.noOverlapLongs" : "fitInfo.noOverlap")}{" "}
          {getStretchedTxt(matchItem.componentStretch, t)}
        </span>
      );
    } else {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html:
              t(isLongFit ? "fitInfo.isSmallerLongs" : "fitInfo.isSmaller", {
                value: fitText.replace("-", ""),
                whenPinched: isPinched ? t("fitInfo.whenPinched") : "",
              }) + ".",
          }}
        />
      );
    }
  } else {
    return null;
  }
};

const noMatchItem = (fitData, t) => {
  const { missingMeasurement, fitText, matchItem } = fitData;
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

class FitTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fitData: null };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { product, selectedSize, matchResult, measurement } = nextProps;
    if (matchResult) {
      const item = Object.assign({}, product.item, {
        measurements: product.item.measurements[selectedSize],
      });
      const matchItem = matchResult.matchMap[measurement];
      const missingMeasurement =
        matchResult.missingMeasurements.findIndex(([meas]) => meas === measurement) >= 0;
      const fitData = {
        matchItem,
        missingMeasurement,
        ...getResult(measurement, item.measurements[measurement], matchItem),
      };
      this.setState({ fitData });
    } else {
      this.setState({ fitData: null });
    }
  }

  render() {
    const { t, measurement, product, unit, inchFractionsPrecision } = this.props;
    const { measurementName } = product.model;
    const { fitData } = this.state;
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
          {unit === "cm" && overlap(fitData, t)}
          {unit === "in" && overlapInches(fitData, t, inchFractionsPrecision)}
          {noOverlap(fitData, t)}
          {noMatchItem(fitData, t)}
        </ReactTooltip>
      );
    }
  }
}

FitTooltip.propTypes = {
  measurement: PropTypes.string,
  product: PropTypes.object,
  selectedSize: PropTypes.string,
  matchResult: PropTypes.object,
  t: PropTypes.func.isRequired,
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

export default withTranslation()(connect(mapStateToProps)(FitTooltip));
