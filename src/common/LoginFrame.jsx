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

    openLoginModal = () => this.setState({ loginModalOpen: true });
    closeLoginModal = () => this.setState({ loginModalOpen: false });

    render () {
        return (
            <Modal isOpen={this.state.loginModalOpen}
                   onRequestClose={this.closeLoginModal}
                   className="login-frame-modal"
                   overlayClassName="login-frame-overlay"
                   contentLabel="SizeMe Login Frame"
            >
                <iframe src={`${contextAddress}/remote-login.html`}
                        frameBorder="0"
                        width="300"
                        height="348"
                />
            </Modal>
        );
    }
}

LoginFrame.propTypes = {
    id: PropTypes.string.isRequired
};

export default LoginFrame;
export { openLoginFrame };