import React from "react";
import Loadable from "react-loadable";
import Loading from "./common/Loading";
import uiOptions from "./api/uiOptions";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import * as api from "./api/sizeme-api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import clsx from "clsx";
import "./SizeMeApp.scss";

const SizeMeApp = Loadable({
  loader: () => import(/* webpackChunkName: "app" */ "./SizeMeApp"),
  loading() {
    return <Loading />;
  },
});

class SizeMeTogglerComp extends React.Component {
  static propTypes = {
    sizemeHidden: PropTypes.bool.isRequired,
    setSizemeHidden: PropTypes.func.isRequired,
    t: PropTypes.func,
  };

  toggle = () => {
    const { sizemeHidden, setSizemeHidden } = this.props;
    setSizemeHidden(!sizemeHidden);
  };

  render() {
    const { t, sizemeHidden } = this.props;
    return (
      <div className="sizeme-toggler">
        <a onClick={this.toggle}>
          {t("common.togglerText")}{" "}
          <i
            className={clsx("fa", { "fa-arrow-down": sizemeHidden, "fa-arrow-up": !sizemeHidden })}
            aria-hidden
          />
        </a>
      </div>
    );
  }
}

const SizemeToggler = withTranslation()(SizeMeTogglerComp);

class SizeMeAppWrapper extends React.Component {
  static propTypes = {
    resolveAuthToken: PropTypes.func.isRequired,
    getProfiles: PropTypes.func.isRequired,
    getProduct: PropTypes.func.isRequired,
    setSelectedProfile: PropTypes.func.isRequired,
    sizemeHidden: PropTypes.bool.isRequired,
    resolved: PropTypes.bool.isRequired,
    setSizemeHidden: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { resolveAuthToken, getProfiles, getProduct, setSelectedProfile } = this.props;
    Promise.all([
      resolveAuthToken().then((resolved) => getProfiles().then(() => resolved)),
      getProduct(),
    ]).then(() => {
      setSelectedProfile();
    });
  }

  render() {
    const { resolved, sizemeHidden, setSizemeHidden } = this.props;

    if (resolved) {
      return (
        <>
          {uiOptions.toggler && (
            <SizemeToggler sizemeHidden={sizemeHidden} setSizemeHidden={setSizemeHidden} />
          )}
          <SizeMeApp sizemeHidden={sizemeHidden} />
        </>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => ({
  resolved: state.authToken.resolved && state.productInfo.resolved,
  sizemeHidden: state.sizemeHidden,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setSelectedProfile: api.setSelectedProfile,
      resolveAuthToken: api.resolveAuthToken,
      getProfiles: api.getProfiles,
      getProduct: api.getProduct,
      setSizemeHidden: api.setSizemeHidden,
    },
    dispatch
  );

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SizeMeAppWrapper));
