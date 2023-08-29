import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import "./SizingBar.scss";
import ProductModel, {
  fitRanges,
  getFitPosition,
  fitLabelsAndColors,
} from "../api/ProductModel";
import ReactTooltip from "react-tooltip";
import SizeSelector from "../api/SizeSelector";

const getSizename = (selectedSize) =>
  SizeSelector.getSizeMapper()
    .filter(([size]) => size === selectedSize)
    .map(([, sizeName]) => sizeName)[0] || selectedSize;

const getValueBasedFitLabel = (value) => {
  const labelKey = Math.min(Math.floor(Math.round(value) / 20), fitLabelsAndColors.length - 1);
  return typeof fitLabelsAndColors[labelKey] !== "undefined"
    ? fitLabelsAndColors[labelKey].label
    : "regular";
};

const FitIndicator = (props) => {
  const left = `calc(${props.value}% - 9px`;
  const { selectedSize, t } = props;
  return (
    <div>
      <svg
        className="indicator"
        style={{ left }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 10"
      >
        <polygon
          className={getValueBasedFitLabel(props.value)}
          points="5,0 10,10 0,10 5,0"
          data-tip
          data-for="fitTooltip"
        />
      </svg>
      <ReactTooltip id="fitTooltip" type="light" class="indicator-tooltip">
        <span
          className="size-recommendation"
          dangerouslySetInnerHTML={{
            __html: t("common.sizingBarFitTooltip", {
              selectedSize: getSizename(selectedSize),
            }),
          }}
        />
      </ReactTooltip>
    </div>
  );
};

FitIndicator.propTypes = {
  value: PropTypes.number.isRequired,
  fitRange: PropTypes.object.isRequired,
  selectedSize: PropTypes.string,
  t: PropTypes.func,
};

const RecommendationIndicator = (props) => {
  const left = `calc(${props.value}% - 18px`;
  return (
    <div>
      <svg
        className="recommendation"
        style={{ left }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 10"
        data-tip
        data-for="recommendationTooltip"
      >
        <path d="M10 5 L20 10 L0 10 Z" />
      </svg>
      <ReactTooltip id="recommendationTooltip" type="light" class="indicator-tooltip">
        {props.t("common.sizingBarRecommendationTooltip")}
      </ReactTooltip>
    </div>
  );
};

RecommendationIndicator.propTypes = {
  value: PropTypes.number.isRequired,
  t: PropTypes.func,
};

class SizingBar extends React.Component {
  static propTypes = {
    selectedSize: PropTypes.object,
    fitRecommendation: PropTypes.number,
    matchState: PropTypes.object,
    matchResult: PropTypes.object,
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.ranges = fitRanges;
    this.state = {
      newSize: false,
    };
  }

  componentDidMount() {
    this.calculatePlaceholderSize();
  }

  UNSAFE_componentWillUpdate(newProps) {
    const { size } = newProps.selectedSize;
    if (size !== this.props.selectedSize.size) {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.setState({ newSize: true });
    }
  }

  componentDidUpdate() {
    this.calculatePlaceholderSize();
    if (this.state.newSize) {
      if (!this.timeout) {
        this.timeout = setTimeout(() => this.setState({ newSize: false }), 3000);
      }
    }
  }

  calculatePlaceholderSize() {
    if (this.placeholder) {
      const containerWidth = this.placeholder.parentNode.offsetWidth - 10;
      this.placeholder.style.transform = "scale(1)";
      const placeholderWidth = this.placeholder.offsetWidth;
      this.placeholder.style.transform = `scale(${Math.min(1, containerWidth / placeholderWidth)})`;
    }
  }

  getFitRange() {
    return ProductModel.getFit(
      { componentFit: this.props.matchState.match.totalFit, importance: 1 },
      true
    );
  }

  render() {
    const { t, fitRecommendation, selectedSize, matchState, matchResult } = this.props;
    const { size, auto } = selectedSize;
    const { match, state } = matchState;
    const doShowFit = state === "match";
    let placeholderText = "";
    if (state === "match") {
      if (matchResult.recommendedFit) {
        placeholderText = t("common.sizingBarSplashMatch", {
          sizeName: getSizename(matchResult.recommendedFit),
        });
      }
    } else if (state === "no-meas") {
      placeholderText = t("common.sizingBarSplashNoMeas");
    } else if (state === "no-fit") {
      placeholderText = t("common.sizingBarSplashNoFit");
    } else if (state === "no-size") {
      placeholderText = t("common.sizingBarSplashNoSize");
    }
    return (
      <div className={"sizeme-slider" + (this.state.newSize && auto ? " new-size" : "")}>
        <div className="slider-placeholder">
          <span
            className="size-recommendation"
            ref={(ref) => {
              this.placeholder = ref;
            }}
            dangerouslySetInnerHTML={{ __html: placeholderText }}
          />
        </div>
        {this.ranges.map((fit) => (
          <div className={fit.label + " fit-area"} key={fit.label}>
            {t(`sizingBarRangeLabel.${fit.label}`)}
          </div>
        ))}
        {doShowFit && fitRecommendation >= 1000 && (
          <RecommendationIndicator t={t} value={Math.min(100, getFitPosition(fitRecommendation))} />
        )}
        {doShowFit && (
          <FitIndicator
            value={Math.min(100, getFitPosition(match.totalFit, match.matchMap))}
            t={t}
            fitRange={this.getFitRange()}
            selectedSize={size}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  matchResult: state.match.matchResult,
  fitRecommendation: state.productInfo.product.item.fitRecommendation || 0,
  selectedSize: state.selectedSize,
  matchState: state.matchState,
});

export default withTranslation()(connect(mapStateToProps)(SizingBar));
