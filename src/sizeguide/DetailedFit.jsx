import Optional from "optional-js";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { getResult } from "../api/ProductModel";

/*const inchFractionOptions = {
    0: "",
    1: "1/8",
    2: "1/4",
    3: "3/8",
    4: "1/2",
    5: "5/8",
    6: "3/4",
    7: "7/8",
};*/

const inchFractionOptions = {
    0: "",
    1: "⅛",
    2: "¼",
    3: "⅜",
    4: "½",
    5: "⅝",
    6: "¾",
    7: "⅞"
};

class DetailedFit extends React.Component {
    constructor (props) {
        super(props);
    }

    UNSAFE_componentWillMount () {
        this.updateState(this.props);
    }

    UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps.match !== this.props.match) {
            this.updateState(nextProps);
        }
    }

    updateState (props) {
        const matchOpt = Optional.ofNullable(props.match);
        const matchItem = matchOpt
            .map(m => m.matchMap[props.measurement])
            .orElse(null);

        const result = getResult(
            props.measurement,
            props.item.measurements[props.measurement],
            matchItem
        );

        this.setState({
            result
        });
    }

    convertToInches = (text) => {
        const precision = this.props.inchFractionsPrecision;
        const t = this.props.t;
        let textHolder = text;
        let prefixHolder = "";
        if (textHolder.includes("+")) {
            textHolder = textHolder.replace("+", "");
            prefixHolder = "+";
        }
        textHolder = textHolder.replace(" cm", "");
        textHolder = parseFloat(textHolder);
        
        let inchesWhole = Math.floor(Math.round(parseFloat(textHolder)/2.54*precision)/precision);
        let inchesPartial = Math.round((textHolder)/2.54*precision)-(inchesWhole*precision);

        if (inchesWhole == 0 && inchesPartial == 0) {
            return "0 " + t("common.in_short");
        }
        if (inchesWhole > 0) {
            return prefixHolder + inchesWhole + " " + inchFractionOptions[inchesPartial] + " " + t("common.in_short");
        } 
        return prefixHolder + inchFractionOptions[inchesPartial] + " " + t("common.in_short");
    }

    render () {
        const { fit, fitText, isLongFit } = this.state.result;
        const { t, measurement, num, measurementName, unit } = this.props;
        return (
            <div className="detailed-fit">
                <div className="measurement-head">
                    <span className="num">{num}</span>{measurementName(measurement)}
                </div>

                { unit == 0 && (<div className="overlap">{fitText}</div>) }
                { unit == 1 && (<div className="overlap">{this.convertToInches(fitText)}</div>)}

                {fit ? (
                    <div className={`fit-label ${fit.label}`}>
                        {isLongFit ?
                            t(`fitVerdictLong.${fit.label}`) : t(`fitVerdict.${fit.label}`)}
                    </div>
                ) : <div className="fit-label"/>}
            </div>
        );
    }
}

DetailedFit.propTypes = {
    num: PropTypes.number.isRequired,
    measurement: PropTypes.string.isRequired,
    match: PropTypes.object,
    item: PropTypes.object.isRequired,
    t: PropTypes.func,
    measurementName: PropTypes.func.isRequired,
    unit: PropTypes.number,
    inchFractionsPrecision: PropTypes.number
};

export default withTranslation()(DetailedFit);
