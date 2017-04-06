import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setProfileMeasurements } from "../api/sizeme-api";
import i18n from "../api/i18n";

class SizeForm extends React.Component {

    constructor (props) {
        super(props);
        this.fields = props.fields.slice(0, props.max);
        this.state = Object.assign(...this.fields.map(f => ({ [f]: null })));
        this.timeoutId = null;
    }

    componentWillUnmount () {
        clearTimeout(this.timeoutId);
    }

    getIntValue (value) {
        const intVal = parseInt(value, 10);
        if (isNaN(intVal)) return null;
        return intVal > 0 && intVal < 1000 ? intVal : null;
    }

    valueChanged (field) {
        return event => {
            this.setState({ [field]: this.getIntValue(event.target.value) });
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
                {this.fields.map(field => (
                    <div key={field}>
                        <div className="label">{i18n.MEASUREMENT[field]}</div>
                        <div className="input">
                            <span>cm</span>
                            <input type="number" min="1" max="10000" step="1" name={field}
                                   value={this.state[field] || ""}
                                   onChange={this.valueChanged(field)}
                            />
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
