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

    valueChanged (humanProperty) {
        return value => {
            this.setState({ [humanProperty]: value }, () => {
                this.props.onChange(this.state);
            });
        };
    }

    render () {
        return (
            <div className="measurement-input-table">
                {this.fields.map(({ field, humanProperty }) => (
                    <div key={field}>
                        <div className="label">{i18n.HUMAN_MEASUREMENTS[humanProperty]}</div>
                        <MeasurementInput onChange={this.valueChanged(humanProperty)} unit="cm"
                                              value={this.state[humanProperty]}/>
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
