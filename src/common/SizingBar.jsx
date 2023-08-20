import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useTranslation, withTranslation } from "react-i18next";
import "./SizingBar.scss";
import {
  DEFAULT_OPTIMAL_FIT,
  DEFAULT_OPTIMAL_STRETCH,
  fitRanges,
  stretchFactor,
  isStretching,
  fitLabelsAndColors,
} from "../api/ProductModel";
import { Tooltip } from "react-tooltip";
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

const FitIndicator = ({ selectedSize, value }) => {
  const { t } = useTranslation();
  const left = `calc(${value}% - 9px`;

  return (
    <div>
      <svg
        className="indicator"
        style={{ left }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 10"
      >
        <polygon
          id="fit-indicator"
          className={getValueBasedFitLabel(value)}
          points="5,0 10,10 0,10 5,0"
        />
      </svg>
      <Tooltip anchorSelect="#fit-indicator" variant="light" className="indicator-tooltip">
        <span
          className="size-recommendation"
          dangerouslySetInnerHTML={{
            __html: t("common.sizingBarFitTooltip", {
              selectedSize: getSizename(selectedSize),
            }),
          }}
        />
      </Tooltip>
    </div>
  );
};

FitIndicator.propTypes = {
  value: PropTypes.number.isRequired,
  selectedSize: PropTypes.string,
};

const RecommendationIndicator = ({ value }) => {
  const { t } = useTranslation();
  const left = `calc(${value}% - 18px`;
  return (
    <div>
      <svg
        className="recommendation"
        style={{ left }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 10"
        id="recommendationTooltip"
      >
        <path d="M10 5 L20 10 L0 10 Z" />
      </svg>
      <Tooltip anchorSelect="#recommendationTooltip" variant="light" className="indicator-tooltip">
        {t("common.sizingBarRecommendationTooltip")}
      </Tooltip>
    </div>
  );
};

RecommendationIndicator.propTypes = {
  value: PropTypes.number.isRequired,
};

const SizingBar = ({ selectedSize, matchState, matchResult, fitRecommendation }) => {
  const { t } = useTranslation();
  const [newSize, setNewSize] = useState(false);

  const sliderPosition = useRef({
    sliderPosXMin: 0,
    sliderPosXMax: 1000,
    sliderScale: 0.1,
  });
  const placeholder = useRef();
  const timeout = useRef();

  const calculateSliderPositions = useCallback(() => {
    const fitRecom = fitRecommendation <= 1000 ? DEFAULT_OPTIMAL_FIT : fitRecommendation;
    const regular = fitRanges.find((r) => r.label === "regular");
    const rangeWidth = regular.end - regular.start;
    const regularMidPoint = regular.end - rangeWidth / 2;
    const scaledWidth = rangeWidth / ((regularMidPoint - 1000) / (fitRecom - 1000));
    const sliderPosXMin = 1000 - scaledWidth;
    const sliderPosXMax = fitRanges.slice(1).reduce((end) => end + scaledWidth, 1000);
    const sliderScale = 100 / (sliderPosXMax - sliderPosXMin);
    sliderPosition.current = {
      sliderPosXMin,
      sliderPosXMax,
      sliderScale,
    };
  }, [fitRecommendation]);

  const calculatePlaceholderSize = useCallback(() => {
    if (placeholder.current) {
      const containerWidth = placeholder.current.parentNode.offsetWidth - 10;
      placeholder.current.style.transform = "scale(1)";
      const placeholderWidth = placeholder.current.offsetWidth;
      placeholder.current.style.transform = `scale(${Math.min(
        1,
        containerWidth / placeholderWidth
      )})`;
    }
  }, []);

  useEffect(() => {
    calculateSliderPositions();
  }, [calculateSliderPositions]);

  useEffect(() => {
    clearTimeout(timeout.current);
    setNewSize(true);
    timeout.current = setTimeout(() => setNewSize(false), 3000);
  }, [selectedSize.size]);

  useEffect(() => {
    calculatePlaceholderSize();
  });

  const getFitPosition = useCallback(
    (value, matchMap) => {
      let recommendedFit = fitRecommendation;
      let effTotalFit = value;
      const maxStretchArr = [];
      if (matchMap) {
        const importanceArr = [];
        const componentFitArr = [];
        Object.entries(matchMap).forEach(([oKey, oValue]) => {
          maxStretchArr.push(oValue.componentStretch / stretchFactor(oKey));
          importanceArr.push(oValue.importance);
          componentFitArr.push(oValue.componentFit);
        });
        const maxImportance = Math.max.apply(null, importanceArr);
        const maxComponentFit = Math.max.apply(null, componentFitArr);
        if (effTotalFit === 1000 && maxImportance < 0 && maxComponentFit > 1000) {
          effTotalFit = maxComponentFit;
          if (recommendedFit <= 1000) {
            recommendedFit = DEFAULT_OPTIMAL_FIT;
          }
        }
      }
      if (isStretching(matchMap, recommendedFit)) {
        let maxStretch = DEFAULT_OPTIMAL_STRETCH;
        let newPos = 50;
        if (matchMap) {
          maxStretch = Math.max.apply(null, maxStretchArr);
          if (effTotalFit > 1000) {
            if (recommendedFit === 1000) {
              newPos = Math.min(100, 60 + ((effTotalFit - 1000) / 55) * 40);
            } else {
              newPos = Math.min(100, 60 + ((effTotalFit - 1000) / 55) * 10);
            }
          } else if (effTotalFit === 1000) {
            const stretchBreakpoint = 2 * DEFAULT_OPTIMAL_STRETCH;
            newPos =
              maxStretch > stretchBreakpoint
                ? Math.max(
                    20,
                    40 - ((maxStretch - stretchBreakpoint) / (100 - stretchBreakpoint)) * 20
                  )
                : Math.max(40, 60 - (maxStretch / stretchBreakpoint) * 20);
          } else {
            newPos = Math.max(0, 20 - ((1000 - effTotalFit) / 55) * 20);
          }
        }
        return newPos;
      } else {
        return Math.max(
          0,
          (Math.min(effTotalFit, sliderPosition.current.sliderPosXMax) -
            sliderPosition.current.sliderPosXMin) *
            sliderPosition.current.sliderScale
        );
      }
    },
    [fitRecommendation]
  );

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
    <div className={"sizeme-slider" + (newSize && auto ? " new-size" : "")}>
      <div className="slider-placeholder">
        <span
          className="size-recommendation"
          ref={placeholder}
          dangerouslySetInnerHTML={{ __html: placeholderText }}
        />
      </div>
      {fitRanges.map((fit) => (
        <div className={fit.label + " fit-area"} key={fit.label}>
          {t(`sizingBarRangeLabel.${fit.label}`)}
        </div>
      ))}
      {doShowFit && fitRecommendation >= 1000 && (
        <RecommendationIndicator value={getFitPosition(fitRecommendation)} />
      )}
      {doShowFit && (
        <FitIndicator value={getFitPosition(match.totalFit, match.matchMap)} selectedSize={size} />
      )}
    </div>
  );
};

SizingBar.propTypes = {
  selectedSize: PropTypes.object,
  fitRecommendation: PropTypes.number,
  matchState: PropTypes.object,
  matchResult: PropTypes.object,
};

const mapStateToProps = (state) => ({
  matchResult: state.match.matchResult,
  fitRecommendation: state.productInfo.product.item.fitRecommendation || 0,
  selectedSize: state.selectedSize,
  matchState: state.matchState,
});

export default withTranslation()(connect(mapStateToProps)(SizingBar));
