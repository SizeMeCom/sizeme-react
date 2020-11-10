import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import "./SizingBar.scss";
import ProductModel, { DEFAULT_OPTIMAL_FIT, DEFAULT_OPTIMAL_STRETCH, fitRanges, stretchFactor } from "../api/ProductModel";
import ReactTooltip from "react-tooltip";
import SizeSelector from "../api/SizeSelector";

const getSizename = (selectedSize) =>
    SizeSelector.getSizeMapper().filter(([size]) => size === selectedSize)
        .map(([, sizeName]) => sizeName)[0] || selectedSize;

const getValueBasedFitLabel = (value) => {
    const labels = ["too_small","slim","regular","loose","too_big","too_big"];
    let labelKey = Math.floor(value / 20);
    return (labels[labelKey] !== "undefined" ? labels[labelKey] : "regular");
};

const FitIndicator = (props) => {
    const left = `calc(${props.value}% - 9px`;
    const { selectedSize, t } = props;
    return (
        <div>
            <svg className="indicator" style={{ left }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
                <polygon className={getValueBasedFitLabel(props.value)} points="5,0 10,10 0,10 5,0"
                         data-tip data-for="fitTooltip"/>
            </svg>
            <ReactTooltip id="fitTooltip" type="light" class="indicator-tooltip">
                <span className="size-recommendation"
                    dangerouslySetInnerHTML={{ __html: t("common.sizingBarFitTooltip", {
                        selectedSize: getSizename(selectedSize)
                    }) }}
                />
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

    static propTypes = {
        selectedSize: PropTypes.object,
        fitRecommendation: PropTypes.number,
        matchState: PropTypes.object,
        matchResult: PropTypes.object,
        t: PropTypes.func
    };

    constructor (props) {
        super(props);
        this.ranges = fitRanges;
        this.state = {
            newSize: false
        };
        this.calculateSliderPositions();
    }

    componentDidMount () {
        this.calculatePlaceholderSize();
    }

    componentWillUpdate (newProps) {
        const { size } = newProps.selectedSize;
        if (size !== this.props.selectedSize.size) {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.setState({ newSize: true });
        }
    }

    componentDidUpdate () {
        this.calculatePlaceholderSize();
        if (this.state.newSize) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => this.setState({ newSize: false }), 3000);
            }
        }
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
        this.sliderPosXMax = this.ranges.slice(1).reduce(end => end + scaledWidth, 1000);
        this.sliderScale = 100 / (this.sliderPosXMax - this.sliderPosXMin);
    }

    calculatePlaceholderSize () {
        if (this.placeholder) {
            const containerWidth = this.placeholder.parentNode.offsetWidth - 10;
            this.placeholder.style.transform = "scale(1)";
            const placeholderWidth = this.placeholder.offsetWidth;
            this.placeholder.style.transform = `scale(${Math.min(1, containerWidth / placeholderWidth)})`;
        }
    }

    getFitPosition (value,matchMap) {
        let { fitRecommendation } = this.props;
        if (fitRecommendation === 1000) {
            let maxStretch = DEFAULT_OPTIMAL_STRETCH;
            let newPos = 50;
            if (matchMap) {
                const maxStretchArr = [];
                const minStretchFactorArr = [];
                Object.entries(matchMap).forEach(([oKey, oValue]) => {
                    maxStretchArr.push( oValue.componentStretch / stretchFactor(oKey) );
                    minStretchFactorArr.push( stretchFactor(oKey) );
                });
                maxStretch = Math.max.apply(null, maxStretchArr);
                if (value > 1000) {
                    newPos = Math.min(100, 60 + ((value - 1000) / 55 * 40));
                } else if ((value <= 1000) && (value > 990)) {
                    const stretchBreakpoint = 2 * DEFAULT_OPTIMAL_STRETCH;
                    newPos = (maxStretch > stretchBreakpoint) ? Math.max(20, 40 - ((maxStretch - stretchBreakpoint) / (100 - stretchBreakpoint) * 20)) : Math.max(40, 60 - (maxStretch / stretchBreakpoint * 20));
                } else {
                    newPos = Math.max(0, 20 - ((1000 - value) / 55 * 20));
                }
            }
            return newPos;
        } else {
            return Math.max(0, (Math.min(value, this.sliderPosXMax) - this.sliderPosXMin) * this.sliderScale);
        }
    }

    getFitRange () {
        return ProductModel.getFit({ componentFit: this.props.matchState.match.totalFit, importance: 1 }, true);
    }

    render () {
        const { t, fitRecommendation, selectedSize, matchState, matchResult } = this.props;
        const { size, auto } = selectedSize;
        const { match, state } = matchState;
        const doShowFit = state === "match";
        let placeholderText = "";
        if (state === "match") {
            if (matchResult.recommendedFit) {
                placeholderText = t("common.sizingBarSplashMatch", {
                    sizeName: getSizename(matchResult.recommendedFit)
                });
            } else {
                placeholderText = t("common.sizingBarSplashNoFit");
            }
        } else if (state === "no-meas") {
            placeholderText = t("common.sizingBarSplashNoMeas");
        } else if (state === "no-fit") {
            placeholderText = t("common.sizingBarSplashNoFit");
        } else if (state === "no-size") {
            placeholderText = t("common.sizingBarSplashNoSize");
        }
        return (
            <div className={"sizeme-slider" + (this.state.newSize && auto ? " new-size" : "")}>
                <div className="slider-placeholder">
                    <span className="size-recommendation"
                        ref={ref => { this.placeholder = ref; }}
                        dangerouslySetInnerHTML={{ __html: placeholderText }}/>
                </div>
                {this.ranges.map(fit => (
                    <div className={fit.label + " fit-area"} key={fit.label}>
                        {t(`sizingBarRangeLabel.${fit.label}`)}
                    </div>
                ))}
                {doShowFit && fitRecommendation >= 1000 && <RecommendationIndicator t={t}
                    value={this.getFitPosition(fitRecommendation)}/>}
                {doShowFit && <FitIndicator value={this.getFitPosition(match.totalFit, match.matchMap)} t={t}
                                                   fitRange={this.getFitRange()} selectedSize={size}/>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    matchResult: state.match.matchResult,
    fitRecommendation: state.productInfo.product.item.fitRecommendation || 0,
    selectedSize: state.selectedSize,
    matchState: state.matchState
});

export default withTranslation()(connect(mapStateToProps)(SizingBar));
