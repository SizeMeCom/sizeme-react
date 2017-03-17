import React from "react";

class SizeForm extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};
        (props.fields || []).map((field) => this.state[field] = null);
        this.timeoutId = null;
    }

    getIntValue (value) {
        let intVal = parseInt(value);
        if (isNaN(intVal)) return null;
        return intVal > 0 && intVal < 1000 ? intVal : null;
    }

    getIntValues () {
        let values = {};
        this.props.fields.map(field => {
           values[field] = this.getIntValue(this.state[field]);
        });
        return values;
    }

    triggerFitUpdate () {
        console.log('Measurements', this.getIntValues());
    }

    valueChanged (field, event) {
        this.setState({[field]: this.getIntValue(event.target.value)});
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.triggerFitUpdate();
        }, 1000);
    }

    render () {
        return (
            <table className="measurement_input_table">
                <tbody>
                    <tr className="labels">
                        {this.props.fields.map(field => {
                            return <th key={field}>{field}</th>
                        })}
                    </tr>
                    <tr className="inputs">
                        {this.props.fields.map(field => {
                            return (
                                <td key={field}>
                                    <div>
                                        <span>cm</span>
                                        <input type="number" min="1" max="999" step="1" name={field}
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

export default SizeForm;
