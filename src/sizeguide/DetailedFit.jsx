import Optional from "optional-js";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getResult } from "../api/ProductModel";
import { convertToInches as toInches, INCH_FRACTION_OPTIONS } from "../common/unit-convertions";

const updateResult = (match, measurement, item) => {
  const matchOpt = Optional.ofNullable(match);
  const matchItem = matchOpt.map((m) => m.matchMap[measurement]).orElse(null);

  return getResult(measurement, item.measurements[measurement], matchItem);
};

const DetailedFit = ({ num, unit, item, measurement, measurementName, match, onHover }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState(() => updateResult(match, measurement, item));

  useEffect(() => {
    setResult(updateResult(match, measurement, item));
  }, [match, measurement, item]);

  const convertToInches = (text) => {
    const prefixHolder = text.includes("+") ? "+" : "";
    const cmValue = parseFloat(text.replace("+", "").replace(" cm", ""));
    const [inchesWhole, inchesPartial] = toInches(cmValue);

    if (inchesWhole === 0 && inchesPartial === 0) {
      return "0 " + t("common.in_short");
    }
    if (inchesWhole > 0) {
      return (
        prefixHolder +
        inchesWhole +
        " " +
        INCH_FRACTION_OPTIONS[inchesPartial] +
        " " +
        t("common.in_short")
      );
    }
    return prefixHolder + INCH_FRACTION_OPTIONS[inchesPartial] + " " + t("common.in_short");
  };

  const { fit, fitText, isLongFit } = result;
  return (
    <div
      className="detailed-fit"
      onMouseEnter={() => onHover(measurement)}
      onMouseLeave={() => onHover("")}
      data-tooltip-id="fit-tooltip"
      data-tooltip-content={measurement}
    >
      <div className="measurement-head">
        <span className="num">{num}</span>
        {measurementName(measurement)}
      </div>

      {unit === "cm" && <div className="overlap">{fitText}</div>}
      {unit === "in" && <div className="overlap">{convertToInches(fitText)}</div>}

      {fit ? (
        <div className={`fit-label ${fit.label}`}>
          {isLongFit ? t(`fitVerdictLong.${fit.label}`) : t(`fitVerdict.${fit.label}`)}
        </div>
      ) : (
        <div className="fit-label" />
      )}
    </div>
  );
};

DetailedFit.propTypes = {
  num: PropTypes.number.isRequired,
  measurement: PropTypes.string.isRequired,
  match: PropTypes.object,
  item: PropTypes.object.isRequired,
  measurementName: PropTypes.func.isRequired,
  unit: PropTypes.string,
  onHover: PropTypes.func.isRequired,
};

export default DetailedFit;
