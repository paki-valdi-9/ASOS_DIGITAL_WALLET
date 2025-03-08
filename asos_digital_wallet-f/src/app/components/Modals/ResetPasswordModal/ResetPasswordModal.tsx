import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { ISignUpModal } from "./ResetPasswordModal.interface";
import { getCurrency } from "country-currency-map";
import {
  displayToast,
  useAppDispatch,
  useAppSelector,
  enableResetPasswordModal,
  setResetPasswordModal,
} from "app";
import styles from "./SignUpModal.module.scss";

export const ResetPasswordModal: React.FC = ({}) => {
  const dispatch = useAppDispatch();
  const isResetPasswordModal = useAppSelector(enableResetPasswordModal);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetInputs = (): void => {
    setOldPassword("");
    setPassword("");
    setConfirmPassword("");
  };

  const onCloseModal = (): void => {
    dispatch(setResetPasswordModal(false));
    resetInputs();
  };

  const handleResetPassword = (): void => {
    const resetPasswordData = {
      oldPassword,
      password,
      confirmPassword,
    };

    fetch(`http://localhost:3000/resetPassword`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resetPasswordData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.reset === "true") {
          displayToast("success", "Congrats", data.message);
          onCloseModal();
        } else {
          displayToast("error", "Failed", data.message);
          resetInputs();
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to post user.");
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Modal show={isResetPasswordModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Hello!
            </h3>
            <h3 className="text-xs font-medium text-gray-500 dark:text-white">
              If you with to reset your password please fill the inputs and hit
              reset.
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="oldPassword" value="Old Password" />
              </div>
              <TextInput
                placeholder="********"
                id="password"
                type="password"
                value={oldPassword}
                onChange={(event: any) => setOldPassword(event.target.value)}
                required
              />
              <div className="mb-2 block">
                <Label htmlFor="password" value="New Password" />
              </div>
              <TextInput
                placeholder="********"
                id="newPassword"
                type="password"
                value={password}
                onChange={(event: any) => setPassword(event.target.value)}
                required
              />
              <div className="mb-2 block">
                <Label htmlFor="repeat-password" value="Confirm New Password" />
              </div>
              <TextInput
                placeholder="********"
                id="new-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event: any) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
            </div>
            <div className="w-full">
              <Button
                onClick={handleResetPassword}
                disabled={
                  oldPassword && password && confirmPassword ? false : true
                }
              >
                Reset
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
