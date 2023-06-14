import React from "react";
import PropTypes from "prop-types";
import Cookies from "universal-cookie";

const maxAge = 90 * 24 * 60 * 60; // 90 days
const cookieName = "sizeme_no_product_splash";
const listeners = [];

const cookies = new Cookies();

export const hideSizeMe = () => {
  cookies.set(cookieName, "true", { path: "/", maxAge: maxAge });
  for (const wrapper of listeners) {
    wrapper.hide();
  }
};

export const isSizeMeHidden = () => !!cookies.get(cookieName);

class CookieHideWrapper extends React.Component {
  constructor(props) {
    super(props);
    const noThanks = isSizeMeHidden();
    this.state = {
      hidden: noThanks,
    };
    listeners.push(this);
  }

  componentWillUnmount() {
    const idx = listeners.indexOf(this);
    if (idx >= 0) {
      listeners.splice(idx, 1);
    }
  }

  hide = () => {
    this.setState({ hidden: true });
  };

  render() {
    if (this.state.hidden) {
      return null;
    } else {
      return <div>{this.props.children}</div>;
    }
  }
}

CookieHideWrapper.propTypes = {
  children: PropTypes.node,
};

export default CookieHideWrapper;
