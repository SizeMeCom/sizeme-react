import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { translate } from "react-i18next";
import { getResult } from "../api/ProductModel";
import { connect } from "react-redux";

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

class FitTooltip2 extends React.Component {
    constructor (props) {
        super(props);
        this.state = { fitData: null };
    }

    componentWillReceiveProps (nextProps) {
        const { product, selectedSize, matchResult, measurement } = nextProps;
        if (matchResult) {
            const item = Object.assign({}, product.item, {
                measurements: product.item.measurements[selectedSize]
            });
            const matchItem = matchResult.matchMap[measurement];
            const missingMeasurement = matchResult.missingMeasurements
                    .findIndex(([meas]) => meas === measurement) >= 0;
            const fitData = {
                matchItem, missingMeasurement,
                ...getResult(measurement, item.measurements[measurement], matchItem)
            };
            this.setState({ fitData });
        } else {
            this.setState({ fitData: null });
        }
    }

    render () {
        const { t, measurement, product } = this.props;
        const { measurementName } = product.model;
        const { fitData } = this.state;
        if (!fitData || !measurement) {
            return <ReactTooltip id="fit-tooltip" type="light" place="right" className="fit-tooltip"/>;
        } else {
            return (
                <ReactTooltip id="fit-tooltip" type="light" 
                              place="right" className={`fit-tooltip ${measurement}`}>
                    {t("fitInfo.tooltipDefaultText", { measurement: measurementName(measurement) })}
                    {overlap(fitData, t)}
                    {noOverlap(fitData, t)}
                    {verdict(fitData, t)}
                    {noMatchItem(fitData, t)}
                </ReactTooltip>
            );
        }
    }
}

FitTooltip2.propTypes = {
    measurement: PropTypes.string,
    product: PropTypes.object,
    selectedSize: PropTypes.string,
    matchResult: PropTypes.object,
    t: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    measurement: state.tooltip,
    product: state.productInfo.product,
    selectedSize: state.selectedSize,
    matchResult: state.selectedSize && state.match.matchResult ?
        state.match.matchResult[state.selectedSize] : null
});

export default translate()(connect(mapStateToProps)(FitTooltip2));