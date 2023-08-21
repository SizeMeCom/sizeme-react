import PropTypes from "prop-types";
import { lazy, Suspense, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSelectedProfile } from "../api/sizeme-api";
import { Loading } from "../common/Loading";
import "./SizeGuide.scss";

const SizeGuideModal = lazy(() => import("./SizeGuideModal"));

const SizeGuide = (props) => {
  const { t } = useTranslation();
  const { unit, chooseUnit, loggedIn, unitChoiceDisallowed } = props;
  const [guideIsOpen, setGuideIsOpen] = useState(false);
  const [highlight, setHighlight] = useState("");

  const removeTimeout = useRef();

  const onHover = (measurement) => {
    if (!measurement) {
      removeTimeout.current = setTimeout(() => {
        setHighlight(measurement);
      }, 100);
    } else {
      setHighlight(measurement);
      clearTimeout(removeTimeout.current);
    }
  };

  const openGuide = () => {
    setGuideIsOpen(true);
  };

  const closeGuide = () => {
    setGuideIsOpen(false);
  };

  const button = loggedIn ? t("detailed.buttonText") : t("sizeGuide.buttonText");

  const modalProps = {
    ...props,
    highlight,
    guideIsOpen,
    closeGuide,
    onHover,
  };

  return (
    <div className="section-size-guide">
      <a className="link-btn size-guide" onClick={openGuide}>
        {button} <i className="fa-solid fa-caret-right" />
      </a>
      {guideIsOpen && (
        <Suspense fallback={<Loading />}>
          <SizeGuideModal
            {...modalProps}
            unit={unit}
            chooseUnit={chooseUnit}
            unitChoiceDisallowed={unitChoiceDisallowed}
          />
        </Suspense>
      )}
    </div>
  );
};

SizeGuide.propTypes = {
  product: PropTypes.object.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object),
  selectedProfile: PropTypes.object,
  selectedSize: PropTypes.string,
  onSelectProfile: PropTypes.func.isRequired,
  matchResult: PropTypes.object,
  loggedIn: PropTypes.bool.isRequired,
  matchState: PropTypes.object,
  unit: PropTypes.string,
  chooseUnit: PropTypes.func,
  unitChoiceDisallowed: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  product: state.productInfo.product,
  profiles: state.profileList.profiles,
  selectedProfile: state.selectedProfile,
  selectedSize: state.selectedSize.size,
  matchResult: state.match.matchResult,
  loggedIn: state.authToken.loggedIn,
  matchState: state.matchState,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onSelectProfile: setSelectedProfile,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SizeGuide);
