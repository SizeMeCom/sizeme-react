import React, { PropTypes } from "react";
import i18n from "../api/i18n";
import SizeGuideModel, { PINCHED_FITS, LONG_FITS } from "../api/ProductModel";
import Optional from "optional-js";
import ReactTooltip from "react-tooltip";

const measurementName = measurement => i18n.MEASUREMENT[measurement];

const isPinched = (measurement) => PINCHED_FITS.includes(measurement);


const getTooltip = (measurement, fitText, matchItem) => {
    let tootipText = "PLACEHOLDER";
    let tooltipClasses = [];
    if (!matchItem) {
        tootipText = `${i18n.FIT_INFO.the_item} 
            ${i18n.MEASUREMENT[measurement].toLowerCase()}
            ${i18n.FIT_INFO.the_measurement}
            ${i18n.COMMON.is} ${fitText}.`;

        if (isPinched(measurement)) {
            tooltipClasses.push("pinched");
        }

        if (measurement === "sleeve") {
            tooltipClasses.push("sleeve");
        }
    }
    return <div className={tooltipClasses.join(" ")}>{tootipText}</div>;
};

const getResult = (measurement, value, matchItem) => {
    let fitValue;
    let fit;
    let addPlus = false;
    if (matchItem && matchItem.componentFit > 0) {
        if (matchItem.overlap <= 0 && matchItem.componentFit >= 1000) {
            fitValue = 0;
        } else if (isPinched(measurement)) {
            fitValue = matchItem.overlap / 20.0;
        } else {
            fitValue = matchItem.overlap / 10.0;
        }
        addPlus = matchItem.overlap > 0;
        fit = SizeGuideModel.getFit(matchItem);
    } else if (value > 0) {
        fitValue = value / 10.0;
    }
    let txt = Optional.ofNullable(fitValue)
        .map(v => v.toFixed(1) + " cm")
        .orElse("");

    if (addPlus) {
        txt = "+" + txt;
    }

    return {
        txt,
        fit,
        tooltip: getTooltip(measurement, txt, matchItem)
    };
};

class DetailedFit extends React.Component {

    render () {
        const matchItem = Optional.ofNullable(this.props.match)
            .map(m => m.matchMap[this.props.measurement])
            .orElse(null);

        const result = getResult(
            this.props.measurement,
            this.props.item.measurements[this.props.measurement],
            matchItem
        );

        const verdict = Optional.ofNullable(result.fit)
            .map(fit => {
                const className = `fit-label ${fit.label}`;
                const label = LONG_FITS.includes(this.props.measurement) ? 
                    i18n.FIT_VERDICT_LONG[fit.label] : i18n.FIT_VERDICT[fit.label];
                return <div className={className}>{label}</div>;
            })
            .orElse(<div className="fit-label"/>);
        
        return (
            <div className="detailed-fit">
                <div className="measurement-head">
                    <span className="num">{this.props.num}</span>{measurementName(this.props.measurement)}
                </div>
                <div className="overlap">{result.txt}</div>
                {verdict}
                <ReactTooltip id={this.props.measurement} getContent={() => result.tooltip }/>
            </div>
        );
    }
}

DetailedFit.propTypes = {
    num: PropTypes.number.isRequired,
    measurement: PropTypes.string.isRequired,
    match: PropTypes.object,
    item: PropTypes.object.isRequired
};

export default DetailedFit;