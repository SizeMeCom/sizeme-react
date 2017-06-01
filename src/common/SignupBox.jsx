import React from "react";
import PropTypes from "prop-types";
import LoginFrame, { openLoginFrame } from "./LoginFrame.jsx";
import "./SignupBox.scss";
import validator from "validator";
import { translate } from "react-i18next";


class SignupBox extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            email: "",
            valid: false
        };
    }

    handleChange = (event) => {
        const email = event.target.value;
        const valid = validator.isEmail(email);
        this.setState({ email, valid });
    };

    handleClick = () => {
        if (this.state.valid) {
            this.props.onSignup(this.state.email);
        }
    };

    render () {
        const { t } = this.props;
        const error = this.props.signupStatus.error;
        const isError = !!error;
        const inputClassName = "signup-email" + (isError ? " error" : "");
        let errorMessage = error;
        if (isError && error.indexOf("Duplicate user") >= 0) {
            errorMessage = t("signupBox.duplicateUser");
        }
        return (
            <div>
                <div className="sizeme-login-link">
                    <a onClick={() => openLoginFrame("login-frame")}>Already a SizeMe user? »</a>
                </div>
                <div className="sizeme-signup-box">
                    <div>{t("signupBox.message")}</div>
                    <div className={inputClassName}>
                        <input type="email" value={this.state.email} onChange={this.handleChange}
                               placeholder="myname@example.com"/>
                        <a disabled={!this.state.valid} onClick={this.handleClick}>Save</a>
                    </div>
                    {isError && <div className="signup-alert">
                        {errorMessage}
                    </div>}
                </div>
                <LoginFrame id="login-frame" onLogin={this.props.onLogin}/>
            </div>
        );
    }
}

SignupBox.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
    signupStatus: PropTypes.object.isRequired,
    t: PropTypes.func
};

export default translate()(SignupBox);