import React, { PropTypes } from "react";
import i18n from "../api/i18n";
import SizeGuideModel from "../api/ProductModel";
import Optional from "optional-js";

const measurementName = measurement => i18n.MEASUREMENT[measurement];
const formatSize = (size, isMatch) => {
    let res = size / 10;
    if (isMatch && res >= 0) {
        return "+" + res.toFixed(1) + " cm";
    } else {
        return res.toFixed(1) + " cm";
    } 
};

class DetailedFit extends React.Component {

    getOverlap () {
        return Optional.ofNullable(this.props.match)
            .map(m => m.matchMap[this.props.measurement])
            .map(m => formatSize(m.overlap, true))
            .orElseGet(() => formatSize(this.props.item.measurements[this.props.measurement], false));
    }

    getFit () {
        return Optional.ofNullable(this.props.match)
            .map(m => m.matchMap[this.props.measurement])
            .map(SizeGuideModel.getFit)
            .map(fit => {
                const className = `fit-label ${fit.label}`;
                return <div className={className}>{i18n.FIT_VERDICT[fit.label]}</div>;
            })
            .orElse(<div className="fit-label"/>);
    }

    render () {
        return (
            <div className="detailed-fit">
                <div className="measurement-head">
                    <span className="num">{this.props.num}</span>{measurementName(this.props.measurement)}
                </div>
                <div className="overlap">{this.getOverlap()}</div>
                {this.getFit()}
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