import Optional from "optional-js";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import Modal from "react-modal";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { bindActionCreators } from "redux";
import ProductModel, { humanMeasurementMap } from "../api/ProductModel";
import { setTooltip } from "../api/actions";
import { setProfileMeasurements } from "../api/sizeme-api";
import uiOptions from "../api/uiOptions";
import OverlapBox from "../illustrations/OverlapBox";
import MeasurementInput from "./MeasurementInput.jsx";
import "./SizeForm.scss";
import VideoGuide from "./VideoGuide.jsx";

Modal.setAppElement(uiOptions.appendContentTo + " div");

class SizeForm extends React.Component {
  constructor(props) {
    super(props);
    this.fields = props.fields.map((field) => ({
      field,
      humanProperty: humanMeasurementMap.get(field),
    }));
    const measurements = Object.assign(
      ...this.fields.map((f) => ({ [f.humanProperty]: null })),
      props.measurements
    );
    this.state = {
      guideModalOpen: false,
      measurements,
      fitTooltip: {
        measurement: null,
        fitData: null,
      },
    };
    this.activeTooltip = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const measurements = Object.assign(
      ...this.fields.map((f) => ({ [f.humanProperty]: null })),
      nextProps.measurements
    );
    this.setState({ measurements });
  }

  valueChanged(humanProperty) {
    return (value) => {
      const measurements = Object.assign(this.state.measurements, { [humanProperty]: value });
      this.setState({ measurements }, () => {
        this.props.onChange(this.state.measurements);
      });
    };
  }

  setActiveTooltip = (field) => {
    this.activeTooltip = field;
  };

  openGuideModal = () => {
    this.setState({ guideModalOpen: true });
  };

  closeGuideModal = () => {
    this.setState({ guideModalOpen: false });
  };

  // eslint-disable-next-line react/display-name
  tooltipContent = (t) => () => {
    const linkTexts = t("measurementTooltips.linkToGuide", { returnObjects: true });
    const tooltips = this.activeTooltip
      ? t(`measurementTooltips.${this.activeTooltip}`, { returnObjects: true })
      : [];
    return (
      <div>
        <ul>
          {tooltips.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
        <div className="measurement-guide-link">
          <span>{linkTexts.start} </span>
          <a
            onClick={this.openGuideModal}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            {linkTexts.link}
          </a>
          <span> {linkTexts.end} </span>
          <i className="fa-solid fa-play-circle" />
        </div>
      </div>
    );
  };

  modalContent = (t) => {
    if (!this.activeTooltip) {
      return null;
    }
    const humanMeasurement = humanMeasurementMap.get(this.activeTooltip);
    const humanMeasurementName = t(`humanMeasurements.${humanMeasurement}`);
    return (
      <div>
        <div className="measurement-instruction-box">
          <i className="fa-solid fa-times" onClick={this.closeGuideModal} />
          <h2 className="instruction-title">
            {t("measurementGuide.title")} {humanMeasurementName.toLowerCase()}
          </h2>
          <div
            className={`instruction-content gender-${this.props.gender}`}
            dangerouslySetInnerHTML={{ __html: t(`measurementGuide.${this.activeTooltip}`) }}
          />
        </div>
        <VideoGuide measurement={humanMeasurement} gender={this.props.gender} />
      </div>
    );
  };

  getLeftPosition = () => {
    if (!this.elem) {
      return "50%";
    } else {
      const left = Math.max(0, this.elem.getBoundingClientRect().left - 300);
      return `${left}px`;
    }
  };

  render() {
    const getFit = (field) =>
      Optional.ofNullable(this.props.matchResult).flatMap((r) =>
        Optional.ofNullable(r.matchMap[field])
      );
    const fitRange = (field) =>
      getFit(field)
        .map((res) => ProductModel.getFit(res).label)
        .orElse(null);
    const measurementCellWidth = 100 / this.fields.length + "%";
    const { t, onOverlapBoxHover, unit, chooseUnit, inchFractionsPrecision, unitChoiceDisallowed } =
      this.props;

    return (
      <div
        className="measurement-input-table"
        ref={(el) => {
          this.elem = el;
        }}
      >
        {this.fields.map(({ field, humanProperty }) => (
          <div className="measurement-cell" key={field} style={{ width: measurementCellWidth }}>
            <label htmlFor={"input_cm_" + field} className="measurement-label">
              {t(`humanMeasurements.${humanProperty}`)}
            </label>
            <MeasurementInput
              onChange={this.valueChanged(humanProperty)}
              value={this.state.measurements[humanProperty]}
              unit={unit}
              chooseUnit={chooseUnit}
              inchFractionsPrecision={inchFractionsPrecision}
              unitChoiceDisallowed={unitChoiceDisallowed}
              fitRange={fitRange(field)}
              fieldName={field}
              onFocus={() => {
                this.setActiveTooltip(field);
              }}
            />
            {getFit(field)
              .map((f) => (
                <OverlapBox
                  fit={f}
                  humanProperty={humanProperty}
                  hover={() => onOverlapBoxHover(field)}
                  key={humanProperty}
                  model={this.props.product.model}
                  unit={unit}
                  inchFractionsPrecision={inchFractionsPrecision}
                />
              ))
              .orElse(null)}
          </div>
        ))}
        <ReactTooltip
          id="input-tooltip"
          type="light"
          resizeHide={false}
          getContent={this.tooltipContent(t)}
        />
        <Modal
          isOpen={this.state.guideModalOpen}
          onRequestClose={this.closeGuideModal}
          className="measurement-guide-modal"
          overlayClassName="measurement-guide-overlay"
          contentLabel="SizeMe Measurement Guide"
          style={{
            content: {
              left: this.getLeftPosition(),
            },
          }}
        >
          {this.modalContent(t)}
        </Modal>
      </div>
    );
  }
}

SizeForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  onOverlapBoxHover: PropTypes.func,
  gender: PropTypes.string.isRequired,
  matchResult: PropTypes.object,
  measurements: PropTypes.object,
  product: PropTypes.object,
  selectedSize: PropTypes.string,
  t: PropTypes.func,
  unit: PropTypes.string,
  chooseUnit: PropTypes.func,
  inchFractionsPrecision: PropTypes.number,
  unitChoiceDisallowed: PropTypes.bool,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onChange: setProfileMeasurements,
      onOverlapBoxHover: setTooltip,
    },
    dispatch
  );

export default withTranslation()(
  connect(
    (state) => ({
      gender: Optional.ofNullable(state.selectedProfile)
        .flatMap((p) => Optional.ofNullable(p.gender))
        .map((g) => g.toLowerCase())
        .orElse("female"),
      matchResult:
        state.selectedSize.size && state.match.matchResult
          ? state.match.matchResult[state.selectedSize.size]
          : null,
      measurements: Optional.ofNullable(state.selectedProfile)
        .map((p) => p.measurements)
        .orElse({}),
      product: state.productInfo.product,
      selectedSize: state.selectedSize.size,
    }),
    mapDispatchToProps
  )(SizeForm)
);
