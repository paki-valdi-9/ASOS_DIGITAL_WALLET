import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { toast } from "react-toastify";

import styles from "./ForgotPasswordModal.module.scss";
import { IForgotPasswordModal } from "./ForgotPasswordModal.interface";
import {
  displayToast,
  enableForgotPasswordModal,
  enableLogInModal,
  setForgotPasswordModal,
  setLogInModal,
  setSignUpModal,
  useAppDispatch,
  useAppSelector,
} from "app";

export const ForgotPasswordModal: React.FC<IForgotPasswordModal> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isForgotPasswordModal = useAppSelector(enableForgotPasswordModal);
  const [email, setEmail] = useState("");

  const resetInputs = (): void => {
    setEmail("");
  };

  const onCloseModal = (): void => {
    resetInputs();
    dispatch(setForgotPasswordModal(false));
  };

  const handleForgotPassword = (): void => {
    const modalData = {
      email,
    };
    fetch("http://localhost:3000/forgotPassword", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modalData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "200") {
          displayToast("success", "Congrats", data.message);
          onCloseModal();
        } else if (data.status === "401") {
          displayToast("error", "Reset Password Failed", data.message);
          resetInputs();
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to post forgot password.");
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Modal
        show={isForgotPasswordModal}
        size="md"
        onClose={onCloseModal}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Are you with to proceed?
            </h3>
            <h3 className="text-xs font-medium text-gray-500 dark:text-white">
              After confirm an emil will be sent with your new generated
              password.
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
            <div className={styles["w-full"]}>
              <Button
                onClick={handleForgotPassword}
                disabled={email ? false : true}
              >
                Confirm
              </Button>
              <Button onClick={onCloseModal}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
