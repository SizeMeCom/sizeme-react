import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";

import ProductModel from "../api/ProductModel";

import Chest from "./Chest";
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
import { convertToInches as toInches, INCH_FRACTION_OPTIONS } from "../common/unit-convertions";
import clsx from "clsx";

const illustration = (measurement, overlap, model) => {
  switch (measurement) {
    case "sleeve":
      return <Sleeve overlap={overlap} />;
    case "frontHeight":
      return <FrontHeight overlap={overlap} />;
    case "chest":
      return <Chest overlap={overlap} />;
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

const convertToInches = (size) => {
  const [inchesWhole, inchesPartial] = toInches(size);
  if (inchesWhole === 0 && inchesPartial === 0) {
    return "0";
  } else {
    return inchesWhole > 0
      ? inchesWhole + INCH_FRACTION_OPTIONS[inchesPartial]
      : INCH_FRACTION_OPTIONS[inchesPartial];
  }
};

const OverlapBox = ({ fit, hover, unit, humanProperty, model }) => {
  const { t } = useTranslation();
  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  const overlap = fit.overlap / illustrationDivider(humanProperty);
  const overlapInches = convertToInches(overlap);
  const fitLabel = ProductModel.getFit(fit).label;
  const className = clsx(["overlap-box", fitLabel], { "no-overlap": overlap <= 0 });

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
      {unit === "cm" && (
        <div className="overlap-text">
          <div>
            {overlap > 0 && "+"}
            {overlap.toFixed(1)} {t("common.cm_short")}
          </div>
        </div>
      )}
      {unit === "in" && (
        <div className="overlap-text">
          <div>
            {overlap > 0 && "+"}
            {overlapInches} {t("common.in_short")}
          </div>
        </div>
      )}
      <div className="overlap-verdict">
        <div>{t(`fitVerdict.${fitLabel}`)}</div>
      </div>
    </div>
  );
};

OverlapBox.propTypes = {
  fit: PropTypes.object.isRequired,
  humanProperty: PropTypes.string.isRequired,
  hover: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  unit: PropTypes.string,
};

export default OverlapBox;
