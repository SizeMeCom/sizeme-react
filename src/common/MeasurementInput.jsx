import React from "react";
import PropTypes from "prop-types";

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
    };

    onBlur = () => {
        if (!this.state.error) {
            this.props.onChange(this.modelValue());
            this.setState({ pending: false });
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
        return (
            <div className={className}>
                <span>{unitMarks[this.props.unit]}</span>
                <input type="text" value={this.state.value} onChange={this.valueChanged} onBlur={this.onBlur}/>
            </div>
        );
    }
}

MeasurementInput.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    unit: PropTypes.string
};

MeasurementInput.defaultProps = {
    unit: "cm"
};

export default MeasurementInput;