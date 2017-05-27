import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { translate } from "react-i18next";

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

function getStretchedTxt (stretchValue, t) {
    if (stretchValue > 0) {
        if (stretchValue < 25) {
            return t("fitInfo.stretchedLittle");
        } else if (stretchValue < 75) {
            return t("fitInfo.stretchedSomewhat");
        } else if (stretchValue < 95) {
            return t("fitInfo.stretchedMuch");
        } else {
            return t("fitInfo.stretchedMax");
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

const overlap = (fitData, t) => {
    const { matchItem, fitText, isPinched } = fitData;
    if (matchItem && matchItem.overlap > 0) {
        return (
            <span>{t("fitInfo.overlapsYou")}
                <strong> {fitText}</strong>{isPinched && t("fitInfo.whenPinched")}.
            </span>
        );
    } else {
        return null;
    }
};

const noOverlap = (fitData, t) => {
    const { matchItem, fitText, isPinched } = fitData;
    if (matchItem && matchItem.overlap <= 0) {
        if (matchItem.componentFit >= 1000) {
            return <span>{t("fitInfo.noOverlap")} {getStretchedTxt(matchItem.componentStretch)}</span>;
        } else {
            return (
                <span dangerouslySetInnerHTML={{ __html: t("fitInfo.isSmaller", {
                    value: fitText.replace("-", ""),
                    whenPinched: isPinched ? t("fitInfo.whenPinched") : " "
                }) + "." }}/>
            );
        }
    } else {
        return null;
    }
};

const noMatchItem = (fitData, t) => {
    const { missingMeasurement, fitText, matchItem } = fitData;
    if (!matchItem) {
        return (<span>{t("fitInfo.noMatchItem", {
            value: fitText,
            add: (missingMeasurement ? t("message.addThisMeasurement") : " ")
        })}</span>);
    } else {
        return null;
    }
};

const verdict = (fitData, t) => {
    const { matchItem, fit, isLongFit } = fitData;
    if (matchItem && matchItem.componentFit > 0) {
        const fitVerdict = isLongFit ? t(`fitVerdictLong.${fit.label}`) : t(`fitVerdict.${fit.label}`);
        return <span> {t("fitInfo.smConsidersFit")} <strong>{fitVerdict.toLowerCase()}</strong>.</span>;
    } else {
        return null;
    }
};

const FitTooltip2 = (props) => {
    const { id, t, fitData, measurement } = props;
    if (!fitData || !measurement) {
        //noinspection JSConstructorReturnsPrimitive
        return null;
    } else {
        return (
            <ReactTooltip id={id}
                          place="right" className={`fit-tooltip ${measurement}`}>
                {overlapAndPinched(fitData)}
                {addSpecialTooltip(measurement, fitData)}
                {t("fitInfo.tooltipDefaultText", { measurement: t(`measurement.${measurement}`) })}
                {overlap(fitData, t)}
                {noOverlap(fitData, t)}
                {verdict(fitData, t)}
                {noMatchItem(fitData, t)}
            </ReactTooltip>
        );
    }
};

FitTooltip2.propTypes = {
    id: PropTypes.string.isRequired,
    measurement: PropTypes.string,
    fitData: PropTypes.object,
    t: PropTypes.func.isRequired
};

export default translate()(FitTooltip2);