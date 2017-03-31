import React from "react";
import i18n from "../api/i18n";

const FIT_RANGES = [
    { start: 940, end: 1000, label: "too_small", arrowColor: "#999999" },
    { start: 1000, end: 1055, label: "slim", arrowColor: "#457A4C" },
    { start: 1055, end: 1110, label: "regular", arrowColor: "#42AE49" },
    { start: 1110, end: 1165, label: "loose", arrowColor: "#87B98E" },
    { start: 1165, end: 1225, label: "too_big", arrowColor: "#BB5555" }
];

class SizeSlider extends React.Component {

    constructor (props) {
        super(props);
        this.sliderPosXMin = 940;
        this.sliderPosXMax = 1225;
        this.sliderScale = 100 / (this.sliderPosXMax - this.sliderPosXMin);
    }

    getFitValue () {
        return this.props.match ? this.props.match.totalFit : null;
    }

    getFitRange () {
        if (!this.props.match || !this.props.match.matchMap || Object.keys(this.props.match.matchMap).length == 0) {
            return null;
        }
        let match, min = 9999, max = 0;
        for (const key of Object.keys(this.props.match.matchMap)) {
            match = this.props.match.matchMap[key];
            if (match.componentFit > max) max = match.componentFit;
            if (match.componentFit < min) min = match.componentFit;
        }
        return [Math.max(min, this.sliderPosXMin), Math.min(max, this.sliderPosXMax)];
    }

    sliderPos (fitValue) {
        return Math.max(0, (Math.min(fitValue, this.sliderPosXMax) - this.sliderPosXMin) * this.sliderScale);
    }

    areaPos (fitRange) {
        return Math.round(Math.min(this.sliderPosXMax, fitRange[0] - this.sliderPosXMin) * this.sliderScale);
    }

    areaWidth (fitRange) {
        let start = Math.round(Math.min(this.sliderPosXMax, fitRange[0] - this.sliderPosXMin) * this.sliderScale),
            end = Math.round(Math.min(this.sliderPosXMax, fitRange[1] - this.sliderPosXMin) * this.sliderScale);
        return end - start;
        //return Math.round(Math.min(this.sliderPosXMax, fitRange[1] - fitRange[0]) * this.sliderScale);
    }

    render () {
        let percentWidth,
            fitValue = this.getFitValue(),
            fitRange = this.getFitRange();
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
                                 transition: "width,margin-left 0.5s ease-in-out"
                             }}
                        ></div>
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
    match: React.PropTypes.object
};

export default SizeSlider;
