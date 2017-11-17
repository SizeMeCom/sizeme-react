import React from "react";
import PropTypes from "prop-types";
import { contextAddress } from "../api/sizeme-api";
import Modal from "react-modal";
import { trackEvent } from "../api/ga";
import "./LoginFrame.scss";

const instances = {};

const openLoginFrame = (id, mode = "login", email) => {
    if (instances[id]) {
        instances[id].openLoginModal(mode, email);
    }
};

class LoginFrame extends React.Component {
    constructor (props) {
        super(props);
        instances[this.props.id] = this;
        this.state = {
            loginModalOpen: false,
            mode: "login",
            email: null
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
        this.closeLoginModal();
        if (e.data) {
            this.props.onLogin();
        }
    };

    openLoginModal = (mode, email) => {
        this.setState({
            loginModalOpen: true,
            mode,
            email
        }, () => {
            window.addEventListener("message", this.receiveMessage, false);
            trackEvent("clickLogin", "Store: Login clicked");
            trackEvent("loginFrame", "API: loginFrame");
        });
    };

    closeLoginModal = () => {
        this.setState({ loginModalOpen: false }, () => {
            window.removeEventListener("message", this.receiveMessage, false);
        });
    };

    render () {
        const { mode, email } = this.state;
        const loginParam = email ? `&login=${email}` : "";
        const src = `${contextAddress}/remote-login2.html?mode=${mode}${loginParam}`;
        return (
            <Modal isOpen={this.state.loginModalOpen}
                   onRequestClose={this.closeLoginModal}
                   className="login-frame-modal"
                   overlayClassName="login-frame-overlay"
                   contentLabel="SizeMe Login Frame"
            >
                <iframe src={src}
                        frameBorder="0"
                        width="310"
                        height="375"
                />
            </Modal>
        );
    }
}

LoginFrame.propTypes = {
    id: PropTypes.string.isRequired,
    onLogin: PropTypes.func.isRequired
};

export default LoginFrame;
export { openLoginFrame };