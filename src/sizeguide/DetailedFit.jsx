import React, { PropTypes } from "react";
import i18n from "../api/i18n";
import SizeGuideModel, { PINCHED_FITS, LONG_FITS } from "../api/ProductModel";
import Optional from "optional-js";

const measurementName = measurement => i18n.MEASUREMENT[measurement];

const isPinched = (measurement) => PINCHED_FITS.includes(measurement);

const getStretchedTxt = (stretchValue) => {
    if (stretchValue > 0) {
        if (stretchValue < 25) {
            return i18n.FIT_INFO.stretched_little;
        } else if (stretchValue < 75) {
            return i18n.FIT_INFO.stretched_somewhat;
        } else if (stretchValue < 95) {
            return i18n.FIT_INFO.stretched_much;
        } else {
            return i18n.FIT_INFO.stretched_max;
        }
    }
    return "";
};

const specialTooltipOptions = {
    sleeve: {
        defaultHeight: 29,
        left: -7,
        baseHeightFn: percentage => Math.min(
            105, Math.max(
                11, Math.round(29 + percentage * 75 / 0.3)
            )
        ),
        measTopFn: height => height - 29 < 14 ? height + 23 : Math.round(((height - 29) / 2) + 29 - 9)
    },

    front_height: {
        defaultHeight: 28,
        left: -12,
        baseHeightFn: percentage => Math.min(
            105, Math.max(
                0, Math.round(25 + percentage * 9 / 0.05)
            )
        ),
        measTopFn: height => height - 25 < 12 ? height + 23 : Math.round(((height - 25) / 2) + 25 - 9)
    }
};

const addSpecialTooltip = (measurement, fitText, matchItem, options) => {
    const { defaultHeight, baseHeightFn, measTopFn, left } = options;
    const classes = [measurement];
    let height = baseHeightFn(matchItem.percentage);
    let measDivStyle;
    if (matchItem.overlap < 0) {
        classes.push("negative-overlap");
        measDivStyle = {
            top: "14px",
            left: "-7px"
        };
        if (matchItem.compomentFit >= 1000) {
            height = defaultHeight;
        }
    } else {
        const measTop = measTopFn(height);
        measDivStyle = {
            top: `${measTop}px`
        };
        if (matchItem.overlap >= 100) {
            measDivStyle.left = `${left}px`;
        }
    }

    return (
        <div className={classes.join(" ")}>
            <div className="meas" style={measDivStyle}>{fitText}</div>
            <div className={`${measurement}-overlap`} style={{ height: `${height + 23}px` }}/>
        </div>
    );
};

const getTooltip = (measurement, fitText, matchItem, verdict) => {
    let tooltipText = `${i18n.FIT_INFO.the_item} 
            ${i18n.MEASUREMENT[measurement].toLowerCase()}
            ${i18n.FIT_INFO.the_measurement}`;
    let tooltipText2 = "";
    const tooltipClasses = [];
    let specialTooltip = "";
    let fitVerdict = "";

    if (!matchItem) {
        tooltipText = `${tooltipText} ${i18n.COMMON.is} ${fitText}.`;
    } else {
        specialTooltip = Optional.ofNullable(specialTooltipOptions[measurement])
            .map(o => addSpecialTooltip(measurement, fitText, matchItem, o))
            .orElse("");

        if (matchItem.overlap <= 0) {
            if (matchItem.componentFit >= 1000) {
                tooltipText = `${tooltipText} ${i18n.FIT_INFO.no_overlap} ${getStretchedTxt(
                    matchItem.componentStretch
                )}`;
            } else {
                tooltipText = `${tooltipText} ${i18n.FIT_INFO.is_smaller} ${fitText.replace("-", "")}
                    ${(isPinched(measurement) ? i18n.FIT_INFO.when_pinched : "")}`;
            }
        }

        if (matchItem.componentFit > 0) {
            tooltipText2 = <span>{i18n.FIT_INFO.sm_considers_fit} <b>{verdict.toLowerCase()}</b></span>;
        }
    }

    if (isPinched(measurement)) {
        tooltipClasses.push("pinched");
    }

    if (measurement === "sleeve") {
        tooltipClasses.push("sleeve");
    }
    return <div className={tooltipClasses.join(" ")}>{specialTooltip} {tooltipText} {tooltipText2}</div>;
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
        tooltip: getTooltip(measurement, txt, matchItem, "slim")
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
        const matchItem = Optional.ofNullable(props.match)
            .map(m => m.matchMap[props.measurement])
            .orElse(null);

        const result = getResult(
            props.measurement,
            props.item.measurements[props.measurement],
            matchItem
        );

        const verdict = Optional.ofNullable(result.fit)
            .map(fit => {
                const className = `fit-label ${fit.label}`;
                const label = LONG_FITS.includes(props.measurement) ?
                    i18n.FIT_VERDICT_LONG[fit.label] : i18n.FIT_VERDICT[fit.label];
                return <div className={className}>{label}</div>;
            })
            .orElse(<div className="fit-label"/>);

        props.updateTooltip(props.measurement, result.tooltip);

        this.setState({
            result, verdict
        });
    }

    render () {
        return (
            <div className="detailed-fit">
                <div className="measurement-head">
                    <span className="num">{this.props.num}</span>{measurementName(this.props.measurement)}
                </div>
                <div className="overlap">{this.state.result.txt}</div>
                {this.state.verdict}
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