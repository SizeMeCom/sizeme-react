import React, { PropTypes } from "react";
import { contextAddress } from "../api/sizeme-api";
import Modal from "react-modal";

const instances = {};

const openLoginFrame = id => {
    if (instances[id]) {
        instances[id].openLoginModal();
    }
};

class LoginFrame extends React.Component {
    constructor (props) {
        super(props);
        instances[this.props.id] = this;
        this.state = {
            loginModalOpen: false
        };
    }

    receiveMessage = (e) => {
        const origin = e.origin || e.originalEvent.origin;
        if (origin !== contextAddress) {
            return;
        }
        if (e.data) {
            this.props.userLoggedIn();
        }
        this.closeLoginModal();
    };

    openLoginModal = () => {
        window.addEventListener("message", this.receiveMessage, false);
        this.setState({ loginModalOpen: true });
    };

    closeLoginModal = () => {
        this.setState({ loginModalOpen: false });
        window.removeEventListener("message", this.receiveMessage, false);
    };

    render () {
        return (
            <Modal isOpen={this.state.loginModalOpen}
                   onRequestClose={this.closeLoginModal}
                   className="login-frame-modal"
                   overlayClassName="login-frame-overlay"
                   contentLabel="SizeMe Login Frame"
            >
                <iframe src={`${contextAddress}/remote-login2.html`}
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
    userLoggedIn: PropTypes.func.isRequired
};

export default LoginFrame;
export { openLoginFrame };