import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Sleeve from "./Sleeve";
import Pinch from "./Pinch";
import Shoe from "./Shoe";
import FrontHeight from "./FrontHeight";
import "./OverlapBox.scss";
import ProductModel from "../api/ProductModel";
import { translate } from "react-i18next";

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

class OverlapBox extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        ReactTooltip.rebuild();
    }

    render () {
        const { fit, humanProperty, hover, t } = this.props;
        const overlap = fit.overlap / (isPinch(humanProperty) ? 20 : 10);

        return (
            <div className="overlap-box" data-tip data-for="fit-tooltip" 
			    data-effect="solid" data-place="bottom" onMouseEnter={hover}>
                <div className="overlap-svg">
                    {illustration(humanProperty, overlap)}
                </div>
                <div className="overlap-text">
                    <div>{overlap > 0 && "+"}{overlap.toFixed(1)} cm</div>
                </div>
                <div className="overlap-verdict">
                    <div>{t(`fitVerdict.${ProductModel.getFit(fit).label}`)}</div>
                </div>
            </div>
        );
    }
}

OverlapBox.propTypes = {
    fit: PropTypes.object.isRequired,
    humanProperty: PropTypes.string.isRequired,
    hover: PropTypes.func.isRequired,
    t: PropTypes.func
};

export default translate()(OverlapBox);