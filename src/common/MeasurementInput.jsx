import i18n from "i18next";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import "./SizeForm.scss";

const unitMarks = {
    0: i18n.t("common.cm_short"),
    1: i18n.t("common.in_short")
};

const unitFactors = {
    0: 10.0,
    1: 25.4
};

const inchFractionOptions = [
    {id: 0, name: "0/0"},
    {id: 1, name: "1/8"},
    {id: 2, name: "1/4"},
    {id: 3, name: "3/8"},
    {id: 4, name: "1/2"},
    {id: 5, name: "5/8"},
    {id: 6, name: "3/4"},
    {id: 7, name: "7/8"},
];

class MeasurementInput extends React.Component {
    constructor (props) {
        super(props);
        const currValue = this.viewValue(this.props.value);
        this.state = {
            error: false,
            pending: false,
            value: currValue,
            valueWholeInches: this.props.value ? this.getInchesWhole(this.props.value) : "",
            valuePartialInches: this.props.value ? this.getInchesPartial(this.props.value) : 0,
            modelValue: this.modelValue(currValue),
            showUnitSelector: true,
        };
    }

    UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.state.modelValue || nextProps.unit !== this.props.unit) {
            const value = this.viewValue(nextProps.value);
            if (value !== this.state.value) {
                this.setState({
                    value,
                    modelValue: this.modelValue(value),
                    valueWholeInches: this.getInchesWhole(nextProps.value),
                    valuePartialInches: this.getInchesPartial(nextProps.value)
                });
            }
        }
    }

    getInchesWhole = (value) => {
        if (isNaN(parseFloat(value))) return "";
        const precision = this.props.inchFractionsPrecision;
        return Math.floor(Math.round(parseFloat(value)/25.4*precision)/precision);

    }

    getInchesPartial = (value) => {
        if (isNaN(parseFloat(value))) return 0;
        const precision = this.props.inchFractionsPrecision;
        let inchesWhole = Math.floor(Math.round(parseFloat(value)/25.4*precision)/precision);
        let inchesPartial = Math.round(parseFloat(value)/25.4*precision)-(inchesWhole*precision);
        return inchesPartial;
    }

    viewValue (value) {
        return value ? (parseInt(value, 10) / 10.0).toFixed(1) : "";
    }

    modelValue (value) {
        let fixedValue = "";
        if (value.toString().includes(",")) {
            fixedValue = value.replace(",", ".");
        }
        else {
            fixedValue = value;
        }
        if (fixedValue === ".") {
            return 0;
        }
        else if (fixedValue.length > 0 && this.props.unit == 0) {
            return Math.round(parseFloat(fixedValue) * unitFactors[this.props.unit]);
        }
        else if (fixedValue.length > 0 && this.props.unit == 1 && this.state) {
            let modelValueFromInches = (parseInt(this.state.valueWholeInches) + (parseInt(this.state.valuePartialInches) / 8)) * unitFactors[this.props.unit];
            return Math.round(modelValueFromInches);
        }
        else {
            return null;
        }
    }

    valueChanged = (isBlur) => {
        ReactTooltip.hide(this.tooltip);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = null;
        }

        // because isBlur could be an event
        const blur = isBlur === true;

        let newValue = "";

        if (this.props.unit == 0) {
            newValue = this.input.value;
            if (newValue === this.state.value && !blur) {
                return;
            } else if (newValue.length > 0 && !newValue.match(/^\d*[,.]?\d*$/)) {
                return;
            }
            let newValueAsNumber = 0;
            if (newValue.includes(",")) {
                newValueAsNumber = parseFloat(newValue.replace(",", "."));
                newValueAsNumber = newValueAsNumber * 10;
            } else {
                newValueAsNumber = parseFloat(newValue);
                newValueAsNumber = newValueAsNumber * 10;
            }
            this.setState({ valueWholeInches: this.getInchesWhole(newValueAsNumber) });
            this.setState({ valuePartialInches: this.getInchesPartial(newValueAsNumber) });
        }
        else if (this.props.unit == 1) {
            const wholeInches = this.state.valueWholeInches;
            const partialInches = this.state.valuePartialInches;
            newValue = wholeInches * 2.54 + partialInches * 0.3175;

            if (isNaN(newValue)) {
                newValue = 0;
            }
            newValue = parseFloat(newValue).toFixed(1);
            newValue = newValue.toString();
            if (newValue === this.state.value && !blur) {
                return;
            }
        }

        const newState = {
            pending: true
        };

        if (isNaN(this.modelValue(newValue))) {
            newState.error = true;
        } else {
            newState.value = newValue;
        }

        this.setState(newState, () => {
            if (blur && this.props.unit == 0) {
                this.dispatchChange(true);
            }
            else if (blur && this.props.unit == 1){
                this.timeout = setTimeout(this.dispatchChange, 700);
            } else {
                this.timeout = setTimeout(this.dispatchChange, 1000);
            }
        });
    };

    dispatchChange = (setValue) => {
        if (!this.state.error) {
            const modelValue = this.modelValue(this.state.value);
            const doDispatch = modelValue !== this.state.modelValue;
            const state = { pending: false, modelValue };
            if (setValue) {
                state.value = this.viewValue(modelValue);
            }
            this.setState(state, () => {
                if (doDispatch) {
                    this.props.onChange(modelValue);
                }
            });
        }
    };

    onBlur = () => {
        ReactTooltip.hide(this.tooltip);
        if (this.props.unit == 0) {
            this.valueChanged(true);
        }
    };

    onFocus = () => {
        this.props.onFocus();
        this.tooltipTimeout = setTimeout(() => {ReactTooltip.show(this.tooltip);}, 200);
    };

    onKeyDown = e => {
        if (e.keyCode === 13) {
            this.input.blur();
            this.input_in.blur();
        }
    };

    isKeyAllowed(keyCode) {
        return (keyCode >= 48 && keyCode <= 57) // regular number keys
        || (keyCode >= 96 && keyCode <= 105) // numpad number keys
        || (keyCode === 8 || keyCode === 46) // backspace and delete keys
        || (keyCode === 37 || keyCode === 39) // left and right arrow keys
        || (keyCode === 9 || keyCode === 13); // tab and enter
    }

    onKeyDown2 = e => {
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            this.input.blur();
            this.input_in.blur();
        }
        if (!this.isKeyAllowed(e.keyCode)) {
            e.preventDefault();
        }
    };

    handleUnitChange = (newUnit) => {
        this.props.chooseUnit(newUnit);
    };

    handleWholeInchesChange = (event) => {
        if (event.target.value == "" || isNaN(parseInt(event.target.value))) {
            this.setState({ valueWholeInches: 0}, () => this.valueChanged(true));
            return;
        }
        let eventValue = parseInt(event.target.value);
        if (eventValue > 0) {
            this.setState({ valueWholeInches: eventValue}, () => this.valueChanged(true));
        }
        else {
            this.setState({ valueWholeInches: 0}, () => this.valueChanged(true));
        }

    };

    handlePartialInchesChange = (event) => {
        let eventValue = parseInt(event.target.value);
        if (eventValue > 0) {
            this.setState({ valuePartialInches: eventValue}, () => this.valueChanged(true));

        }
        else {
            this.setState({ valuePartialInches: 0}, () => this.valueChanged(true));
        }
    };

    hideIfZero = (value) => {
        if (value == 0) return "";
        return value;
    };

    render () {
        const { unit, unitChoiceDisallowed } = this.props;
        const { value, valueWholeInches, valuePartialInches } = this.state;
        let className = "measurement-input";
        if (this.state.error) {
            className += " measurement-input-error";
        } else if (this.props.value) {
            className += " measurement-input-ok";
        }
        if (this.state.pending) {
            className += " measurement-input-pending";
        }
        if (this.props.fitRange) {
            className += ` ${this.props.fitRange}`;
        }
        return (
            <div className={className}>
                { !unitChoiceDisallowed && (
                    <span className={"units yes-clickable"} onClick={() => this.handleUnitChange(1 - unit)}>{unitMarks[unit]}</span>
                )}
                { unitChoiceDisallowed && (<span className={"units not-clickable"}>{unitMarks[unit]}</span>)}
                <span className="tooltip-trigger" data-for="input-tooltip" data-tip ref={el => {this.tooltip = el;}}
                   data-place="bottom" data-type="light" data-class="measurement-tooltip" data-effect="solid"
                />
                {unit === 0 && this.state && (
                    <input className={className + " input_cm"} type="text" value={value} onChange={this.valueChanged}
                        onKeyDown={this.onKeyDown} onBlur={this.onBlur} ref={el => {this.input = el;}}
                        onFocus={this.onFocus} autoComplete="off" id="inputCentimeters"
                    />
                )}
                {unit === 1 && this.state && (
                    <span>
                        <input className={className + " input_in"} type="text" defaultValue={this.hideIfZero(valueWholeInches)} onChange={this.handleWholeInchesChange}
                        onKeyDown={this.onKeyDown2} onBlur={this.onBlur} ref={el => {this.input_in = el;}}
                        onFocus={this.onFocus} autoComplete="off" id="inputInches" />
                        {(valueWholeInches > 0) && (
                            <select className={className + " input_in_partial"} defaultValue={valuePartialInches} onChange={this.handlePartialInchesChange}>
                                {(inchFractionOptions || []).map((fractionOption) => (
                                    <option key={fractionOption.id} value={fractionOption.id}>{fractionOption.name}</option>
                                ))}
                            </select>
                        )}
                    </span>
                )}
            </div>
        );
    }
}

MeasurementInput.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    unit: PropTypes.number,
    fitRange: PropTypes.string,
    t: PropTypes.func.isRequired,
    chooseUnit: PropTypes.func,
    inchFractionsPrecision: PropTypes.number,
    unitChoiceDisallowed: PropTypes.number
};

MeasurementInput.defaultProps = {
    unit: 0
};

export default withTranslation()(MeasurementInput);
