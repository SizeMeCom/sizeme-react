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

const pinch = (
    <svg version="1.1" id="Layer_1" viewBox="300 250 220 150" preserveAspectRatio="xMinYMin meet">
        <g>
            <line fill="none" stroke="#69A4C3" strokeWidth="2.742" strokeLinecap="round" strokeLinejoin="round"
                  x1="486.743" y1="274.398" x2="486.743" y2="275.769"/>
            <line fill="none" stroke="#69A4C3" strokeWidth="2.742" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="2.821,5.641" x1="486.743" y1="281.41" x2="486.743" y2="363.206"/>
            <line fill="none" stroke="#69A4C3" strokeWidth="2.742" strokeLinecap="round" strokeLinejoin="round"
                  x1="486.743" y1="366.027" x2="486.743" y2="367.398"/>
            <line fill="none" stroke="#69A4C3" strokeWidth="2.742" strokeLinecap="round" strokeLinejoin="round"
                  x1="389.982" y1="274.398" x2="389.982" y2="275.769"/>
            <line fill="none" stroke="#69A4C3" strokeWidth="2.742" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="2.821,5.641" x1="389.982" y1="281.41" x2="389.982" y2="363.206"/>
            <line fill="none" stroke="#69A4C3" strokeWidth="2.742" strokeLinecap="round" strokeLinejoin="round"
                  x1="389.982" y1="366.027" x2="389.982" y2="367.398"/>
            <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeMiterlimit="10" d={`
	M144.546,481.84c0,0,77.175-39.67,88.715-67.8c11.54-28.129,32.457-115.401,49.767-126.221
	c17.31-10.818,73.569-29.571,94.485-34.62c20.917-5.049,87.994,49.767,102.42,57.701
	c7.934,6.491,14.425,35.342-13.704,31.735c-28.13-3.606-69.242-41.111-69.242-41.111s-30.293,5.77-38.226,18.752
	c-7.935,12.983-15.868,59.145-12.983,72.126c20.195,0.721,50.488-1.441,61.308-17.31
	c10.817-15.868,34.988-25.965,46.345-23.801c11.356,2.163,22.175,26.686,4.144,43.996c-18.031,17.312-57.701,
	44.481-78.617,81.385c-13.704,18.149-48.325,18.149-80.781,28.969c-32.457,10.819-83.667,52.651-113.238,77.896
	c-29.572,25.244-87.995,72.126-87.995,72.126L34.193,519.345L144.546,481.84z`}/>
            <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeMiterlimit="10" d="M490.922,345.386h-59.967
		c-12.667,0-30.471-16.77-39.028-8.114c-8.56,8.655,12.36,11.606,39.028,8.114"/>
            <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeMiterlimit="10"
                  d="M527.306,239.361c0,0-61.308,43.997-33.179,308.7"/>
            <path fill="none" stroke="#68A4C3" strokeWidth="4" strokeMiterlimit="10"
                  d="M476.423,344.657c0,0,12.57,0.209,13.093,12.81"/>
        </g>
    </svg>
);

const illustration = (measurement, overlap) => {
    switch (measurement) {
        case "sleeve":
            return sleeve(overlap);

        case "pinch":
            return pinch;

        default:
            return null;
    }
};


const OverlapBox = (props) => (
    <div className="overlap-box">
        <div className="overlap-svg">
            {illustration("pinch", props.overlap)}
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