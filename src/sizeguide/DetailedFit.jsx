import React from "react";
import PropTypes from "prop-types";
import { getResult } from "../api/ProductModel";
import Optional from "optional-js";
import { withTranslation } from "react-i18next";

class DetailedFit extends React.Component {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    this.updateState(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.match !== this.props.match) {
      this.updateState(nextProps);
    }
  }

  updateState(props) {
    const matchOpt = Optional.ofNullable(props.match);
    const matchItem = matchOpt.map((m) => m.matchMap[props.measurement]).orElse(null);

    const result = getResult(
      props.measurement,
      props.item.measurements[props.measurement],
      matchItem
    );

    this.setState({
      result,
    });
  }

  render() {
    const { fit, fitText, isLongFit } = this.state.result;
    const { t, measurement, num, measurementName } = this.props;
    return (
      <div className="detailed-fit">
        <div className="measurement-head">
          <span className="num">{num}</span>
          {measurementName(measurement)}
        </div>

        <div className="overlap">{fitText}</div>

        {fit ? (
          <div className={`fit-label ${fit.label}`}>
            {isLongFit ? t(`fitVerdictLong.${fit.label}`) : t(`fitVerdict.${fit.label}`)}
          </div>
        ) : (
          <div className="fit-label" />
        )}
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
};

export default withTranslation()(DetailedFit);
