import React from "react";
import PropTypes from "prop-types";
import { openLoginFrame } from "./LoginFrame.jsx";
import "./SignupBox.scss";
import validator from "validator";
import { translate } from "react-i18next";
import ReactTooltip from "react-tooltip";
import logo from "../images/sizeme_logo_plain_h22.png";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

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
        ReactTooltip.hide(this.tooltip);
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
            this.props.onSignup(this.state.email)
                .catch(err => {
                    const error = err.message;
                    if (error.indexOf("Duplicate user") >= 0) {
                        openLoginFrame("login-frame", "login", this.state.email);
                    } else {
                        this.setState({ error });
                    }
                });
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
            <FontAwesome name="times" onClick={this.closePolicyModal}/>
            <iframe src="https://sizeme.com/privacy_clean.html"/>
        </>
    );

    tooltipContent = t => () => (
        <div>
            <ul>
                <li>{t("signupBox.tooltipBullet1")}</li>
                <li>{t("signupBox.tooltipBullet2")}</li>
            </ul>
            <div className="policy-link">
                <div>{t("signupBox.tooltipProvided")}&nbsp;<img alt="SizeMe" src={logo}/></div>
                <a onClick={this.openPolicyModal}
                    onMouseDown={e => {e.preventDefault();}}>{t("signupBox.tooltipPolicyLink")}</a>
            </div>
        </div>
    );

    onBlur = () => {
        ReactTooltip.hide(this.tooltip);
    };

    onFocus = () => {
        ReactTooltip.show(this.tooltip);
    };

    render () {
        const { t } = this.props;
        const error = this.state.error;
        const isError = !!error;
        const inputClassName = "signup-email" + (isError ? " error" : "");
        return (
            <div className="section-signup-box">
                <div className="sizeme-signup-box">
                    <div>{t("signupBox.message")}</div>
                    <div className={inputClassName}>
                        <span className="tooltip-trigger" data-for="signup-tooltip" data-tip ref={el => {this.tooltip = el;}}
                            data-place="bottom" data-type="light" data-class="signup-tooltip" data-effect="solid"
                        />
                        <input type="email" value={this.state.email} onChange={this.handleChange} onBlur={this.onBlur}
                               onFocus={this.onFocus} placeholder={t("signupBox.emailPlaceholder")} onKeyPress={this.handleEnter}/>
                        <a disabled={!this.state.valid} onClick={this.handleClick}>{t("signupBox.save")}</a>
                    </div>
                    {isError && <div className="signup-alert">
                        {error}
                    </div>}
                </div>
                <ReactTooltip id="signup-tooltip" type="light" getContent={this.tooltipContent(t)}/>
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
    t: PropTypes.func
};

export default translate()(SignupBox);