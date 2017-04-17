import React, { PropTypes } from "react";
import { contextAddress } from "../api/sizeme-api";
import Modal from "react-modal";

const instances = {};

const openLoginFrame = (id, mode = "login") => {
    if (instances[id]) {
        instances[id].openLoginModal(mode);
    }
};

class LoginFrame extends React.Component {
    constructor (props) {
        super(props);
        instances[this.props.id] = this;
        this.state = {
            loginModalOpen: false,
            mode: "login"
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

    openLoginModal = (mode) => {
        this.setState({
            loginModalOpen: true,
            mode: mode
        }, () => {
            window.addEventListener("message", this.receiveMessage, false);
        });
    };

    closeLoginModal = () => {
        this.setState({ loginModalOpen: false }, () => {
            window.removeEventListener("message", this.receiveMessage, false);
        });
    };

    render () {
        return (
            <Modal isOpen={this.state.loginModalOpen}
                   onRequestClose={this.closeLoginModal}
                   className="login-frame-modal"
                   overlayClassName="login-frame-overlay"
                   contentLabel="SizeMe Login Frame"
            >
                <iframe src={`${contextAddress}/remote-login2.html?mode=${this.state.mode}`}
                        frameBorder="0"
                        width="305"
                        height="348"
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