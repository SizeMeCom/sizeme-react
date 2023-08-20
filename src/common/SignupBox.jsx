import { useState } from "react";
import PropTypes from "prop-types";
import { openLoginFrame } from "./LoginFrame";
import "./SignupBox.scss";
import validator from "validator";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import logo from "../images/sizeme_logo_plain_h22.png";
import Modal from "react-modal";
import uiOptions from "../api/uiOptions";

Modal.setAppElement(uiOptions.appendContentTo + " div");

const SignupBox = ({ onSignup, signupDone }) => {
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  const [signupMenuOpen, setSignupMenuOpen] = useState(false);
  const closeMenu = (open) => {
    if (!open) {
      setSignupMenuOpen(open);
    }
  };

  const { t } = useTranslation();

  const handleChange = (event) => {
    setEmail(event.target.value);
    setValid(validator.isEmail(event.target.value));
  };

  const handleClick = () => {
    if (valid) {
      setValid(false);
      onSignup(email)
        .unwrap()
        .catch((err) => {
          setValid(true);
          const error = err.message;
          if (error.indexOf("Duplicate user") >= 0) {
            openLoginFrame("login-frame", "login", email);
          } else {
            setError(error);
          }
        });
    }
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  const openPolicyModal = () => {
    setPolicyModalOpen(true);
  };

  const closePolicyModal = () => {
    setPolicyModalOpen(false);
  };

  const isError = !!error;
  const inputClassName = "signup-email" + (isError ? " error" : "");
  return (
    <div className="signup-box-container">
      <i
        className="fa-regular fa-save"
        id="sizeme-signup-box"
        onClick={() => setSignupMenuOpen((prev) => !prev)}
      />
      <Tooltip
        anchorSelect="#sizeme-signup-box"
        openOnClick
        className="sizeme-signup-box"
        clickable={true}
        place="bottom"
        variant="light"
        closeOnEsc
        isOpen={signupMenuOpen}
        setIsOpen={closeMenu}
      >
        <div className="signup-box-tooltip-wrapper">
          {!signupDone && (
            <>
              <div>{t("signupBox.message")}</div>
              <div className="signup-box-header">{t("signupBox.signupChoices")}</div>
              <div className={inputClassName}>
                <input
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder={t("signupBox.emailPlaceholder")}
                  onKeyPress={handleEnter}
                />
                <a disabled={!valid} onClick={handleClick}>
                  {t("signupBox.save")}
                </a>
              </div>
            </>
          )}
          {signupDone && <div>{t("signupBox.signupDone")}</div>}
          {isError && <div className="signup-alert">{error}</div>}
          <div className="policy-link">
            <img alt="SizeMe" src={logo} />
            <a
              onClick={openPolicyModal}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              {t("signupBox.tooltipPolicyLink")}
            </a>
          </div>
        </div>
      </Tooltip>
      <Modal
        isOpen={policyModalOpen}
        onRequestClose={closePolicyModal}
        className="policy-modal"
        overlayClassName="measurement-guide-overlay"
        contentLabel="SizeMe Privacy Policy"
      >
        <i className="fa-solid fa-times" onClick={closePolicyModal} />
        <iframe src="https://sizeme.com/privacy_clean.html" />
      </Modal>
    </div>
  );
};

SignupBox.propTypes = {
  onSignup: PropTypes.func.isRequired,
  signupDone: PropTypes.bool,
};

export default SignupBox;
