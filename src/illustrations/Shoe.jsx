/* eslint-disable max-len */
import React from "react";
import PropTypes from "prop-types";

const cmFactor = -8;
const baseTrans = -24;

const Shoe = (props) => {
    const yTrans = Math.min(96, Math.max(-50, props.overlap * cmFactor + baseTrans));
    return (
        <svg viewBox="-50 100 210 168" preserveAspectRatio="xMinYMin meet">
            <g transform="rotate(90, 130.906, 113.741)">
                <line fill="none" stroke="#69A4C3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="3.285,6.57" x1="130.906" y1="113.741" x2="276.731" y2="113.741"/>
                <path fill="#FFFFFF" stroke="#68A4C3" strokeWidth="3.758" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10" d="&#10;&#9;&#9;M137,306.437c0,0-34.333-192.696,47.694-192.696c96.64,0,90.17,112.696,90.17,198.696"/>
            </g>
            <g transform={`rotate(90, 130.906, 113.741) translate(0 ${yTrans})`}>
                <line fill="none" stroke="#69A4C3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="3.285,6.57" x1="130.906" y1="136.496" x2="276.731" y2="136.496"/>
                <path fill="#FFFFFF" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10"
                      d="&#10;&#9;&#9;M163.039,286.953c-5-34-17.901-36.333-16.951-78c0.728-31.923,3.588-19.444,0.472-30.161c-3.923-13.497,0.706-35.748,12.773-39.902&#10;&#9;&#9;c15.668-5.394,16.706,5.396,17.373,15.396c2-10.666,10.333-15.763,15.666-15.048c5.334,0.715,13.461,6.152,12.667,15.048&#10;&#9;&#9;c0.88-9.86,22.295-2.947,23.683,15.428c7.984-5.428,25.415,3.572,21.033,22.239c8.284-2.667,17.856,1.738,12.847,23&#10;&#9;&#9;c-5.633,23.91,5.723,21.285,4.984,53.332c-0.738,32.047-16.606,76.763-16.606,76.763l-86.274,1L163.039,286.953z"/>
                <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10" d="&#10;&#9;&#9;M156.823,178.286c0,0,50.667-16,93,45.333"/>
                <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10" d="&#10;&#9;&#9;M169.49,172.62c0,0,7.431-7.946,7.216-21.333c0.295,18.419,0.833,19.11,3.808,25.3842"/>
                <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10" d="&#10;&#9;&#9;M195.511,178.053c0,0,8.743-12.434,9.528-23.767c-1.549,18.666-4.549,20.25-1.716,27.458"/>
                <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10" d="&#10;&#9;&#9;M216.211,187.87c0,0,10.409-10.395,12.511-20.156c-5.565,22.239-6.255,25.977-6.255,25.977"/>
                <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                      strokeMiterlimit="10" d="&#10;&#9;&#9;M235.662,204.097c0.304,0.319,11.69-6.144,14.093-12.144c-7.265,11.333-7.146,15.11-7.538,19.555"/>
            </g>
        </svg>
    );
};

Shoe.propTypes = {
    overlap: PropTypes.number
};

Shoe.defaultProps = {
    overlap: 0
};

export default Shoe;