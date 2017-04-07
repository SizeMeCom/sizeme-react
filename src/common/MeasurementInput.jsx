import React, { PropTypes } from "react";

class MeasurementInput extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            error: false,
            pending: false,
            value: this.props.value ? (this.props.value / 10.0).toFixed(1) : ""
        };
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
        if (newValue.length > 0 && isNaN(parseFloat(newValue.replace(",", ".")))) {
            newState.error = true;
        } else {
            newState.value = newValue;
        }

        this.setState(newState);
    };

    render () {
        return <input type="text" value={this.state.value} onChange={this.valueChanged}/>;
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