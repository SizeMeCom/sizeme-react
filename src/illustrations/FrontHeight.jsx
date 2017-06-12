import React from "react";
import PropTypes from "prop-types";

const cmFactor = 5;
const baseHeight = /* waist line Y */ 338.545 - /* shirt rect Y */ 162.204;

const FrontHeight = (props) => {
    const shirtHeight = Math.min(260, Math.max(115, props.overlap * cmFactor + baseHeight));
    const hemLine = /* shirt rect Y */ 162.204 + shirtHeight;
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
             viewBox="108 220 337.5 270" preserveAspectRatio="xMidYMin meet">
            <g>
                <polygon fill="#FFFFFF" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                         strokeMiterlimit="10" points="
		375.51,684.812 362.941,393.465 349.656,338.545 201.991,338.545 193.337,393.643 180.154,683.521 228.916,688.687 
		272.479,434.244 279.17,434.244 326.43,688.687"/>
                <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      d="M230.208,364.504c0,0-3.344,24.618-27.826,25.548"/>
                <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      d="M326.346,365.795c0,0,3.346,24.618,27.826,25.548"/>
                <circle fill="none" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                        cx="277.831"
                        cy="361.234" r="6.906"/>
                <line fill="none" stroke="#69A4C3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="3.704,7.408" x1="156.889" y1="338.545" x2="397.66" y2="338.545"/>
                <path fill="#FFFFFF" d="M201.992,338.545c0,0,3.652-39.295,2.652-54.406"/>
                <path fill="none" stroke="#69A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10" d="M201.992,338.545c0,0,3.652-39.295,2.652-54.406"/>
                <path fill="#FFFFFF" d="M349.348,338.545c0,0-3.652-39.295-2.652-54.406"/>
                <path fill="none" stroke="#69A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10" d="M349.348,338.545c0,0-3.652-39.295-2.652-54.406"/>
            </g>
            <rect x="185.552" y="162.204" fill="#FFFFFF" stroke="#69A4C3" strokeWidth="4" strokeLinecap="round"
                  strokeLinejoin="round" strokeMiterlimit="10" width="183.446" height={shirtHeight}/>
            <line fill="none" stroke="#69A4C3" strokeWidth="3.146" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="3.3258,6.6527" x1="156.889" y1={hemLine} x2="397.66" y2={hemLine}/>
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