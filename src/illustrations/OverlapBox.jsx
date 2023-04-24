import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Sleeve from "./Sleeve";
import Outseam from "./Outseam";
import Pinch from "./Pinch";
import Shoe from "./Shoe";
import FrontHeight from "./FrontHeight";
import Chest from "./Chest";
import ShirtWaist from "./ShirtWaist";
import PantWaist from "./PantWaist";
import Hips from "./Hips";
import ShirtHips from "./ShirtHips";
import "./OverlapBox.scss";
import ProductModel from "../api/ProductModel";
import { withTranslation } from "react-i18next";

const illustration = (measurement, overlap, model) => {
    switch (measurement) {
        case "sleeve":
            return <Sleeve overlap={overlap}/>;
        case "frontHeight":
            return <FrontHeight overlap={overlap}/>;
        case "chest":
            return <Chest overlap={overlap}/>;
        case "pantWaist":
            return <PantWaist overlap={overlap}/>;
        case "hips":
            if (model.getItemTypeComponent(0) === 1) {
                return <ShirtHips overlap={overlap}/>;
            } else {
                return <Hips overlap={overlap}/>;
            }
        case "shirtWaist":
            return <ShirtWaist overlap={overlap}/>;
        case "thighCircumference":
        case "kneeCircumference":
        case "calfCircumference":
        case "ankleCircumference":
        case "headCircumference":
        case "neckCircumference":
            return <Pinch overlap={overlap}/>;

        case "outSeam":
            return <Outseam overlap={overlap}/>;

        case "footLength":
            return <Shoe overlap={overlap}/>;

        default:
            return null;
    }
};

const illustrationDivider = (measurement) => {
    switch (measurement) {
        case "chest":
        case "underbust":
        case "pantWaist":
        case "hips":
        case "shirtWaist":
        case "thighCircumference":
        case "kneeCircumference":
        case "calfCircumference":
        case "ankleCircumference":
        case "headCircumference":
            return 40;
        default:
            return 10;
    }
};

class OverlapBox extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        ReactTooltip.rebuild();
    }

    render () {
        const { fit, humanProperty, hover, t, model } = this.props;
        const overlap = fit.overlap / illustrationDivider(humanProperty);
        let className = "overlap-box";
        className += " "+ProductModel.getFit(fit).label;
        if (overlap <= 0) className += " no-overlap";

        return (
            <div className={className} data-tip data-for="fit-tooltip"
                 data-effect="solid" data-place="bottom" onMouseEnter={hover}>
                <div className="overlap-svg">
                    {illustration(humanProperty, overlap, model)}
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
    model: PropTypes.object.isRequired,
    t: PropTypes.func
};

export default withTranslation()(OverlapBox);
