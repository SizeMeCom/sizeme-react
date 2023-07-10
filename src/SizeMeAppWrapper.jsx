import { useEffect } from "react";
import Loadable from "react-loadable";
import { Loading } from "./common/Loading";
import uiOptions from "./api/uiOptions";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import * as api from "./api/sizeme-api";
import * as redux from "./redux";
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

const SizemeToggler = ({ setSizemeHidden, sizemeHidden }) => {
  const { t } = useTranslation();

  const toggle = () => {
    setSizemeHidden(!sizemeHidden);
  };

  return (
    <div className="sizeme-toggler">
      <a onClick={toggle}>
        {t("common.togglerText")}{" "}
        <i
          className={clsx("fa", { "fa-arrow-down": sizemeHidden, "fa-arrow-up": !sizemeHidden })}
          aria-hidden
        />
      </a>
    </div>
  );
};

SizemeToggler.propTypes = {
  sizemeHidden: PropTypes.bool.isRequired,
  setSizemeHidden: PropTypes.func.isRequired,
};

const SizeMeAppWrapper = ({
  getProduct,
  getProfiles,
  setSelectedProfile,
  resolveAuthToken,
  resolved,
  sizemeHidden,
  setSizemeHidden,
}) => {
  useEffect(() => {
    Promise.all([
      resolveAuthToken().then((resolved) => getProfiles().then(() => resolved)),
      getProduct(),
    ]).then(() => {
      setSelectedProfile();
    });
  }, [getProduct, getProfiles, resolveAuthToken, setSelectedProfile]);

  if (resolved) {
    return (
      <>
        {uiOptions.toggler && (
          <SizemeToggler sizemeHidden={sizemeHidden} setSizemeHidden={setSizemeHidden} />
        )}
        {!sizemeHidden && <SizeMeApp />}
      </>
    );
  } else {
    return null;
  }
};

SizeMeAppWrapper.propTypes = {
  resolveAuthToken: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  getProduct: PropTypes.func.isRequired,
  setSelectedProfile: PropTypes.func.isRequired,
  sizemeHidden: PropTypes.bool.isRequired,
  resolved: PropTypes.bool.isRequired,
  setSizemeHidden: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  resolved: state.authToken.resolved && state.productInfo.resolved,
  sizemeHidden: state.sizemeHidden,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setSelectedProfile: api.setSelectedProfile,
      resolveAuthToken: redux.resolveAuthToken,
      getProfiles: redux.getProfiles,
      getProduct: redux.getProduct,
      setSizemeHidden: redux.setSizemeHidden,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SizeMeAppWrapper);
