import React from "react";
import PropTypes from "prop-types";
import { openLoginFrame } from "./LoginFrame.jsx";
import "./SignupBox.scss";
import validator from "validator";
import { withTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import logo from "../images/sizeme_logo_plain_h22.png";
import Modal from "react-modal";
import uiOptions from "../api/uiOptions";

Modal.setAppElement(uiOptions.appendContentTo + " div");

class SignupBox extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            email: "",
            valid: false,
            error: null,
            policyModalOpen: false
        };
    }

    handleChange = (event) => {
        const email = event.target.value;
        const valid = validator.isEmail(email);
        this.setState({ email, valid });
    };

    handleEnter = (event) => {
        if (event.key === "Enter") {
            this.handleClick();
        }
    };

    handleClick = () => {
        if (this.state.valid) {
            this.setState({valid: false}, () =>
                this.props.onSignup(this.state.email)
                .catch(err => {
                    this.setState({valid: true});
                    const error = err.message;
                    if (error.indexOf("Duplicate user") >= 0) {
                        openLoginFrame("login-frame", "login", this.state.email);
                    } else {
                        this.setState({ error });
                    }
                })
            );
        }
    };

    openPolicyModal = () => {
        this.setState({ policyModalOpen: true });
    };

    closePolicyModal = () => {
        this.setState({ policyModalOpen: false });
    };

    modalContent = () => (
        <>
            <i className="fa-solid fa-times" onClick={this.closePolicyModal}/>
            <iframe src="https://sizeme.com/privacy_clean.html"/>
        </>
    );

    render () {
        const { t, signupDone } = this.props;
        const error = this.state.error;
        const isError = !!error;
        const inputClassName = "signup-email" + (isError ? " error" : "");
        return (
            <div className="signup-box-container">
                <i className="fa-solid fa-save" data-tip data-for="sizeme-signup-box" data-event="click"/>
                <ReactTooltip id="sizeme-signup-box" className="sizeme-signup-box" clickable={true}
                              place="bottom" type="light" effect="solid">
                    {!signupDone && (<>
                        <div>{t("signupBox.message")}</div>
                        <div className="signup-box-header">{t("signupBox.signupChoices")}</div>
                        <div className={inputClassName}>
                            <input type="email" value={this.state.email} onChange={this.handleChange}
                                placeholder={t("signupBox.emailPlaceholder")} onKeyPress={this.handleEnter}/>
                            <a disabled={!this.state.valid} onClick={this.handleClick}>{t("signupBox.save")}</a>
                        </div>
                    </>)}
                    {signupDone && <div>{t("signupBox.signupDone")}</div>}
                    {isError && <div className="signup-alert">
                        {error}
                    </div>}
                    <div className="policy-link">
                        <img alt="SizeMe" src={logo}/>
                        <a onClick={this.openPolicyModal}
                            onMouseDown={e => {e.preventDefault();}}>{t("signupBox.tooltipPolicyLink")}</a>
                    </div>
                </ReactTooltip>
                <Modal isOpen={this.state.policyModalOpen}
                    onRequestClose={this.closePolicyModal}
                    className="policy-modal"
                    overlayClassName="measurement-guide-overlay"
                    contentLabel="SizeMe Privacy Policy"
                >
                    {this.modalContent(t)}
                </Modal>
            </div>
        );
    }
}

SignupBox.propTypes = {
    onSignup: PropTypes.func.isRequired,
    t: PropTypes.func,
    signupDone: PropTypes.bool
};

export default withTranslation()(SignupBox);
