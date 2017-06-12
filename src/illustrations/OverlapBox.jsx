import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Sleeve from "./Sleeve";
import Pinch from "./Pinch";
import Shoe from "./Shoe";
import FrontHeight from "./FrontHeight";
import "./OverlapBox.scss";

const illustration = (measurement, overlap, colorScheme) => {
    switch (measurement) {
        case "sleeve":
            return <Sleeve overlap={overlap} colorScheme={colorScheme}/>;

        case "frontHeight":
            return <FrontHeight overlap={overlap} colorScheme={colorScheme}/>;

        case "chest":
            return <Pinch overlap={overlap} colorScheme={colorScheme}/>;

        case "footLength":
            return <Shoe overlap={overlap} colorScheme={colorScheme}/>;

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
        const colorScheme = {
            mainLine: { color: "#666666", width: "6" },
            subLine: { color: "#333333", width: "4" },
            baseFill: { color: "#CCCCCC", fillOpacity: "1" },
            overlayFill: { color: "#FFFFFF", fillOpacity: "0.9" }
        };
		*/
        const colorScheme = {
            mainLine: { color: "#FF0000", width: "6" },
            subLine: { color: "#00FF00", width: "4" },
            baseFill: { color: "#0000FF", fillOpacity: "1" },
            overlayFill: { color: "#CC00CC", fillOpacity: "0.5" }
        };

        return (
            <div className="overlap-box" data-tip data-for="fit-tooltip" onMouseEnter={this.props.hover}>
                <div className="overlap-svg">
                    {illustration(this.props.humanProperty, overlap, colorScheme)}
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