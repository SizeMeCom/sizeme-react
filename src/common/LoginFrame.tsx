import { FC, useEffect, useState } from "react";
import { contextAddress } from "../api/sizeme-api";
import Modal from "react-modal";
import "./LoginFrame.scss";
import uiOptions from "../api/uiOptions";

const instances: Record<string, (mode: string, email: string) => void> = {};

Modal.setAppElement(`${uiOptions.appendContentTo} div`);

export const openLoginFrame = (id: string, mode = "login", email: string) => {
  instances[id]?.(mode, email);
};

interface Props {
  id: string;
  onLogin: () => void;
}

export const LoginFrame: FC<Props> = ({ id, onLogin }) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState<string>();
  const [modalHeight, setModalHeight] = useState(375);

  useEffect(() => {
    instances[id] = (mode, email) => {
      setMode(mode);
      setEmail(email);
      setLoginModalOpen(true);
    };
  }, [id]);

  useEffect(() => {
    const receiveMessage = (e: MessageEvent<{ loggedIn?: boolean; modalHeight?: number }>) => {
      if (!loginModalOpen) {
        return;
      }
      const origin = e.origin;
      if (origin !== contextAddress) {
        return;
      }
      if (e.data) {
        const { loggedIn, modalHeight } = e.data;

        if (loggedIn !== undefined) {
          if (loggedIn) {
            onLogin();
          }
        } else if (modalHeight) {
          setModalHeight((prev) => prev + 10);
        }
      } else {
        setLoginModalOpen(false);
      }
    };

    if (loginModalOpen) {
      window.addEventListener("message", receiveMessage, false);
    }

    return () => {
      window.removeEventListener("message", receiveMessage, false);
    };
  }, [loginModalOpen, onLogin]);

  const loginParam = email ? `&login=${email}` : "";
  const src = `${contextAddress as string}/remote-login.html?mode=${mode}${loginParam}#new`;

  return (
    <Modal
      isOpen={loginModalOpen}
      onRequestClose={() => setLoginModalOpen(false)}
      className="login-frame-modal"
      overlayClassName="login-frame-overlay"
      contentLabel="SizeMe Login Frame"
    >
      <iframe
        src={src}
        width="310"
        height={modalHeight}
        style={{
          width: 310,
          height: modalHeight,
          border: 0,
        }}
      />
    </Modal>
  );
};
