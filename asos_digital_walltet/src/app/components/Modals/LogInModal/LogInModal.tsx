import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Label, Modal, TextInput } from "flowbite-react";

import styles from "./LogInModal.module.scss";

import {
  enableLogInModal,
  setLogInModal,
  setSignUpModal,
  useAppDispatch,
  useAppSelector,
  ForgotPasswordModal,
  displayToast,
  setForgotPasswordModal,
} from "app";

export const LogInModal: React.FC = ({}) => {
  const dispatch = useAppDispatch();
  const isLogInModal = useAppSelector(enableLogInModal);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState("");

  const resetInputs = (): void => {
    setEmail("");
    setPassword("");
    setAuthCode("");
  };

  const onCloseModal = (): void => {
    dispatch(setLogInModal(false));
    resetInputs();
  };

  const handleAuthCodeChange = (event: any) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/\D/g, "");
    setAuthCode(sanitizedValue);
  };

  const onAlreadyCreatedAccount = (): void => {
    onCloseModal();
    dispatch(setSignUpModal(true));
  };

  const handleLogIn = (): void => {
    const loginData = {
      email,
      password,
      authCode,
    };

    fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.user) {
          displayToast("success", "Congrats", data.message);
          onCloseModal();
          navigate(`/digital-wallet/${data.user.id}`);
        } else {
          displayToast("error", "Log In Failed", data.message);
          resetInputs();
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to get user.");
        console.error("Error:", error);
      });
  };

  return (
    <>
      <ForgotPasswordModal />
      <Modal show={isLogInModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Hello.. Welcome Back!
            </h3>
            <h3 className="text-xs font-medium text-gray-500 dark:text-white">
              Please log in to continue
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email Address" />
              </div>
              <TextInput
                id="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="authCode" value="Auth Code" />
              </div>
              <TextInput
                placeholder="123456"
                id="authCode"
                type="text"
                maxLength={6}
                value={authCode}
                onChange={handleAuthCodeChange}
                required
              />
            </div>
            <div className={styles["w-full"]}>
              <Button
                onClick={handleLogIn}
                disabled={email && password ? false : true}
              >
                Log In
              </Button>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                <a
                  href="#"
                  className="text-cyan-700 hover:underline dark:text-cyan-600"
                  onClick={() => dispatch(setForgotPasswordModal(true))}
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <a
                href="#"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
                onClick={onAlreadyCreatedAccount}
              >
                Create account
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
