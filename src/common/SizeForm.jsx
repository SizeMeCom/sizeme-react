import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setProfileMeasurements } from "../api/sizeme-api";
import i18n from "../api/i18n";
import { humanMeasurementMap } from "../api/ProductModel";
import MeasurementInput from "./MeasurementInput.jsx";

class SizeForm extends React.Component {

    constructor (props) {
        super(props);
        this.fields = props.fields.slice(0, props.max).map(field => ({
            field,
            humanProperty: humanMeasurementMap.get(field)
        }));
        this.state = Object.assign(...this.fields.map(f => ({ [f.humanProperty]: null })));
        this.timeoutId = null;
    }

    componentWillUnmount () {
        clearTimeout(this.timeoutId);
    }

    getIntValue (value) {
        const intVal = parseInt(value, 10);
        if (isNaN(intVal)) return null;
        return intVal > 0 && intVal < 1000 ? intVal * 10 : null;
    }

    valueChanged (humanProperty) {
        return event => {
            this.setState({ [humanProperty]: this.getIntValue(event.target.value) });
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(() => {
                this.timeoutId = null;
                this.props.onChange(this.state);
            }, 1000);
        };
    }

    render () {
        return (
            <div className="measurement-input-table">
                {this.fields.map(({ field, humanProperty }) => (
                    <div key={field}>
                        <div className="label">{i18n.HUMAN_MEASUREMENTS[humanProperty]}</div>
                        <div className="input">
                            <span>cm</span>
                            <MeasurementInput onChange={() => {}} value={this.state[humanProperty]}/>

                            {/*<input type="number" min="1" max="1000" step="1" name={humanProperty}
                                   value={this.state[humanProperty] ? this.state[humanProperty] / 10.0 : ""}
                                   onChange={this.valueChanged(humanProperty)}
                            /> */}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

SizeForm.propTypes = {
    fields: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    max: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    onChange: setProfileMeasurements
}, dispatch);

export default connect(
    () => ({}),
    mapDispatchToProps
)(SizeForm);
