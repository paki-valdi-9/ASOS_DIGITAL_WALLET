import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import QRCode from "qrcode.react";
import MenuItem from "@mui/material/MenuItem";
import styles from "./qrModal.module.scss";
import { IQrModal } from "./qrModal.interface";
import {
  displayToast,
  enableQrLogInModal,
  setQrLogInModal,
  setSignUpModal,
  useAppDispatch,
  useAppSelector,
} from "app";

export const QrModal: React.FC<IQrModal> = ({ qrImage }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isQrModal = useAppSelector(enableQrLogInModal);
  const { userId } = useParams();
  const [authCode, setAuthCode] = useState("");

  const validateAmount = (value: string) => {
    const parsedValue = parseInt(value, 10);
    return parsedValue > 0 ? undefined : "Amount must be greater than 0";
  };

  const resetInputs = (): void => {
    setAuthCode("");
  };

  const handleCancel = (): void => {
    dispatch(setQrLogInModal(false));
  };

  const onCloseModal = (): void => {
    handleCancel();
    resetInputs();
  };

  const onCloseLandingModals = (): void => {
    handleCancel();
    dispatch(setSignUpModal(false));
    resetInputs();
  };

  const handleAuthCodeChange = (event: any) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/\D/g, "");
    setAuthCode(sanitizedValue);
  };

  const handleSet2fa = (): void => {
    fetch(`http://localhost:3000/set2fa/${authCode}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data: any) => {
        if (data.created === "true") {
          displayToast("success", "Congrats!", data.message);
          onCloseLandingModals();
          navigate(`/digital-wallet/${data.user.id}`);
        } else {
          displayToast("error", "Denied!", data.message);
          resetInputs();
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to post transaction.");
        console.error("Error:", error);
      });
  };

  return (
    <Modal show={isQrModal} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Hello!
          </h3>
          <h3 className="text-xs font-medium text-gray-500 dark:text-white">
            You need to scan the qr code and set 2auth using your phone.
            Generated code type in the input and set you account.
          </h3>
          <div>
            <div className={styles["qr-code-container"]}>
              <img src={qrImage}></img>
            </div>
            <div className="mb-2 block">
              <Label htmlFor="authCode" value="Auth Code" />
            </div>
            <TextInput
              placeholder="Enter Auth Code"
              id="authCode"
              type="text"
              maxLength={6}
              value={authCode}
              onChange={handleAuthCodeChange}
              required
            />
          </div>
          <div className="w-full">
            <Button
              onClick={handleSet2fa}
              disabled={authCode && authCode.length == 6 ? false : true}
            >
              Set 2Auth
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
