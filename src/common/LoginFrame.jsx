import React from "react";
import PropTypes from "prop-types";
import { contextAddress } from "../api/sizeme-api";
import Modal from "react-modal";
import "./LoginFrame.scss";
import uiOptions from "../api/uiOptions";

const instances = {};

Modal.setAppElement(uiOptions.appendContentTo + " div");

const openLoginFrame = (id, mode = "login", email) => {
  if (instances[id]) {
    instances[id].openLoginModal(mode, email);
  }
};

class LoginFrame extends React.Component {
  constructor(props) {
    super(props);
    instances[this.props.id] = this;
    this.state = {
      loginModalOpen: false,
      mode: "login",
      email: null,
      modalHeight: 375,
    };
  }

  receiveMessage = (e) => {
    if (!this.state.loginModalOpen) {
      return;
    }
    const origin = e.origin || e.originalEvent.origin;
    if (origin !== contextAddress) {
      return;
    }
    if (e.data) {
      const { loggedIn, modalHeight } = e.data;

      if (loggedIn !== undefined) {
        if (loggedIn) {
          this.props.onLogin();
        }
      } else if (modalHeight) {
        this.setState({ modalHeight: modalHeight + 10 });
      }
    } else {
      this.closeLoginModal();
    }
  };

  openLoginModal = (mode, email) => {
    this.setState(
      {
        loginModalOpen: true,
        mode,
        email,
      },
      () => {
        window.addEventListener("message", this.receiveMessage, false);
      }
    );
  };

  closeLoginModal = () => {
    this.setState({ loginModalOpen: false }, () => {
      window.removeEventListener("message", this.receiveMessage, false);
    });
  };

  render() {
    const { mode, email } = this.state;
    const loginParam = email ? `&login=${email}` : "";
    const src = `${contextAddress}/remote-login.html?mode=${mode}${loginParam}#new`;
    return (
      <Modal
        isOpen={this.state.loginModalOpen}
        onRequestClose={this.closeLoginModal}
        className="login-frame-modal"
        overlayClassName="login-frame-overlay"
        contentLabel="SizeMe Login Frame"
      >
        <iframe src={src} frameBorder="0" width="310" height={this.state.modalHeight} />
      </Modal>
    );
  }
}

LoginFrame.propTypes = {
  id: PropTypes.string.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default LoginFrame;
export { openLoginFrame };
