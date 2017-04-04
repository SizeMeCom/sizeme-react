import React, { PropTypes } from "react";
import i18n from "../api/i18n";
import SizeGuideModel, { PINCHED_FITS, LONG_FITS } from "../api/ProductModel";
import Optional from "optional-js";

const measurementName = measurement => i18n.MEASUREMENT[measurement];

const isPinched = (measurement) => PINCHED_FITS.includes(measurement);

const getResult = (measurement, value, matchItem) => {
    let fitValue;
    let fit;
    let addPlus = false;
    const pinched = isPinched(measurement);
    if (matchItem && matchItem.componentFit > 0) {
        if (matchItem.overlap <= 0 && matchItem.componentFit >= 1000) {
            fitValue = 0;
        } else if (pinched) {
            fitValue = matchItem.overlap / 20.0;
        } else {
            fitValue = matchItem.overlap / 10.0;
        }
        addPlus = matchItem.overlap > 0;
        fit = SizeGuideModel.getFit(matchItem);
    } else if (value > 0) {
        fitValue = value / 10.0;
    }
    let fitText = Optional.ofNullable(fitValue)
        .map(v => v.toFixed(1) + " cm")
        .orElse("");

    if (addPlus) {
        fitText = "+" + fitText;
    }

    return {
        fitValue,
        fitText,
        fit,
        isPinched: pinched,
        isLongFit: LONG_FITS.includes(measurement)
    };
};

class DetailedFit extends React.Component {
    constructor (props) {
        super(props);
    }

    componentWillMount () {
        this.updateState(this.props);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.match !== this.props.match) {
            this.updateState(nextProps);
        }
    }

    updateState (props) {
        const matchOpt = Optional.ofNullable(props.match);
        const matchItem = matchOpt
            .map(m => m.matchMap[props.measurement])
            .orElse(null);

        const missingMeasurement = matchOpt
            .map(m => m.missingMeasurements.findIndex(([meas]) => meas === props.measurement) >= 0)
            .orElse(false);

        const result = getResult(
            props.measurement,
            props.item.measurements[props.measurement],
            matchItem
        );

        props.updateTooltip(props.measurement, { matchItem, missingMeasurement, ...result });

        this.setState({
            result
        });
    }

    render () {
        const { fit, fitText, isLongFit } = this.state.result;
        const { measurement, num } = this.props;
        return (
            <div className="detailed-fit">
                <div className="measurement-head">
                    <span className="num">{num}</span>{measurementName(measurement)}
                </div>

                <div className="overlap">{fitText}</div>

                {fit ? (
                    <div className={`fit-label ${fit.label}`}>
                        {isLongFit ?
                            i18n.FIT_VERDICT_LONG[fit.label] : i18n.FIT_VERDICT[fit.label]}
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
    updateTooltip: PropTypes.func.isRequired
};

export default DetailedFit;