import React from "react";
import PropTypes from "prop-types";
import { openLoginFrame } from "./LoginFrame.jsx";
import "./SignupBox.scss";
import validator from "validator";
import { translate } from "react-i18next";

class SignupBox extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            email: "",
            valid: false,
            error: null
        };
    }

    handleChange = (event) => {
        const email = event.target.value;
        const valid = validator.isEmail(email);
        this.setState({ email, valid });
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

    render () {
        const { t } = this.props;
        const error = this.state.error;
        const isError = !!error;
        const inputClassName = "signup-email" + (isError ? " error" : "");
        return (
            <div>
                <div className="sizeme-signup-box">
                    <div>{t("signupBox.message")}</div>
                    <div className={inputClassName}>
                        <input type="email" value={this.state.email} onChange={this.handleChange}
                               placeholder={t("signupBox.emailPlaceholder")}/>
                        <a disabled={!this.state.valid} onClick={this.handleClick}>{t("signupBox.save")}</a>
                    </div>
                    {isError && <div className="signup-alert">
                        {error}
                    </div>}
                </div>
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