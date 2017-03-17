import React from "react";

const FIT_RANGES = [
    {start: 940, end: 1000, label: "too_small", arrowColor: "#999999"},
    {start: 1000, end: 1055, label: "slim", arrowColor: "#457A4C"},
    {start: 1055, end: 1110, label: "regular", arrowColor: "#42AE49"},
    {start: 1110, end: 1165, label: "loose", arrowColor: "#87B98E"},
    {start: 1165, end: 1225, label: "too_big", arrowColor: "#BB5555"}
];

class SizeSlider extends React.Component {

    constructor (props) {
        super(props);

        this.sliderPosXMin = 940;
        this.sliderPosXMax = 1225;
        this.sliderScale = 100 / (this.sliderPosXMax - this.sliderPosXMin);

        this.state = {fitValue: 1075};

        // Test
        setInterval(() => {
            this.setState({fitValue: Math.round(Math.random() * 200 + 1000)});
        }, 2000);
    }

    sliderPos (fitValue, offset = 0) {
        return Math.max(0, (Math.min(fitValue, this.sliderPosXMax) - this.sliderPosXMin) * this.sliderScale) + offset;
    }

    render () {
        let percentWidth, self = this;
        return (
            <div className="sizeme_slider">
                <div className="slider_container">
                    <div className="slider_bar"
                         style={{width:self.sliderPos(this.state.fitValue)+"%", transition:"width 0.5s ease-in-out"}}
                    ></div>
                    <div className="slider_area"></div>
                    <table className="slider_table">
                        <tbody>
                            <tr>
                                {FIT_RANGES.map((fit) => {
                                    percentWidth = (fit.end - fit.start) * self.sliderScale;
                                    return (
                                        <td
                                            key={fit.label} className={fit.label}
                                            style={{width:percentWidth+"%", minWidth:percentWidth+"%"}}
                                        >{fit.label}</td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default SizeSlider;
