/* eslint-disable max-len */
import React from "react";
import PropTypes from "prop-types";

const cmFactor = 12;
const baseTrans = -24;

const Shoe = (props) => {
  const yTrans = Math.min(96, Math.max(-50, props.overlap * cmFactor + baseTrans));
  const arrowPositions = yTrans > 5 ? "arrowsInside" : "arrowsOutside";
  return (
    <svg viewBox="-30 96 190 157" preserveAspectRatio="xMinYMin meet" className="shoe">
      <defs>
        <marker
          id="triangleInsideShoe"
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
          id="triangleOutsideShoe"
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

      <g transform="rotate(90, 130.906, 113.741)">
        <path
          className="mainLine baseFill"
          d="&#10;&#9;&#9;M139,306.437c0,0-20.333-192.696,24.694-192.696c131.64,0,108.17,112.696,108.17,198.696"
        />
      </g>
      <g transform={`rotate(90, 130.906, 113.741) translate(0 ${yTrans})`}>
        <path
          className="mainLine overlayFill"
          d="&#10;&#9;&#9;M163.039,286.953c-5-34-17.901-36.333-16.951-78c0.728-31.923,3.588-19.444,0.472-30.161c-3.923-13.497,0.706-35.748,12.773-39.902&#10;&#9;&#9;c15.668-5.394,16.706,5.396,17.373,15.396c2-10.666,10.333-15.763,15.666-15.048c5.334,0.715,13.461,6.152,12.667,15.048&#10;&#9;&#9;c0.88-9.86,22.295-2.947,23.683,15.428c7.984-5.428,25.415,3.572,21.033,22.239c8.284-2.667,17.856,1.738,12.847,23&#10;&#9;&#9;c-5.633,23.91,5.723,21.285,4.984,53.332c-0.738,32.047-16.606,76.763-16.606,76.763l-86.274,1L163.039,286.953z"
        />
        <path
          className="mainLine noFill"
          d="&#10;&#9;&#9;M156.823,178.286c0,0,50.667-16,93,45.333"
        />
        <path
          className="mainLine noFill"
          d="&#10;&#9;&#9;M169.49,172.62c0,0,7.431-7.946,7.216-21.333c0.295,18.419,0.833,19.11,3.808,25.3842"
        />
        <path
          className="mainLine noFill"
          d="&#10;&#9;&#9;M195.511,178.053c0,0,8.743-12.434,9.528-23.767c-1.549,18.666-4.549,20.25-1.716,27.458"
        />
        <path
          className="mainLine noFill"
          d="&#10;&#9;&#9;M216.211,187.87c0,0,10.409-10.395,12.511-20.156c-5.565,22.239-6.255,25.977-6.255,25.977"
        />
        <path
          className="mainLine noFill"
          d="&#10;&#9;&#9;M235.662,204.097c0.304,0.319,11.69-6.144,14.093-12.144c-7.265,11.333-7.146,15.11-7.538,19.555"
        />
        <line
          className="subLine noFill"
          strokeDasharray="3.285,6.57"
          x1="120.906"
          y1="136.496"
          x2="286.731"
          y2="136.496"
        />
      </g>
      <g transform="rotate(90, 130.906, 113.741)">
        <line
          className="subLine noFill"
          strokeDasharray="3.285,6.57"
          x1="120.906"
          y1="113.741"
          x2="286.731"
          y2="113.741"
        />
      </g>
      {/* measurement arrow line */}
      <g transform="rotate(90, 130.906, 113.741)">
        <path
          className={`measurementLine noFill ${arrowPositions}`}
          d={`
                    M 126, ${135.496 + yTrans}
                    L 126, 115.496`}
        />
      </g>
    </svg>
  );
};

Shoe.propTypes = {
  overlap: PropTypes.number,
};

Shoe.defaultProps = {
  overlap: 0,
};

export default Shoe;
