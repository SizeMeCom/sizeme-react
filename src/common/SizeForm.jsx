import Optional from "optional-js";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import Modal from "react-modal";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { bindActionCreators } from "redux";
import ProductModel, { humanMeasurementMap } from "../api/ProductModel";
import { setTooltip } from "../redux";
import { setProfileMeasurements } from "../api/sizeme-api";
import uiOptions from "../api/uiOptions";
import OverlapBox from "../illustrations/OverlapBox";
import MeasurementInput from "./MeasurementInput.jsx";
import "./SizeForm.scss";
import VideoGuide from "./VideoGuide.jsx";

Modal.setAppElement(uiOptions.appendContentTo + " div");

const SizeForm = ({
  unit,
  chooseUnit,
  fields: propFields,
  gender,
  matchResult,
  measurements: propMeasurements,
  onChange,
  onOverlapBoxHover,
  product,
  unitChoiceDisallowed,
}) => {
  const { t } = useTranslation();
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [measurements, setMeasurements] = useState({});

  const activeTooltip = useRef();
  const elem = useRef();

  const fields = useMemo(
    () =>
      propFields.map((field) => ({
        field,
        humanProperty: humanMeasurementMap.get(field),
      })),
    [propFields]
  );

  useEffect(() => {
    setMeasurements(
      Object.assign(...fields.map((f) => ({ [f.humanProperty]: null })), propMeasurements)
    );
  }, [fields, propMeasurements]);

  const valueChanged = (humanProperty) => {
    return (value) => {
      const newMeasurements = { ...measurements, [humanProperty]: value };
      setMeasurements(newMeasurements);
      onChange(newMeasurements);
    };
  };

  const setActiveTooltip = (field) => {
    activeTooltip.current = field;
  };

  const openGuideModal = () => {
    setGuideModalOpen(true);
  };

  const closeGuideModal = () => {
    setGuideModalOpen(false);
  };

  // eslint-disable-next-line react/display-name
  const tooltipContent = () => () => {
    const linkTexts = t("measurementTooltips.linkToGuide", { returnObjects: true });
    const tooltips = activeTooltip.current
      ? t(`measurementTooltips.${activeTooltip.current}`, { returnObjects: true })
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
            onClick={openGuideModal}
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

  const modalContent = () => {
    if (!activeTooltip.current) {
      return null;
    }
    const humanMeasurement = humanMeasurementMap.get(activeTooltip.current);
    const humanMeasurementName = t(`humanMeasurements.${humanMeasurement}`);
    return (
      <div>
        <div className="measurement-instruction-box">
          <i className="fa-solid fa-times" onClick={closeGuideModal} />
          <h2 className="instruction-title">
            {t("measurementGuide.title")} {humanMeasurementName.toLowerCase()}
          </h2>
          <div
            className={`instruction-content gender-${gender}`}
            dangerouslySetInnerHTML={{ __html: t(`measurementGuide.${activeTooltip.current}`) }}
          />
        </div>
        <VideoGuide measurement={humanMeasurement} gender={gender} />
      </div>
    );
  };

  const getLeftPosition = () => {
    if (!elem.current) {
      return "50%";
    } else {
      const left = Math.max(0, elem.current.getBoundingClientRect().left - 300);
      return `${left}px`;
    }
  };

  const getFit = (field) =>
    Optional.ofNullable(matchResult).flatMap((r) => Optional.ofNullable(r.matchMap[field]));

  const fitRange = (field) =>
    getFit(field)
      .map((res) => ProductModel.getFit(res).label)
      .orElse(null);

  const measurementCellWidth = 100 / fields.length + "%";

  return (
    <div className="measurement-input-table" ref={elem}>
      {fields.map(({ field, humanProperty }) => (
        <div className="measurement-cell" key={field} style={{ width: measurementCellWidth }}>
          <div className="measurement-label">{t(`humanMeasurements.${humanProperty}`)}</div>
          <MeasurementInput
            onChange={valueChanged(humanProperty)}
            value={measurements[humanProperty]}
            unit={unit}
            chooseUnit={chooseUnit}
            unitChoiceDisallowed={unitChoiceDisallowed}
            fitRange={fitRange(field)}
            onFocus={() => {
              setActiveTooltip(field);
            }}
          />
          {getFit(field)
            .map((f) => (
              <OverlapBox
                fit={f}
                humanProperty={humanProperty}
                hover={() => onOverlapBoxHover(field)}
                key={humanProperty}
                model={product.model}
                unit={unit}
              />
            ))
            .orElse(null)}
        </div>
      ))}
      <ReactTooltip
        id="input-tooltip"
        type="light"
        resizeHide={false}
        getContent={tooltipContent()}
      />
      <Modal
        isOpen={guideModalOpen}
        onRequestClose={closeGuideModal}
        className="measurement-guide-modal"
        overlayClassName="measurement-guide-overlay"
        contentLabel="SizeMe Measurement Guide"
        style={{
          content: {
            left: getLeftPosition(),
          },
        }}
      >
        {modalContent()}
      </Modal>
    </div>
  );
};

SizeForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  onOverlapBoxHover: PropTypes.func,
  gender: PropTypes.string.isRequired,
  matchResult: PropTypes.object,
  measurements: PropTypes.object,
  product: PropTypes.object,
  unit: PropTypes.string,
  chooseUnit: PropTypes.func,
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
    }),
    mapDispatchToProps
  )(SizeForm)
);
