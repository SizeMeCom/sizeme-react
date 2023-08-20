import Optional from "optional-js";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { Tooltip } from "react-tooltip";
import { bindActionCreators } from "redux";
import "./SizeMeApp.scss";
import * as api from "./api/sizeme-api";
import * as redux from "./redux";
import uiOptions from "./api/uiOptions";
import FitTooltip from "./common/FitTooltip";
import { Loading } from "./common/Loading";
import { LoginFrame } from "./common/LoginFrame";
import ProfileMenu from "./common/ProfileMenu";
import SignupBox from "./common/SignupBox";
import SizingBar from "./common/SizingBar.jsx";
import sizemeIcon from "./images/sizeme_icon.png";
import SizeGuide from "./sizeguide/SizeGuide.jsx";
import clsx from "clsx";

const SizeForm = Loadable({
  loader: () => import("./common/SizeForm.jsx"),
  loading() {
    return <Loading />;
  },
});

const measurementUnitChoiceDisallowed = uiOptions.measurementUnitChoiceDisallowed ?? false;

const SizeMeApp = ({
  getProfiles,
  profiles,
  matchState,
  resolveAuthToken,
  resolved,
  loggedIn,
  measurementInputs,
  onSignup,
  signupStatus,
  productInfo,
  selectedProfile,
  setSelectedProfile,
}) => {
  const [unit, setUnit] = useState(() => {
    const selectedUnit = localStorage.getItem("sizemeMeasurementUnit");
    return ["cm", "in"].includes(selectedUnit) ? selectedUnit : uiOptions.measurementUnit ?? "cm";
  });

  const { t } = useTranslation();

  const userLoggedIn = async () => {
    if (await resolveAuthToken(true)) {
      await getProfiles();
      await setSelectedProfile();
    }
  };

  useEffect(() => {
    document.body.classList.add("sizeme-active");
    return () => {
      document.body.classList.remove("sizeme-active");
    };
  }, []);

  const chooseUnit = (chosenUnit) => {
    localStorage.setItem("sizemeMeasurementUnit", chosenUnit);
    setUnit(chosenUnit);
  };

  const { match, state } = matchState;

  const classes = clsx([
    "sizeme-content",
    state,
    `sizeme-item-${productInfo.product.item.itemType.replace(/\./g, "_")}`,
    uiOptions.skinClasses,
    Optional.ofNullable(uiOptions.shopType)
      .map((s) => `sizeme-${s}`)
      .orElse(undefined),
  ]);

  return (
    <div className={classes}>
      <div className="sizeme-slider-row">
        <SizingBar />
        {loggedIn && (
          <ProfileMenu
            profiles={profiles}
            selectedProfile={selectedProfile.id}
            setSelectedProfile={setSelectedProfile}
          />
        )}
        {(!loggedIn || signupStatus.inProgress || signupStatus.signupDone) && match && (
          <SignupBox onSignup={onSignup} signupDone={signupStatus.signupDone} />
        )}
        {!loggedIn && !match && (
          <div className="profile-menu-container">
            <img src={sizemeIcon} alt="SizeMe" id="sizeme-tooltip" />
            <Tooltip
              anchorSelect="#sizeme-tooltip"
              variant="light"
              place="bottom"
              border="1px solid"
              opacity={1}
              style={{ zIndex: 1, width: 200 }}
            >
              <div>{t("common.sizemeTooltip")}</div>
            </Tooltip>
          </div>
        )}
      </div>
      {measurementInputs && (
        <SizeForm
          fields={measurementInputs}
          unit={unit}
          chooseUnit={chooseUnit}
          unitChoiceDisallowed={measurementUnitChoiceDisallowed}
        />
      )}
      {resolved && !uiOptions.disableSizeGuide && (
        <SizeGuide
          unit={unit}
          chooseUnit={chooseUnit}
          unitChoiceDisallowed={measurementUnitChoiceDisallowed}
        />
      )}
      <FitTooltip unit={unit} />
      <LoginFrame id="login-frame" onLogin={userLoggedIn} />
    </div>
  );
};

SizeMeApp.propTypes = {
  resolved: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool,
  signupStatus: PropTypes.object,
  measurementInputs: PropTypes.arrayOf(PropTypes.string),
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedProfile: PropTypes.object.isRequired,
  matchState: PropTypes.object,
  productInfo: PropTypes.object,
  setSelectedProfile: PropTypes.func.isRequired,
  resolveAuthToken: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  onSignup: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  resolved: state.authToken.resolved && state.productInfo.resolved,
  loggedIn: state.authToken.loggedIn,
  signupStatus: state.signupStatus,
  measurementInputs: Optional.ofNullable(state.productInfo.product)
    .flatMap((p) => Optional.ofNullable(p.model))
    .map((m) => m.essentialMeasurements)
    .orElse(null),
  profiles: state.profileList.profiles,
  selectedProfile: state.selectedProfile,
  matchState: state.matchState,
  productInfo: state.productInfo,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setSelectedProfile: api.setSelectedProfile,
      resolveAuthToken: redux.resolveAuthToken,
      getProfiles: redux.getProfiles,
      onSignup: redux.signup,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SizeMeApp);
