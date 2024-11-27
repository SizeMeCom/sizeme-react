import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";

import ProductModel from "../api/ProductModel";

import Chest from "./Chest";
import Underbust from "./Underbust";
import FrontHeight from "./FrontHeight";
import Hips from "./Hips";
import Outseam from "./Outseam";
import "./OverlapBox.scss";
import PantWaist from "./PantWaist";
import Pinch from "./Pinch";
import ShirtHips from "./ShirtHips";
import ShirtWaist from "./ShirtWaist";
import Shoe from "./Shoe";
import Sleeve from "./Sleeve";

const inchFractionOptions = ["", "⅛", "¼", "⅜", "½", "⅝", "¾", "⅞"];

const illustration = (measurement, overlap, model) => {
  switch (measurement) {
    case "sleeve":
      return <Sleeve overlap={overlap} />;
    case "frontHeight":
      return <FrontHeight overlap={overlap} />;
    case "chest":
      return <Chest overlap={overlap} />;
    case "underbust":
      return <Underbust overlap={overlap} />;
    case "pantWaist":
      return <PantWaist overlap={overlap} />;
    case "hips":
      if (model.getItemTypeComponent(0) === 1) {
        return <ShirtHips overlap={overlap} />;
      } else {
        return <Hips overlap={overlap} />;
      }
    case "shirtWaist":
      return <ShirtWaist overlap={overlap} />;
    case "thighCircumference":
    case "kneeCircumference":
    case "calfCircumference":
    case "ankleCircumference":
    case "headCircumference":
      return <Pinch overlap={overlap} />;

    case "outSeam":
      return <Outseam overlap={overlap} />;

    case "footLength":
      return <Shoe overlap={overlap} />;

    default:
      return null;
  }
};

const illustrationDivider = (measurement) => {
  switch (measurement) {
    case "chest":
    case "underbust":
    case "pantWaist":
    case "hips":
    case "shirtWaist":
    case "thighCircumference":
    case "kneeCircumference":
    case "calfCircumference":
    case "ankleCircumference":
    case "headCircumference":
      return 40;
    default:
      return 10;
  }
};

class OverlapBox extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  convertToInches = (size) => {
    const precision = this.props.inchFractionsPrecision;
    const inchesWhole = Math.floor(Math.round((size / 2.54) * precision) / precision);
    const inchesPartial = Math.round((size / 2.54) * precision) - inchesWhole * precision;
    if (inchesWhole == 0 && inchesPartial == 0) {
      return 0;
    } else {
      return inchesWhole > 0
        ? inchesWhole + inchFractionOptions[inchesPartial]
        : inchFractionOptions[inchesPartial];
    }
  };

  render() {
    const { fit, humanProperty, hover, t, model } = this.props;
    const overlap = fit.overlap / illustrationDivider(humanProperty);
    const overlapInches = this.convertToInches(overlap);
    let className = "overlap-box";
    className += " " + ProductModel.getFit(fit).label;
    if (overlap <= 0) {
      className += " no-overlap";
    }

    return (
      <div
        className={className}
        data-tip
        data-for="fit-tooltip"
        data-effect="solid"
        data-place="bottom"
        onMouseEnter={hover}
      >
        <div className="overlap-svg">{illustration(humanProperty, overlap, model)}</div>
        {this.props.unit === "cm" && (
          <div className="overlap-text">
            <div>
              {overlap > 0 && "+"}
              {overlap.toFixed(1)} {t("common.cm_short")}
            </div>
          </div>
        )}
        {this.props.unit === "in" && (
          <div className="overlap-text">
            <div>
              {overlap > 0 && "+"}
              {overlapInches} {t("common.in_short")}
            </div>
          </div>
        )}
        <div className="overlap-verdict">
          <div>{t(`fitVerdict.${ProductModel.getFit(fit).label}`)}</div>
        </div>
      </div>
    );
  }
}

OverlapBox.propTypes = {
  fit: PropTypes.object.isRequired,
  humanProperty: PropTypes.string.isRequired,
  hover: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  t: PropTypes.func,
  unit: PropTypes.string,
  inchFractionsPrecision: PropTypes.number,
};

export default withTranslation()(OverlapBox);
