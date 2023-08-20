import Optional from "optional-js";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SizeSelector from "../api/SizeSelector";
import ProfileSelect from "../common/ProfileSelect";
import SizingBar from "../common/SizingBar.jsx";
import DetailSection from "./DetailSection.jsx";
import DetailedFit from "./DetailedFit.jsx";

const DetailsSizeSelector = ({ selectedSize }) => {
  const container = useRef();
  const select = useRef(SizeSelector.getClone());

  useEffect(() => {
    container.current.appendChild(select.current);
  }, []);

  useEffect(() => {
    select.current.value = selectedSize ?? "";
  }, [selectedSize]);

  return <div ref={container} />;
};

DetailsSizeSelector.propTypes = {
  selectedSize: PropTypes.string,
};

const SizeGuideDetails = ({
  selectedSize,
  matchResult,
  selectedProfile,
  profiles,
  onHover,
  unit,
  chooseUnit,
  unitChoiceDisallowed,
  product,
  onSelectProfile,
}) => {
  const { t } = useTranslation();

  const handleUnitChange = (unit) => {
    chooseUnit(unit);
  };

  const item = Object.assign({}, product.item, {
    measurements: product.item.measurements[selectedSize],
  });
  const match = Optional.ofNullable(selectedSize)
    .flatMap((size) => Optional.ofNullable(matchResult).map((r) => r[size]))
    .orElse(null);

  return (
    <div className="size-guide-data size-guide-details">
      <DetailSection title={t("common.shoppingFor")} writeUnitSelectorInHeader={false}>
        <ProfileSelect
          onSelectProfile={onSelectProfile}
          selectedProfile={selectedProfile}
          profiles={profiles}
        />
      </DetailSection>
      <DetailSection title={t("common.selectedSize")} writeUnitSelectorInHeader={false}>
        <DetailsSizeSelector selectedSize={selectedSize} />
      </DetailSection>
      <DetailSection title={t("fitInfo.overallFit")} writeUnitSelectorInHeader={false}>
        <SizingBar />
      </DetailSection>
      <DetailSection
        title={t("detailed.tableTitle")}
        writeUnitSelectorInHeader={true}
        handleUnitChange={handleUnitChange}
        unitProp={unit}
        unitChoiceDisallowed={unitChoiceDisallowed}
      >
        <div className="fit-table">
          {product.model.measurementOrder.map((measurement, i) => (
            <div className="fit-wrapper" key={measurement}>
              {selectedSize && (
                <DetailedFit
                  measurement={measurement}
                  num={i + 1}
                  item={item}
                  measurementName={product.model.measurementName}
                  match={match}
                  unit={unit}
                  onHover={onHover}
                />
              )}
            </div>
          ))}
        </div>
      </DetailSection>
    </div>
  );
};

SizeGuideDetails.propTypes = {
  onSelectProfile: PropTypes.func.isRequired,
  selectedProfile: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object),
  selectedSize: PropTypes.string,
  onHover: PropTypes.func.isRequired,
  matchResult: PropTypes.object,
  product: PropTypes.object.isRequired,
  unit: PropTypes.string,
  chooseUnit: PropTypes.func,
  unitChoiceDisallowed: PropTypes.bool,
};

export default SizeGuideDetails;
