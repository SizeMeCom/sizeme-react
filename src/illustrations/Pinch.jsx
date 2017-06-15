import React from "react";
import PropTypes from "prop-types";

const transMatrix = (scaleX, cX, scaleY = 1, cY = 0) =>
    `matrix(${scaleX},0,0,${scaleY},${cX - scaleX * cX},${cY - scaleY * cY})`;

const cX = 490.922; // pinch loop start X
const zeroPinchLine = 486.743;
const maxPinchLine = 389.982;
const pinchLinePosRange = zeroPinchLine - maxPinchLine;

const Pinch = (props) => {
    const scale = props.overlap <= 0 ? 0 : Math.min(1, props.overlap / 10.0);
    const pinchLine = zeroPinchLine - scale * pinchLinePosRange;
    return (
        <svg version="1.1" viewBox="200 240 342 273.6" preserveAspectRatio="xMidYMin meet" className="pinch">
            <g>
                <path className="mainLine overlayFill"
				    d={`
			M144.546,481.84c0,0,77.175-39.67,88.715-67.8c11.54-28.129,32.457-115.401,49.767-126.221
			c17.31-10.818,73.569-29.571,94.485-34.62c20.917-5.049,87.994,49.767,102.42,57.701
			c7.934,6.491,14.425,35.342-13.704,31.735c-28.13-3.606-69.242-41.111-69.242-41.111s-30.293,5.77-38.226,18.752
			c-7.935,12.983-15.868,59.145-12.983,72.126c20.195,0.721,50.488-1.441,79.308-17.31
			c10.817-15.868,34.988-25.965,46.345-23.801c11.356,2.163,22.175,26.686,4.144,43.996c-18.031,17.312-57.701,
			44.481-78.617,81.385c-13.704,18.149-48.325,18.149-80.781,28.969c-32.457,10.819-83.667,52.651-113.238,77.896
			c-29.572,25.244-87.995,72.126-87.995,72.126L34.193,519.345L144.546,481.84z`}/>
                <path className="mainLine noFill"
				    d="M455,355,440,370,460,404,480,390" />
                <circle className="mainLine baseFill" cx="1288" cy="350" r="800"/>
                {scale > 0 &&
					<path className="mainLine noFill"
						transform={transMatrix(scale, cX)}
						d="M490.922,345.386h-59.967c-12.667,0-30.471-16.77-39.028-8.114c-8.56,
						8.655,12.36,11.606,39.028,8.114"/>
				}	
				{scale > 0 &&
					<path className="mainLine noFill"
						d="M476.423,344.657c0,0,12.57,0.209,13.093,12.81"/>
				}
				{scale > 0 &&
					<line className="subLine noFill"
						strokeDasharray="2.821,5.641"
						x1="486.743" y1="270" x2="486.743" y2="430"/>
				}
				{scale > 0 &&
					<line className="subLine noFill"
						strokeDasharray="2.821,5.641"
						x1={pinchLine} y1="270" x2={pinchLine} y2="430"/>
				}
            </g>
        </svg>
    );
};

Pinch.propTypes = {
    overlap: PropTypes.number
};

Pinch.defaultProps = {
    overlap: 0
};

export default Pinch;