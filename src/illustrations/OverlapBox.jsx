import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Sleeve from "./Sleeve";
import Pinch from "./Pinch";
import Shoe from "./Shoe";
import FrontHeight from "./FrontHeight";
import "./OverlapBox.scss";

const illustration = (measurement, overlap) => {
    switch (measurement) {
        case "chest":
            return <Sleeve overlap={overlap}/>;

        case "frontHeight":
            return <FrontHeight overlap={overlap}/>;

        case "sleeve":
            return <Pinch overlap={overlap}/>;

        case "footLength":
            return <Shoe overlap={overlap}/>;

        default:
            return null;
    }
};

const isPinch = (measurement) => measurement === "chest";

class OverlapBox extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        ReactTooltip.rebuild();
    }

    render () {
        const overlap = this.props.fit.overlap / (isPinch(this.props.humanProperty) ? 20 : 10);

		/*
        return (
            <div className="overlap-box" data-tip data-for="fit-tooltip" 
			    data-effect="solid" data-place="bottom" onMouseEnter={this.props.hover}>
                <div className="overlap-svg">
                    {illustration(this.props.humanProperty, overlap)}
                </div>
                <div className="overlap-text">
                    <div>{overlap > 0 && "+"}{overlap.toFixed(1)} cm</div>
                </div>
            </div>
        );
    }
}

OverlapBox.propTypes = {
    fit: PropTypes.object.isRequired,
    humanProperty: PropTypes.string.isRequired,
    hover: PropTypes.func.isRequired
};

export default OverlapBox;