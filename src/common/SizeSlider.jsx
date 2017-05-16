import React from "react";
import PropTypes from "prop-types";
import i18n from "../api/i18n";
import "./SizeSlider.scss";
import ProductModel, { fitRanges } from "../api/ProductModel";

const FitIndicator = (props) => {
    const left = `calc(${props.value}% - 8px`;
    return (
        <svg className="indicator" style={{ left }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
            <polygon className={props.fitRange.label} points="5,0 10,10 0,10 5,0" />
        </svg>
    );
};

FitIndicator.propTypes = {
    value: PropTypes.number.isRequired,
    fitRange: PropTypes.object.isRequired
};

const RecommendationIndicator = (props) => {
    const left = `calc(${props.value}% - 8px`;
    return (
        <svg className="recommendation" style={{ left }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
            <path d="M5 0 L10 10 L0 10 Z M5 2.2 L8.4 9.1 L1.6 9.1 Z" />
        </svg>
    );
};

RecommendationIndicator.propTypes = {
    value: PropTypes.number.isRequired
};

class SizeSlider extends React.Component {

    constructor (props) {
        super(props);
        this.sliderPosXMin = fitRanges[0].start;
        this.sliderPosXMax = fitRanges.slice(-1)[0].end;
        this.sliderScale = 100 / (this.sliderPosXMax - this.sliderPosXMin);
    }

    doShowFit () {
        return this.props.match && this.props.match.matchMap && this.props.match.accuracy > 0;
    }

    getFitPosition (value) {
        return Math.max(0,
            (Math.min(value, this.sliderPosXMax) - this.sliderPosXMin) * this.sliderScale);
    }

    getFitRange () {
        return ProductModel.getFit({ componentFit: this.props.match.totalFit, importance: 1 }, true);
    }

    render () {
        return (
            <div className="sizeme-slider">
                {fitRanges.map(fit => (
                    <div className={fit.label + " fit-area"} key={fit.label}>
                        {i18n.FIT_VERDICT[fit.label]}
                    </div>
                ))}
                {this.doShowFit() && <FitIndicator value={this.getFitPosition(this.props.match.totalFit)}
                                                   fitRange={this.getFitRange()}/>}
                {this.doShowFit() && this.props.recommendedMatch && <RecommendationIndicator
                    value={this.getFitPosition(this.props.recommendedMatch.totalFit)}/>}
            </div>
        );
    }
}

SizeSlider.propTypes = {
    match: PropTypes.object,
    recommendedMatch: PropTypes.object
};

export default SizeSlider;
