import React from "react";
import PropTypes from "prop-types";

const cmFactor = 6.3;
const baseWidth = 363; // waist line X

const Sleeve = (props) => {
    const sleeveWidth = cmFactor * Math.min(50, Math.max(-9, props.overlap)) + baseWidth;
    const arrowPositions = sleeveWidth > 393 ? "arrowsInside" : "arrowsOutside";
    return (
        <svg version="1.1" id="Layer_1" viewBox="298 226 250 200" preserveAspectRatio="xMaxYMin meet"
             className="sleeve">

            <defs>
                <marker id="triangleInsideSleeve"
                  viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6"
                  className="measurementLine"
                  orient="auto-start-reverse">
                  <path className="noStroke" d="M 0 0 L 10 5 L 0 10 z" />
                </marker>
                <marker id="triangleOutsideSleeve"
                  viewBox="0 0 10 10" refX="1" refY="5"
                  markerWidth="6" markerHeight="6"
                  className="measurementLine"
                  orient="auto-start-reverse">
                  <path className="noStroke" d="M 0 5 L 10 0 L 10 10 z" />
                </marker>
            </defs>

            <path className="mainLine baseFill"
                  d={`
	M336.456,301.489c0,0,21.167,1.167,29.667-2.167c8.5-3.333,18.166-8.833,33.333-18.5
	c15.167-9.666,57.55,6.04,70.8,2.997c8.153-2.541,8.935,10.536,2.206,11.335c0,0-30.61-2.347-40.673-2.998
	c-3.894-0.252-13.5-0.167-4,0c9.5,0.166,64,5,76.834,6c12.833,1,15.666,6.833,15.666,9.166
	c0,2.334-1.166,7.17-6.5,7.918c10.834,0.916,19.5,1.749,19.667,9.582c0.167,7.834-7.833,9.334-16.833,9.5
	c7,1.834,8.166,12.834-3.167,15.5c-11.333,2.667-20.173,2.505-27.667,3.167c7,1.667,9.334,11.167-2.333,13.667
	s-57.333,7-70.833,5.666c-13.5-1.333-41.834-9.833-47-11.5c-7.5,0.167-22.334,0-27.334,0.334
	c-5,0.333-134.166,7-134.166,7l-1.167-75.834L336.456,301.489z`}/>
            <path className="baseFill"
                  d="M455.956,313.823c0,0,44.333,1.836,57.833,1.418"/>
            <path className="mainLine noFill"
                  d="M455.956,313.823c0,0,44.333,1.836,57.833,1.418"/>
            <path className="baseFill"
                   d="M453.956,333.823c0,0,49.699,0.836,64.833,0.418"/>
            <path className="mainLine noFill"
                  d="M453.956,333.823c0,0,49.699,0.836,64.833,0.418"/>
            <path className="overlayFill"
                  d="M446.628,354.124c0,0,32.815-0.629,42.735-1.797"/>
            <path className="mainLine noFill"
                  d="M446.628,354.124c0,0,32.815-0.629,42.735-1.797"/>
            <rect className="mainLine overlayFill"
                  x="0" y="274"
                  width={sleeveWidth}
                  height="103"/>
            <line className="subLine noFill"
                  strokeDasharray="3.3258,6.6527"
                  x1="363" y1="259" x2="363" y2="394"/>
            <line className="subLine noFill"
                  strokeDasharray="3.3258,6.6527"
                  x1={sleeveWidth} y1="259" x2={sleeveWidth} y2="394"/>

            {/* measurement arrow line */}
            <path
                className={`measurementLine noFill ${arrowPositions}`}
                d={`
                M ${sleeveWidth}, 265
                L 363, 265`} />

        </svg>
    );
};

Sleeve.propTypes = {
    overlap: PropTypes.number
};

Sleeve.defaultProps = {
    overlap: 0
};

export default Sleeve;