import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import "./SizeForm.scss";
import clsx from "clsx";
import { INCH_FRACTION_PRECISION, UNIT_FACTORS, convertToInches } from "./unit-convertions";
import { Tooltip } from "react-tooltip";

const inchFractionOptions = ["0/0", "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"];

const hideIfZero = (value) => {
  if (value === 0) {
    return "";
  }
  return value.toString();
};

const modelToInches = (value) => {
  if (!value) {
    return [0, 0];
  }
  return convertToInches(value);
};

const inchesToModel = (wholeValue, partialValue) => {
  if (wholeValue === 0) {
    return undefined;
  }
  return Math.round((wholeValue + partialValue / INCH_FRACTION_PRECISION) * UNIT_FACTORS.in);
};

const modelToCm = (value) => (value ? (value / UNIT_FACTORS.cm).toFixed(1) : "");

const cmToModel = (value) =>
  value ? Math.floor(parseFloat(value.replace(",", ".")) * UNIT_FACTORS.cm) : undefined;

const MeasurementInput = ({
  field,
  unit = "cm",
  chooseUnit,
  renderTooltip,
  onChange,
  fitRange,
  unitChoiceDisallowed,
  value,
}) => {
  const { t } = useTranslation();

  const [pending, setPending] = useState(false);
  const [viewValue, setViewValue] = useState(modelToCm(value));

  const [[wholeInches, partialInches], setInchValue] = useState(modelToInches(value));
  const [wholeInchesViewValue, setWholeInchesViewValue] = useState(hideIfZero(wholeInches));

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const timeout = useRef();
  const tooltipTimeout = useRef();
  const input = useRef();
  const inputIn = useRef();

  useEffect(() => {
    setViewValue(modelToCm(value));
    const inches = modelToInches(value);
    setInchValue(inches);
    setWholeInchesViewValue(hideIfZero(inches[0]));
  }, [value]);

  const hideTooltip = () => {
    setTooltipOpen(false);
    clearTimeout(timeout.current);
    timeout.current = undefined;
    clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = undefined;
  };

  const dispatchValue = (modelValue) => {
    setPending(false);
    setViewValue(modelToCm(modelValue));
    if (modelValue !== value) {
      onChange(modelValue);
    }
  };

  const cmValueChanged = (isBlur) => {
    hideTooltip();
    const newValue = input.current.value;
    setViewValue(newValue);
    const modelValue = cmToModel(newValue);
    setPending(true);
    if (isBlur) {
      dispatchValue(modelValue);
    } else {
      timeout.current = setTimeout(() => {
        dispatchValue(modelValue);
      }, 1000);
    }
  };

  const inchValueChanged = (wholeValue, partialValue) => {
    hideTooltip();
    setInchValue([wholeValue, partialValue]);
    setPending(true);
    timeout.current = setTimeout(() => {
      if (wholeValue === 0) {
        setWholeInchesViewValue("");
        setInchValue([0, 0]);
      } else {
        setWholeInchesViewValue(wholeValue);
      }
      dispatchValue(wholeValue === 0 ? 0 : inchesToModel(wholeValue, partialValue));
    }, 700);
  };

  const onFocus = () => {
    tooltipTimeout.current = setTimeout(() => {
      setTooltipOpen(true);
    }, 200);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      input.current?.blur();
      inputIn.current?.blur();
    }
  };

  const isKeyAllowed = (keyCode) => {
    return (
      (keyCode >= 48 && keyCode <= 57) || // regular number keys
      (keyCode >= 96 && keyCode <= 105) || // numpad number keys
      keyCode === 8 ||
      keyCode === 46 || // backspace and delete keys
      keyCode === 37 ||
      keyCode === 39 || // left and right arrow keys
      keyCode === 9 ||
      keyCode === 13
    ); // tab and enter
  };

  const onWholeInchesKeyDown = (e) => {
    onKeyDown(e);
    if (!isKeyAllowed(e.keyCode)) {
      e.preventDefault();
    }
  };

  const handleUnitChange = (newUnit) => {
    chooseUnit(newUnit);
  };

  const handleWholeInchesChange = (event) => {
    setWholeInchesViewValue(event.target.value);
    const eventValue = event.target.value ? parseInt(event.target.value, 10) : 0;
    inchValueChanged(eventValue, partialInches);
  };

  const handlePartialInchesChange = (event) => {
    const eventValue = parseInt(event.target.value, 10);
    inchValueChanged(wholeInches, eventValue);
  };

  const classes = clsx(
    "measurement-input",
    {
      "measurement-input-ok": value,
      "measurement-input-pending": pending,
    },
    fitRange
  );

  const unitMark = t(`common.${unit}_short`);

  return (
    <div className={classes}>
      {!unitChoiceDisallowed && (
        <span
          className="units yes-clickable"
          onClick={() => handleUnitChange(unit === "cm" ? "in" : "cm")}
        >
          {unitMark}
        </span>
      )}
      {unitChoiceDisallowed && <span className="units not-clickable">{unitMark}</span>}
      <span id={`tooltip-${field}`} className="tooltip-trigger" />
      {unit === "cm" && (
        <input
          className="input_cm"
          type="text"
          value={viewValue}
          onChange={() => cmValueChanged(false)}
          onKeyDown={onKeyDown}
          onBlur={() => cmValueChanged(true)}
          ref={input}
          onFocus={onFocus}
          autoComplete="off"
          id="inputCentimeters"
        />
      )}
      {unit === "in" && (
        <span>
          <input
            className="input_in"
            type="text"
            value={wholeInchesViewValue}
            onChange={handleWholeInchesChange}
            onKeyDown={onWholeInchesKeyDown}
            onBlur={hideTooltip}
            ref={inputIn}
            onFocus={onFocus}
            autoComplete="off"
            id="inputInches"
          />
          {wholeInches > 0 && (
            <select
              className="input_in_partial"
              value={partialInches}
              onChange={handlePartialInchesChange}
            >
              {inchFractionOptions.map((fractionOptionName, fractionOptionKey) => (
                <option key={fractionOptionKey} value={fractionOptionKey}>
                  {fractionOptionName}
                </option>
              ))}
            </select>
          )}
        </span>
      )}
      <Tooltip
        anchorSelect={`#tooltip-${field}`}
        variant="light"
        place="bottom"
        isOpen={tooltipOpen}
        className="measurement-tooltip"
        render={renderTooltip}
      />
    </div>
  );
};

MeasurementInput.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  unit: PropTypes.string,
  fitRange: PropTypes.string,
  chooseUnit: PropTypes.func,
  unitChoiceDisallowed: PropTypes.bool,
  renderTooltip: PropTypes.func.isRequired,
};

MeasurementInput.defaultProps = {
  unit: "cm",
};

export default withTranslation()(MeasurementInput);
