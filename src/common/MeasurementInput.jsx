import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { trackEvent } from "../api/ga";
import "./MeasurementInput.scss";

const unitMarks = {
    cm: "cm",
    in: "in"
};

const unitFactors = {
    cm: 10.0,
    in: 25.4
};

class MeasurementInput extends React.Component {

    static propTypes = {
        initialValue: PropTypes.number,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        changeUnit: PropTypes.func,
        unit: PropTypes.string,
        fitRange: PropTypes.string
    };

    static defaultProps = {
        unit: "cm"
    };

    static parseInput = inputValue => {
        let fixed = inputValue.replace(",", ".");
        if (fixed === ".") {
            return 0;
        } else if (fixed.length > 0) {
            return parseFloat(fixed);
        } else {
            return null;
        }
    };

    static toSIValue = modelValue => modelValue ?
        {
            input: (modelValue / unitFactors.cm).toFixed(1)
        } :
        {
            input: ""
        };

    static fromSIValue = inputValue => {
        let value = MeasurementInput.parseInput(inputValue.input);
        if (value != null) {
            return Math.round(value * unitFactors.cm);
        } else {
            return null;
        }
    };


    static toImperialValue = modelValue => modelValue ?
        {
            input: Math.floor(modelValue / unitFactors.in).toFixed(0),
            fraction: Math.round(8 * ((modelValue / unitFactors.in) % 1)).toFixed(0)
        } :
        {
            input: "",
            fraction: "0"
        };
    static fromImperialValue = inputValue => {
        let value = MeasurementInput.parseInput(inputValue.input);
        if (value != null) {
            return Math.round((value + inputValue.fraction / 8) * unitFactors.in);
        }
    };

    static getDerivedStateFromProps (props, state) {
        let newState = null;
        if (props.unit !== state.unit || props.initialValue !== state.initialValue) {
            const value = props.initialValue;

            newState = {
                error: isNaN(value) || (props.unit !== "cm" && props.unit !== "in"),
                pending: false,
                unit: props.unit,
                initialValue: props.initialValue
            };

            if (!newState.error) {
                newState.modelValue = Math.floor(value);
                if (props.unit === "cm") {
                    newState.inputValue = MeasurementInput.toSIValue(newState.modelValue);
                } else {
                    newState.inputValue = MeasurementInput.toImperialValue(newState.modelValue);
                }
            }
        }
        return newState;
    }

    constructor (props) {
        super(props);
        console.log(props);
        this.state = MeasurementInput.getDerivedStateFromProps(props, {});
    }

    valueChanged = isBlur => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        const inputValue = {
            input: this.valueInput.value,
            fraction: "0"
        };
        let modelValue;

        if (this.props.unit === "cm") {
            if (!inputValue.input.match(/^\d*[,.]?\d*$/)) {
                return;
            }
            modelValue = MeasurementInput.fromSIValue(inputValue);
        } else {
            if (!inputValue.input.match(/^\d+$/)) {
                return;
            }
            modelValue = MeasurementInput.fromImperialValue(inputValue);
        }

        const newState = {
            pending: true
        };

        if (isNaN(modelValue)) {
            newState.error = true;
        } else {
            newState.error = false;
            newState.inputValue = inputValue;
            newState.modelValue = modelValue;
        }

        // isBlur could be an event
        const blur = isBlur === true;

        this.setState(newState, () => {
            if (blur) {
                this.dispatchChange(true);
            } else {
                this.timeout = setTimeout(this.dispatchChange, 1000);
            }
        });
    };

    dispatchChange = (setValue) => {
        if (!this.state.error) {
            const state = {
                pending: false
            };
            if (setValue) {
                if (this.props.unit === "cm") {
                    state.inputValue = MeasurementInput.toSIValue(this.state.modelValue);
                } else {
                    state.inputValue = MeasurementInput.toImperialValue(this.state.modelValue);
                }
            }
            this.setState(state, () => {
                this.props.onChange && this.props.onChange(this.state.modelValue);
                trackEvent("measurementEntered", "Store: Measurement entered or changed in input field");
            });
        }
    };

    onBlur = () => {
        this.valueChanged(true);
    };

    onFocus = () => {
        this.props.onFocus && this.props.onFocus();
    };

    onKeyDown = e => {
        if (e.keyCode === 13) {
            this.valueInput.blur();
        }
    };

    selectCm = () => {
        if (this.props.unit !== "cm") {
            this.props.changeUnit("cm");
        }
    };

    selectInches = () => {
        if (this.props.unit !== "in") {
            this.props.changeUnit("in");
        }
    };

    render () {
        const classNames = ["measurement-input", "measurement-units-" + this.props.unit];
        if (this.state.error) {
            classNames.push("measurement-input-error");
        } else if (this.state.modelValue) {
            classNames.push("measurement-input-ok");
        }
        if (this.state.pending) {
            classNames.push("measurement-input-pending");
        }
        if (this.props.fitRange) {
            classNames.push(this.props.fitRange);
        }

        return (
            <div className={classNames.join(" ")}>
                <span className="units" data-tip={true} data-for="unit-selector" data-event="click">{unitMarks[this.props.unit]}</span>
                {this.props.unit === "in" && <span className="fractions">½</span>}
                <ReactTooltip id="unit-selector" class="unit-selector" globalEventOff="click"
                    place="right" type="light" effect="solid">
                    <>
                        <div className={`unit ${this.props.unit === "cm" ? "selected" : ""}`}
                            onClick={this.selectCm}>centimeters</div>
                        <div className={`unit ${this.props.unit === "in" ? "selected" : ""}`}
                            onClick={this.selectInches}>inches</div>
                    </>
                </ReactTooltip>
                <input type="text" value={this.state.inputValue.input} onChange={this.valueChanged}
                    onKeyDown={this.onKeyDown} onBlur={this.onBlur} ref={el => {this.valueInput = el;}}
                    onFocus={this.onFocus} autoComplete="off"
                />
            </div>
        );
    }
}

export default MeasurementInput;
