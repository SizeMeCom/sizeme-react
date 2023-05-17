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

const measurementUnits = [
    {id: parseInt(0), name: i18n.t("common.cm_long")},
    {id: parseInt(1), name: i18n.t("common.in_long")}
];

const inchFractionOptions = [
    {id: 0, name: "-/-"},
    {id: 1, name: "1/8"},
    {id: 2, name: "1/4"},
    {id: 3, name: "3/8"},
    {id: 4, name: "1/2"},
    {id: 5, name: "5/8"},
    {id: 6, name: "3/4"},
    {id: 7, name: "7/8"},
];
/*
const inchFractions = {
    0: "-/-",
    1: "1/8",
    2: "1/4",
    3: "3/8",
    4: "1/2",
    5: "5/8",
    6: "3/4",
    7: "7/8",
};
const inchFractionOptions = [
    {id: 0, name: "-/-"},
    {id: 1, name: "⅛"},
    {id: 2, name: "¼"},
    {id: 3, name: "⅜"},
    {id: 4, name: "½"},
    {id: 5, name: "⅝"},
    {id: 6, name: "¾"},
    {id: 7, name: "⅞"},
];*/

class MeasurementInput extends React.Component {
    constructor (props) {
        super(props);
        const currValue = this.viewValue(this.props.value);
        this.state = {
            error: false,
            pending: false,
            value: currValue,
            valueWholeInches: this.props.value ? this.getInchesWhole(this.props.value) : "",
            valuePartialInches: this.props.value ? this.getInchesPartial(this.props.value) : "",
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
        if (value > 0) {
            const precision = this.props.inchFractionsPrecision;
            return Math.floor(Math.round(parseFloat(value)/25.4*precision)/precision);
        } 
        else return;
    }

    getInchesPartial = (value) => {
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
            let modelValueFromInches = parseInt(this.state.valueWholeInches) * unitFactors[this.props.unit] + parseInt(this.state.valuePartialInches) * 0.3175;
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

    handleUnitChange = (e, unit) => {
        this.props.chooseUnit(unit);
    };

    handleWholeInchesChange = (event) => {
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
                { unitChoiceDisallowed == 0 && (<>
                <span className="units" data-for="unit-tooltip-1" data-tip="custom show" data-event="click focus">{unitMarks[unit]}</span>
                <ReactTooltip id="unit-tooltip-1" className="unit-menu" globalEventOff="click"
                    place="right" type="light" effect="solid" clickable>
                    <div className="unit-list">
                        {measurementUnits.map(unit =>
                            <div id="unit-item" key={unit.id} value={unit.id} className={"unit-item" + (unit.id === this.props.unit ? " selected" : "")} onClick={(e) => this.handleUnitChange(e, unit.id)}>
                                <span className={"unit-name" + (unit.id === this.props.unit ? " selected" : "")}>{unit.name}</span>
                            </div>
                        )}
                    </div>
                </ReactTooltip>
                </>)}
                { unitChoiceDisallowed == 1 && (<span className="units-not-clickable">{unitMarks[unit]}</span>)}
                <span className="tooltip-trigger" data-for="input-tooltip" data-tip ref={el => {this.tooltip = el;}}
                   data-place="bottom" data-type="light" data-class="measurement-tooltip" data-effect="solid" 
                />
                {this.props.unit == 0 && this.state && (
                    <input className={className + " input_cm"} type="text" value={value} onChange={this.valueChanged}
                        onKeyDown={this.onKeyDown} onBlur={this.onBlur} ref={el => {this.input = el;}}
                        onFocus={this.onFocus} autoComplete="off" id="inputCentimeters"
                    />
                )}
                {this.props.unit == 1 && this.state && (
                    <span>
                        <input className={className + " input_in"} type="text" defaultValue={valueWholeInches} onChange={this.handleWholeInchesChange} 
                        onKeyDown={this.onKeyDown} onBlur={this.onBlur} ref={el => {this.input_in = el;}}
                        onFocus={this.onFocus} autoComplete="off" id="inputInches" />
                        <select className={className + " input_in_partial"} defaultValue={valuePartialInches || ""} onChange={this.handlePartialInchesChange}> 
                            {(inchFractionOptions || []).map((fractionOption) => (
                                <option key={fractionOption.id} value={fractionOption.id}>{fractionOption.name}</option>
                            ))}
                        </select>
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
