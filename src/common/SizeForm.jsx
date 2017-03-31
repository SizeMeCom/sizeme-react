import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setProfileMeasurements } from "../api/sizeme-api";
import i18n from "../api/i18n";

class SizeForm extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};
        this.fields = props.fields.slice(0, props.max);
        this.fields.map((field) => this.state[field] = null);
        this.timeoutId = null;
    }

    componentWillUnmount () {
        clearTimeout(this.timeoutId);
    }

    getIntValue (value) {
        let intVal = parseInt(value);
        if (isNaN(intVal)) return null;
        return intVal > 0 && intVal < 1000 ? intVal : null;
    }

    getIntValues () {
        let values = {};
        this.fields.map(field => {
           values[field] = this.getIntValue(this.state[field]);
            if (values[field] !== null) values[field] = values[field] * 10; // cm -> mm
        });
        return values;
    }

    handleOnChange () {
        let measurements = this.getIntValues();
        this.props.onChange(measurements);
    }

    valueChanged (field, event) {
        this.setState({[field]: this.getIntValue(event.target.value)});
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.handleOnChange();
        }, 1000);
    }

    render () {
        return (
            <table className="measurement_input_table">
                <tbody>
                    <tr className="labels">
                        {this.fields.map(field => {
                            return <th key={field}>{i18n.MEASUREMENT[field]}</th>
                        })}
                    </tr>
                    <tr className="inputs">
                        {this.fields.map(field => {
                            return (
                                <td key={field}>
                                    <div>
                                        <span>cm</span>
                                        <input type="number" min="1" max="10000" step="1" name={field}
                                            value={this.state[field] || ""} onChange={event => { this.valueChanged(field, event); }}
                                        />
                                    </div>
                                </td>
                            )
                        })}
                    </tr>
                    <tr className="results">
                    </tr>
                </tbody>
            </table>
        )
    }
}

SizeForm.propTypes = {
    fields: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    max: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onChange: setProfileMeasurements
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SizeForm);
