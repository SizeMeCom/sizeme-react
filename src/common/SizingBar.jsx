import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import "./SizingBar.scss";
import ProductModel, { DEFAULT_OPTIMAL_FIT, fitRanges } from "../api/ProductModel";
import ReactTooltip from "react-tooltip";
import SizeSelector from "../api/SizeSelector";

const FitIndicator = (props) => {
    const left = `calc(${props.value}% - 9px`;
    const { selectedSize, t } = props;
    const size = SizeSelector.sizeMapper.filter(([size]) => size === selectedSize)
        .map(([_, sizeName]) => sizeName)[0] || "";
    return (
        <div>
            <svg className="indicator" style={{ left }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
                <polygon className={props.fitRange.label} points="5,0 10,10 0,10 5,0"
                         data-tip data-for="fitTooltip"/>
            </svg>
            <ReactTooltip id="fitTooltip" type="light" class="indicator-tooltip">
                <span dangerouslySetInnerHTML={{ __html: t("common.sizingBarFitTooltip", {
                    selectedSize: size
                }) }}/>
            </ReactTooltip>
        </div>
    );
};

FitIndicator.propTypes = {
    value: PropTypes.number.isRequired,
    fitRange: PropTypes.object.isRequired,
    selectedSize: PropTypes.string,
    t: PropTypes.func
};

const RecommendationIndicator = (props) => {
    const left = `calc(${props.value}% - 18px`;
    return (
        <div>
            <svg className="recommendation" style={{ left }} xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 20 10" data-tip data-for="recommendationTooltip">
                <path d="M10 5 L20 10 L0 10 Z" />
            </svg>
            <ReactTooltip id="recommendationTooltip" type="light" class="indicator-tooltip">
                {props.t("common.sizingBarRecommendationTooltip")}
            </ReactTooltip>
        </div>
    );
};

RecommendationIndicator.propTypes = {
    value: PropTypes.number.isRequired,
    t: PropTypes.func
};

class SizingBar extends React.Component {

    constructor (props) {
        super(props);
        this.ranges = fitRanges;
        this.calculateSliderPositions();
    }

    componentDidMount () {
        this.calculatePlaceholderSize();
    }

    componentDidUpdate () {
        this.calculatePlaceholderSize();
    }

    calculateSliderPositions () {
        let { fitRecommendation } = this.props;
        if (fitRecommendation <= 1000) {
            fitRecommendation = DEFAULT_OPTIMAL_FIT;
        }
        const regular = this.ranges.find(r => r.label === "regular");
        const rangeWidth = regular.end - regular.start;
        const regularMidPoint = regular.end - rangeWidth / 2;
        const scaledWidth = rangeWidth / ((regularMidPoint - 1000) / (fitRecommendation - 1000));
        this.sliderPosXMin = 1000 - scaledWidth;
        this.sliderPosXMax = this.ranges.slice(1).reduce((end, _) => end + scaledWidth, 1000);
        this.sliderScale = 100 / (this.sliderPosXMax - this.sliderPosXMin);
    }

    calculatePlaceholderSize () {
        if (!this.doShowFit() && this.placeholder) {
            const containerWidth = this.placeholder.parentNode.offsetWidth - 10;
            this.placeholder.style.transform = "scale(1)";
            const placeholderWidth = this.placeholder.offsetWidth;
            this.placeholder.style.transform = `scale(${Math.min(1.5, containerWidth / placeholderWidth)})`;
        }
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
        const { t, fitRecommendation, match, selectedSize, matchState } = this.props;
        const doShowFit = matchState === "match";
        let placeholderText = "";
        if (matchState === "no-fit") {
            placeholderText = t("common.sizingBarSplashNoFit");
        } else if (matchState === "no-size") {
            placeholderText = t("common.sizingBarSplashNoSize");
        }
        return (
            <div className="sizeme-slider">
                <div className="slider-placeholder">
                    <span ref={ref => { this.placeholder = ref; }}>
                        {placeholderText}
                    </span>
                </div>
                {this.ranges.map(fit => (
                    <div className={fit.label + " fit-area"} key={fit.label}>
                        {t(`sizingBarRangeLabel.${fit.label}`)}
                    </div>
                ))}
                {doShowFit && fitRecommendation > 1000 && <RecommendationIndicator t={t}
                    value={this.getFitPosition(fitRecommendation)}/>}
                {doShowFit && <FitIndicator value={this.getFitPosition(match.totalFit)} t={t}
                                                   fitRange={this.getFitRange()} selectedSize={selectedSize}/>}
            </div>
        );
    }
}

SizingBar.propTypes = {
    match: PropTypes.object,
    selectedSize: PropTypes.string,
    fitRecommendation: PropTypes.number,
    matchState: PropTypes.string.isRequired,
    t: PropTypes.func
};

export default translate()(SizingBar);
