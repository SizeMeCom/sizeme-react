import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

const unitMarks = {
    cm: "cm",
    in: "in"
};

const unitFactors = {
    cm: 10.0,
    in: 25.4
};

class MeasurementInput extends React.Component {
    constructor (props) {
        super(props);
        const currValue = this.viewValue(props.value);
        this.state = {
            error: false,
            pending: false,
            value: currValue,
            modelValue: this.modelValue(currValue)
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.state.modelValue || nextProps.unit !== this.props.unit) {
            const value = this.viewValue(nextProps.value);
            if (value !== this.state.value) {
                this.setState({
                    value,
                    modelValue: this.modelValue(value)
                });
            }
        }
    }

    viewValue (value) {
        return value ? (parseInt(value, 10) / unitFactors[this.props.unit]).toFixed(1) : "";
    }

    modelValue (value) {
        let fixedValue = value.replace(",", ".");
        if (fixedValue === ".") {
            return 0;
        } else if (fixedValue.length > 0) {
            return Math.round(parseFloat(fixedValue) * unitFactors[this.props.unit]);
        } else {
            return null;
        }
    }

    valueChanged = (isBlur) => {
        ReactTooltip.hide(this.tooltip);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        // because isBlur could be an event
        const blur = isBlur === true;

        const newValue = this.input.value;
        if (newValue === this.state.value && !blur) {
            return;
        } else if (newValue.length > 0 && !newValue.match(/^\d*[,.]?\d*$/)) {
            return;
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
            if (blur) {
                this.dispatchChange(true);
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
        this.valueChanged(true);
    };

    onFocus = () => {
        this.props.onFocus();
        ReactTooltip.show(this.tooltip);
    };

    onKeyDown = e => {
        if (e.keyCode === 13) {
            this.input.blur();
        }
    };

    render () {
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
                <span className="units">{unitMarks[this.props.unit]}</span>
                <span className="tooltip-trigger" data-for="input-tooltip" data-tip ref={el => {this.tooltip = el;}}
                   data-place="bottom" data-type="light" data-class="measurement-tooltip" data-effect="solid"
                />
                <input type="text" value={this.state.value} onChange={this.valueChanged}
                       onKeyDown={this.onKeyDown} onBlur={this.onBlur} ref={el => {this.input = el;}}
                       onFocus={this.onFocus} autoComplete="off"
                />
            </div>
        );
    }
}

MeasurementInput.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    unit: PropTypes.string,
    fitRange: PropTypes.string
};

MeasurementInput.defaultProps = {
    unit: "cm"
};

export default MeasurementInput;