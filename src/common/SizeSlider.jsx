import React from "react";
import PropTypes from "prop-types";
import i18n from "../api/i18n";

const FIT_RANGES = [
    { start: 940, end: 1000, label: "too_small" },
    { start: 1000, end: 1055, label: "slim" },
    { start: 1055, end: 1110, label: "regular" },
    { start: 1110, end: 1165, label: "loose" },
    { start: 1165, end: 1225, label: "too_big" }
];

class SizeSlider extends React.Component {

    constructor (props) {
        super(props);
        this.sliderPosXMin = 940;
        this.sliderPosXMax = 1225;
        this.sliderScale = 100 / (this.sliderPosXMax - this.sliderPosXMin);
    }

    doShowFit () {
        return this.props.match && this.props.match.matchMap && this.props.match.accuracy > 0;
    }

    getFitValue () {
        return this.doShowFit() ? this.props.match.totalFit : null;
    }

    getFitRange () {
        if (!this.doShowFit() || !this.props.fitRangeVisible || Object.keys(this.props.match.matchMap).length <= 1) {
            return null;
        }

        const [min, max] = Object.values(this.props.match.matchMap).reduce(([min, max], match) => (
            [Math.min(min, match.componentFit), Math.max(max, match.componentFit)]
        ), [9999, 0]);

        return [Math.max(min, this.sliderPosXMin), Math.min(max, this.sliderPosXMax)];
    }

    sliderPos (fitValue) {
        return Math.max(0, (Math.min(fitValue, this.sliderPosXMax) - this.sliderPosXMin) * this.sliderScale);
    }

    areaPos (fitRange) {
        return Math.round(Math.min(this.sliderPosXMax, fitRange[0] - this.sliderPosXMin) * this.sliderScale);
    }

    areaWidth (fitRange) {
        const start = Math.round(Math.min(this.sliderPosXMax, fitRange[0] - this.sliderPosXMin) * this.sliderScale);
        const end = Math.round(Math.min(this.sliderPosXMax, fitRange[1] - this.sliderPosXMin) * this.sliderScale);
        return end - start;
        //return Math.round(Math.min(this.sliderPosXMax, fitRange[1] - fitRange[0]) * this.sliderScale);
    }

    render () {
        let percentWidth;
        const fitValue = this.getFitValue();
        const fitRange = this.getFitRange();
        return (
            <div className="sizeme_slider">
                <div className="slider_container">
                    {fitValue &&
                        <div className="slider_bar"
                             style={{
                                 width: this.sliderPos(fitValue) + "%",
                                 transition: "width 0.5s ease-in-out"
                             }}
                        />
                    }
                    {fitRange &&
                        <div className="slider_area"
                             style={{
                                 width: this.areaWidth(fitRange) + "%",
                                 marginLeft: this.areaPos(fitRange) + "%",
                                 transition: "width 0.5s ease-in-out, margin-left 0.5s ease-in-out"
                             }}
                        />
                    }
                    <table className="slider_table">
                        <tbody>
                            <tr>
                                {FIT_RANGES.map(fit => {
                                    percentWidth = (fit.end - fit.start) * this.sliderScale;
                                    return (
                                        <td
                                            key={fit.label} className={fit.label}
                                            style={{
                                                width: percentWidth + "%",
                                                minWidth: percentWidth + "%"
                                            }}
                                        >{i18n.FIT_VERDICT[fit.label]}</td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

SizeSlider.propTypes = {
    match: PropTypes.object,
    fitRangeVisible: PropTypes.bool
};

SizeSlider.defaultProps = {
    fitRangeVisible: false
};

export default SizeSlider;
