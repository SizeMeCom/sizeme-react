import React from "react";
import PropTypes from "prop-types";

const sleeve = (overlap) => {
    const cmFactor = 6.3;
    const sleeveWidth = 65 + cmFactor * Math.min(9, Math.max(-9, overlap));
    return (
        <svg version="1.1" id="Layer_1" viewBox="298 260 250 124">
            <path fill="#FFFFFF" stroke="#69A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  strokeMiterlimit="10" d={`
	M336.456,301.489c0,0,21.167,1.167,29.667-2.167c8.5-3.333,18.166-8.833,33.333-18.5
	c15.167-9.666,57.55,6.04,70.8,2.997c8.153-2.541,8.935,10.536,2.206,11.335c0,0-30.61-2.347-40.673-2.998
	c-3.894-0.252-13.5-0.167-4,0c9.5,0.166,64,5,76.834,6c12.833,1,15.666,6.833,15.666,9.166
	c0,2.334-1.166,7.17-6.5,7.918c10.834,0.916,19.5,1.749,19.667,9.582c0.167,7.834-7.833,9.334-16.833,9.5
	c7,1.834,8.166,12.834-3.167,15.5c-11.333,2.667-20.173,2.505-27.667,3.167c7,1.667,9.334,11.167-2.333,13.667
	s-57.333,7-70.833,5.666c-13.5-1.333-41.834-9.833-47-11.5c-7.5,0.167-22.334,0-27.334,0.334
	c-5,0.333-134.166,7-134.166,7l-1.167-75.834L336.456,301.489z`}/>
            <path fill="#FFFFFF" d="M455.956,313.823c0,0,44.333,1.836,57.833,1.418"/>
            <path fill="none" stroke="#69A4C3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  strokeMiterlimit="10" d="M455.956,313.823c0,0,44.333,1.836,57.833,1.418"/>
            <path fill="#FFFFFF" d="M453.956,333.823c0,0,49.699,0.836,64.833,0.418"/>
            <path fill="none" stroke="#69A4C3" strokeWidth="4.235" strokeLinecap="round" strokeLinejoin="round"
                  strokeMiterlimit="10" d="M453.956,333.823c0,0,49.699,0.836,64.833,0.418"/>
            <path fill="#FFFFFF" d="M446.628,354.124c0,0,32.815-0.629,42.735-1.797"/>
            <path fill="none" stroke="#69A4C3" strokeWidth="3.439" strokeLinecap="round" strokeLinejoin="round"
                  strokeMiterlimit="10" d="M446.628,354.124c0,0,32.815-0.629,42.735-1.797"/>
            <rect x="297" y="277.819" fill="#FFFFFF" stroke="#69A4C3" strokeWidth="4" strokeLinecap="round"
                  strokeLinejoin="round" strokeMiterlimit="10" width={sleeveWidth} height="97.245"/>
            <line fill="none" stroke="#69A4C3" strokeWidth="3.146" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="3.3258,6.6527" x1="363" y1="265.278" x2="363" y2="388.661"/>
        </svg>
    );
};

const illustration = (measurement, overlap) => {
    switch (measurement) {
        case "sleeve":
            return sleeve(overlap);

        default: return null;
    }
};


const OverlapBox = (props) => (
    <div className="overlap-box">
        <div className="overlap-svg">
            {illustration("sleeve", props.overlap)}
        </div>
        <div className="overlap-text">
            <div>{props.overlap.toFixed(1)} cm</div>
        </div>
    </div>
);

OverlapBox.propTypes = {
    overlap: PropTypes.number
};

OverlapBox.defaultProps = {
    overlap: 0
};

export default OverlapBox;