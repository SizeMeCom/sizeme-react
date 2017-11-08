import React from "react";
import PropTypes from "prop-types";

const cmFactor = 5;
const baseHeight = /* waist line Y */ 338.545 - /* shirt rect Y */ 162.204;

const FrontHeight = (props) => {
    const shirtHeight = Math.min(350, Math.max(115, props.overlap * cmFactor + baseHeight));
    const hemLine = /* shirt rect Y */ 162.204 + shirtHeight;
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="frontHeight"
             viewBox="108 220 337.5 270" preserveAspectRatio="xMidYMin meet">
            <g>
                <polygon className="mainLine baseFill"
                    points="
                        375.51,684.812 362.941,393.465 349.656,338.545 201.991,338.545
						193.337,393.643 180.154,683.521 228.916,688.687
		                272.479,434.244 279.17,434.244 326.43,688.687"/>
                <path className="mainLine noFill"
                    d="M230.208,364.504c0,0-3.344,24.618-27.826,25.548"/>
                <path className="mainLine noFill"
                    d="M326.346,365.795c0,0,3.346,24.618,27.826,25.548"/>
                <circle className="mainLine noFill"
                    cx="277.831"
                    cy="308.234"
                    r="2.534"/>
                <circle className="mainLine noFill"
                    cx="277.831"
                    cy="361.234"
                    r="6.906"/>
                <line className="subLine noFill"
                    strokeDasharray="3.704,7.408" x1="156.889" y1="338.545" x2="397.66" y2="338.545"/>
                <path className="mainLine noFill"
                    d="M201.992,338.545c0,0,3.652-39.295,2.652-119.406"/>
                <path className="mainLine noFill"
                    d="M349.348,338.545c0,0-3.652-39.295-2.652-119.406"/>
            </g>
            <rect className="mainLine overlayFill"
                x="185.552"
                y="162.204"
                width="183.446"
                height={shirtHeight}/>
            <line className="subLine noFill"
                strokeDasharray="3.3258,6.6527"
                x1="156.889"
                y1={hemLine}
                x2="397.66"
                y2={hemLine}/>
        </svg>
    );
};

FrontHeight.propTypes = {
    overlap: PropTypes.number
};

FrontHeight.defaultProps = {
    overlap: 0
};

export default FrontHeight;