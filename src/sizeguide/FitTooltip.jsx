import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import i18n from "../api/i18n";

const defaultFHHeight = 25;

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
        defaultHeight: defaultFHHeight,
        baseHeightFn: percentage => Math.min(
            105, Math.max(
                0, Math.round(defaultFHHeight + percentage * 9 / 0.05)
            )
        ),
        measTopFn: (height, arrows) => height - defaultFHHeight < 18 ?
            Math.max(height, defaultFHHeight) + (arrows ? 23 : 0) :
            Math.round(((height - defaultFHHeight) / 2) + defaultFHHeight - 9)
    }
};

const addSpecialTooltip = (measurement, fitData) => {
    const { fitText, matchItem } = fitData;
    if (!matchItem || !specialTooltipOptions[measurement]) {
        return null;
    }
    const { defaultHeight, baseHeightFn, measTopFn } = specialTooltipOptions[measurement];
    const classes = [measurement];
    let height = baseHeightFn(matchItem.percentage);
    const measDivStyle = {};

    if (matchItem.overlap < 0) {
        classes.push("negative-overlap");
        if (matchItem.componentFit >= 1000) {
            height = defaultHeight;
        }
    }
    measDivStyle.top = `${measTopFn(height, matchItem.overlap >= 0)}px`;
    
    return (
        <div className={classes.join(" ")}>
            <div className="meas" style={measDivStyle}>{fitText}</div>
            <div className={`${measurement}-overlap`} style={{ height: `${height + 23}px` }}/>
        </div>
    );
};

function getStretchedTxt (stretchValue) {
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
}

const overlapAndPinched = (fitData) => {
    const { matchItem, fitText, isPinched } = fitData;
    if (matchItem && matchItem.overlap > 0 && isPinched) {
        return (
            <div className="pinched">
                <div className="meas">{fitText.replace("+", "")}</div>
            </div>
        );
    } else {
        return null;
    }
};

const overlap = (fitData) => {
    const { matchItem, fitText, isPinched } = fitData;
    if (matchItem && matchItem.overlap > 0) {
        return (
            <span>{i18n.FIT_INFO.overlaps_you}
                <strong> {fitText}</strong>{isPinched && i18n.FIT_INFO.when_pinched}.
            </span>
        );
    } else {
        return null;
    }
};

const noOverlap = (fitData) => {
    const { matchItem, fitText, isPinched } = fitData;
    if (matchItem && matchItem.overlap <= 0) {
        if (matchItem.componentFit >= 1000) {
            return <span>{i18n.FIT_INFO.no_overlap} {getStretchedTxt(matchItem.componentStretch)}</span>;
        } else {
            return (
                <span dangerouslySetInnerHTML={{ __html: `${i18n.FIT_INFO.is_smaller}
                ${fitText.replace("-", "")}${isPinched ? (" " + i18n.FIT_INFO.when_pinched) : ""}.` }}/>
            );
        }
    } else {
        return null;
    }
};

const noMatchItem = (fitData) => {
    const { missingMeasurement, fitText, matchItem } = fitData;
    if (!matchItem) {
        return <span>{i18n.COMMON.is} {fitText}. {missingMeasurement ? i18n.MESSAGE.add_this_measurement : ""}</span>;
    } else {
        return null;
    }
};

const verdict = (fitData) => {
    const { matchItem, fit, isLongFit } = fitData;
    if (matchItem && matchItem.componentFit > 0) {
        const fitVerdict = isLongFit ? i18n.FIT_VERDICT_LONG[fit.label] : i18n.FIT_VERDICT[fit.label];
        return <span> {i18n.FIT_INFO.sm_considers_fit} <strong>{fitVerdict.toLowerCase()}</strong>.</span>;
    } else {
        return null;
    }
};

class FitTooltip extends React.Component {

    constructor (props) {
        super(props);
        this.defaultText = `${i18n.FIT_INFO.the_item} 
        ${i18n.MEASUREMENT[this.props.measurement].toLowerCase()} 
        ${i18n.FIT_INFO.the_measurement} `;
    }

    render () {
        const fitData = this.props.fitData;
        return (
            <ReactTooltip id={this.props.measurement}
                          place="right" className={`fit-tooltip ${this.props.measurement}`}>
                {overlapAndPinched(fitData)}
                {addSpecialTooltip(this.props.measurement, fitData)}
                {this.defaultText}
                {overlap(fitData)}
                {noOverlap(fitData)}
                {verdict(fitData)}
                {noMatchItem(fitData)}
            </ReactTooltip>
        );
    }
}

FitTooltip.propTypes = {
    measurement: PropTypes.string.isRequired,
    fitData: PropTypes.object.isRequired
};

export default FitTooltip;