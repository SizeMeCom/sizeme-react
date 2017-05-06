import React from "react";
import PropTypes from "prop-types";
import Sleeve from "./Sleeve";
import Pinch from "./Pinch";
import Shoe from "./Shoe";
import FrontHeight from "./FrontHeight";
import "./OverlapBox.scss";

const illustration = (measurement, overlap) => {
    switch (measurement) {
        case "sleeve":
            return <Sleeve overlap={overlap}/>;

        case "frontHeight":
            return <FrontHeight overlap={overlap}/>;

        case "chest":
            return <Pinch overlap={overlap}/>;

        case "footLength":
            return <Shoe overlap={overlap}/>;

        default:
            return null;
    }
};

const isPinch = (measurement) => measurement === "chest";

const OverlapBox = (props) => {
    const overlap = props.fit.overlap / (isPinch(props.humanProperty) ? 20 : 10);
    return (
        <div className="overlap-box">
            <div className="overlap-svg">
                {illustration(props.humanProperty, overlap)}
            </div>
            <div className="overlap-text">
                <div>{overlap > 0 && "+"}{overlap.toFixed(1)} cm</div>
            </div>
        </div>
    );
};

OverlapBox.propTypes = {
    fit: PropTypes.object.isRequired,
    humanProperty: PropTypes.string.isRequired
};

export default OverlapBox;