import React from "react";
import PropTypes from "prop-types";

const cmFactor = 9.0;
const baseHeight = 330; // ankle bone line Y

const Outseam = (props) => {
  const sleeveHeight = cmFactor * Math.min(50, Math.max(-9, props.overlap)) + baseHeight;
  const arrowPositions = sleeveHeight > 360 ? "arrowsInside" : "arrowsOutside";
  return (
    <svg
      version="1.1"
      id="Layer_1"
      viewBox="175 250 254.5 225"
      preserveAspectRatio="xMaxYMin meet"
      className="outseam"
    >
      <defs>
        <marker
          id="triangleInsideOutseam"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          className="measurementLine"
          orient="auto-start-reverse"
        >
          <path className="noStroke" d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <marker
          id="triangleOutsideOutseam"
          viewBox="0 0 10 10"
          refX="1"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          className="measurementLine"
          orient="auto-start-reverse"
        >
          <path className="noStroke" d="M 0 5 L 10 0 L 10 10 z" />
        </marker>
      </defs>

      <path
        className="mainLine baseFill"
        d={`
	M339.36919,170.13897c-2.3987,42.05636 -8.48428,85.95539 -3.59805,133.05201c8.26218,20.37782
    1.42145,32.03004 1.73239,43.35707l-0.62188,48.77671l2.3987,24.65933c1.02167,16.90926 -7.8624,20.48622
    -11.3716,22.65407c-5.06392,2.27625 -12.57095,3.57696 -15.23617,-4.93187c-3.99783,11.32704
    -15.45827,7.3707 -20.07798,1.4633c-4.88624,5.58222 -18.43443,4.28151 -17.32392,-5.41963c-7.50703,7.3707
    -16.79088,3.46857 -17.94581,-4.4441c-15.59153,3.30598 -12.57095,-19.99845
    2.66522,-28.56147l18.07907,-55.17187c-10.26109,-20.21523 -5.10834,-24.17157
    -0.13326,-40.43047c-3.99783,-82.21585 -6.84073,-159.49983
    -7.95124,-241.76987l71.60556,-2.43884c0.08884,21.13657 1.82123,59.61597 -2.22102,109.20562z`}
      />
      <path
        className="mainLine noFill"
        d="M257.76906,423.50686c0.35536,-4.17312 2.30986,-7.85847 5.19718,-9.80954"
      />
      <path
        className="mainLine noFill"
        d="M275.67045,425.45793c0.48862,-5.63642 3.90899,-10.18891 8.3066,-11.05605"
      />
      <path
        className="mainLine noFill"
        d={`
                  M292.46133,427.84257c0.57746,-6.88294 5.41928,-11.869
                  10.79414,-11.11025c0.93283,0.10839 1.86565,0.43357 2.75406,0.86714`}
      />
      <path
        className="mainLine noFill"
        d={`
                  M312.22837,422.78424c1.37703,-6.82874 9.15059,-11.43543
                  17.36835,-10.2973c0.53304,0.0542 0.97725,0.16259 1.46587,0.27098`}
      />

      <rect className="mainLine overlayFill" x="245" y="0" width="100" height={sleeveHeight} />
      <line
        className="subLine noFill"
        strokeDasharray="3.3258,6.6527"
        x1="220"
        y1="330"
        x2="370"
        y2="330"
      />
      <line
        className="subLine noFill"
        strokeDasharray="3.3258,6.6527"
        x1="220"
        y1={sleeveHeight}
        x2="370"
        y2={sleeveHeight}
      />

      {/* measurement arrow line */}
      <path
        className={`measurementLine noFill ${arrowPositions}`}
        d={`
                M 360,330
                L 360, ${sleeveHeight}`}
      />
    </svg>
  );
};

Outseam.propTypes = {
  overlap: PropTypes.number,
};

Outseam.defaultProps = {
  overlap: 0,
};

export default Outseam;
