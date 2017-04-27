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
        this.state = {
            error: false,
            pending: false,
            value: this.viewValue(props)
        };
    }

    componentWillReceiveProps (nextProps) {
        const nextValue = this.viewValue(nextProps);
        if (nextValue !== this.state.value) {
            this.setState({ value: nextValue });
        }
    }

    viewValue (props) {
        return props.value ? (parseInt(props.value, 10) / unitFactors[props.unit]).toFixed(1) : "";
    }

    modelValue () {
        const value = this.state.value.replace(",", ".");
        if (value.length > 0) {
            return Math.floor(parseFloat(value) * unitFactors[this.props.unit]);
        } else {
            return null;
        }
    }

    valueChanged = (event) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        const newValue = event.target.value;
        if (newValue === this.state.value) {
            return;
        } else if (newValue.length > 0 && !newValue.match(/^\d+[,.]?\d*$/)) {
            return;
        }
        const newState = {
            pending: true
        };
        if (isNaN(this.modelValue())) {
            newState.error = true;
        } else {
            newState.value = newValue;
        }

        this.setState(newState);

        this.timeout = setTimeout(this.dispatchChange, 1000);
    };

    dispatchChange = () => {
        if (!this.state.error) {
            this.props.onChange(this.modelValue());
            this.setState({ pending: false });
        }
    };

    onBlur = () => {
        ReactTooltip.hide(this.tooltip);
        this.dispatchChange();
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
                   data-place="bottom" data-class="measurement-tooltip" data-effect="solid"
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