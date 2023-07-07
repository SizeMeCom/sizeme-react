import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { bindActionCreators } from "redux";
import { setTooltip } from "../redux";
import { setSelectedProfile } from "../api/sizeme-api";
import { Loading } from "../common/Loading";
import "./SizeGuide.scss";

const SizeGuideModal = Loadable({
  loader: () => import("./SizeGuideModal"),
  loading() {
    return <Loading />;
  },
});

class SizeGuide extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guideIsOpen: false,
      highlight: "",
    };
  }

  onHover = (measurement) => {
    if (!measurement) {
      this.removeTimeout = setTimeout(() => {
        this.setState({ highlight: measurement });
      }, 100);
    } else {
      this.props.onFitHover(measurement);
      this.setState({ highlight: measurement });
      if (this.removeTimeout) {
        clearTimeout(this.removeTimeout);
      }
    }
  };

  openGuide = () => {
    this.setState({ guideIsOpen: true }, () => {});
  };

  closeGuide = () => {
    this.setState({ guideIsOpen: false }, () => {
      ReactTooltip.rebuild();
    });
  };

  componentDidCatch() {
    this.setState({ guideIsOpen: false });
  }

  render() {
    const { t, loggedIn, unit, chooseUnit, unitChoiceDisallowed } = this.props;
    const { guideIsOpen } = this.state;
    const button = loggedIn ? t("detailed.buttonText") : t("sizeGuide.buttonText");

    const modalProps = {
      ...this.state,
      ...this.props,
      closeGuide: this.closeGuide,
      onHover: this.onHover,
    };

    return (
      <div className="section-size-guide">
        <a className="link-btn size-guide" onClick={this.openGuide}>
          {button} <i className="fa-solid fa-caret-right" />
        </a>
        {guideIsOpen && (
          <SizeGuideModal
            {...modalProps}
            unit={unit}
            chooseUnit={chooseUnit}
            unitChoiceDisallowed={unitChoiceDisallowed}
          />
        )}
      </div>
    );
  }
}

SizeGuide.propTypes = {
  product: PropTypes.object.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object),
  selectedProfile: PropTypes.object,
  selectedSize: PropTypes.string,
  onSelectProfile: PropTypes.func.isRequired,
  onFitHover: PropTypes.func,
  matchResult: PropTypes.object,
  loggedIn: PropTypes.bool.isRequired,
  matchState: PropTypes.object,
  t: PropTypes.func,
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
      onFitHover: setTooltip,
    },
    dispatch
  );

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SizeGuide));
