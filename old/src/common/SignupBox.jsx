import React from "react";
import PropTypes from "prop-types";
import { openLoginFrame } from "./LoginFrame.jsx";
import "./SignupBox.scss";
import validator from "validator";
import { withTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import logo from "../images/sizeme_logo_plain_h22.png";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
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
            <FontAwesome name="times" onClick={this.closePolicyModal}/>
            <iframe src="https://sizeme.com/privacy_clean.html"/>
        </>
    );

    tooltipContent = t => () => (
        <div>
            <ul>
                {t("signupBox.tooltipBullets", { returnObjects: true }).map((text, i) => (
                    <li key={i}>{text}</li>
                ))}
            </ul>
            <div className="policy-link">
                <div>{t("signupBox.tooltipProvided")}</div>
                <img alt="SizeMe" src={logo}/>
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
        const { t, signupDone } = this.props;
        const error = this.state.error;
        const isError = !!error;
        const inputClassName = "signup-email" + (isError ? " error" : "");
        return (
            <div className="section-signup-box">
                <div className="sizeme-signup-box">
                    {!signupDone && (<>
                        <div>{t("signupBox.message")}</div>
                        <div className={inputClassName}>
                            <span className="tooltip-trigger" data-for="signup-tooltip" data-tip ref={el => {this.tooltip = el;}}
                                data-place="bottom" data-type="light" data-class="signup-tooltip" data-effect="solid"
                            />
                            <input type="email" value={this.state.email} onChange={this.handleChange} onBlur={this.onBlur}
                                onFocus={this.onFocus} placeholder={t("signupBox.emailPlaceholder")} onKeyPress={this.handleEnter}/>
                            <a disabled={!this.state.valid} onClick={this.handleClick}>{t("signupBox.save")}</a>
                        </div>
                    </>)}
                    {signupDone && <div>{t("signupBox.signupDone")}</div>}
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
    t: PropTypes.func,
    signupDone: PropTypes.bool
};

export default withTranslation()(SignupBox);