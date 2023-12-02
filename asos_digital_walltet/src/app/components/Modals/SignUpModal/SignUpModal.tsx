import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { ISignUpModal } from "./SignUpModal.interface";
import { getCurrency } from "country-currency-map";
import {
  displayToast,
  enableSignUpModal,
  setLogInModal,
  setQrLogInModal,
  setSignUpModal,
  useAppDispatch,
  useAppSelector,
  QrModal,
} from "app";
import styles from "./SignUpModal.module.scss";

export const SignUpModal: React.FC<ISignUpModal> = ({
  handleConfirm,
  handleCancel,
}) => {
  const dispatch = useAppDispatch();
  const isSignUpModal = useAppSelector(enableSignUpModal);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("");
  const [qrImage, setQrImage] = useState("");

  const resetInputs = (): void => {
    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
    setCurrency("");
  };

  const onCloseModal = (): void => {
    dispatch(setSignUpModal(false));
    resetInputs();
  };

  const onAlreadyRegistered = (): void => {
    onCloseModal();
    dispatch(setLogInModal(true));
  };

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setCurrency(event.target.value as string);
    } else {
      setCurrency("");
    }
  };

  const handleSignUp = (): void => {
    const signUpData = {
      email,
      name,
      password,
      confirmPassword,
      currency,
    };

    fetch("http://localhost:3000/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.imageData) {
          setQrImage(data.imageData);
          dispatch(setQrLogInModal(true));
        } else {
          displayToast("error", "Sign Up Failed", data.message);
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
      <QrModal qrImage={qrImage} />
      <Modal show={isSignUpModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Hello!
            </h3>
            <h3 className="text-xs font-medium text-gray-500 dark:text-white">
              Please sign up to continue
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Full Name" />
              </div>
              <TextInput
                value={name}
                onChange={(event: any) => setName(event.target.value)}
                id="name"
                placeholder="John Doe"
                required
              />
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email Address" />
              </div>
              <TextInput
                id="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(event: any) => setEmail(event.target.value)}
                required
              />
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                placeholder="********"
                id="password"
                type="password"
                value={password}
                onChange={(event: any) => setPassword(event.target.value)}
                required
              />
              <div className="mb-2 block">
                <Label htmlFor="repeat-password" value="Confirm Password" />
              </div>
              <TextInput
                placeholder="********"
                id="repeat-password"
                type="password"
                value={confirmPassword}
                onChange={(event: any) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
              <div className="mb-2 block">
                <Label htmlFor="currency" value="Your Country Currency" />
              </div>
              <div className={styles["select-card-input"]}>
                <Select
                  labelId="demo-simple-select-label"
                  id="currency-select"
                  value={currency}
                  onChange={handleChange}
                >
                  <MenuItem value={undefined}>None</MenuItem>
                  <MenuItem value={"EUR"}>Euro</MenuItem>
                  <MenuItem value={"USD"}>U.S. Dollar</MenuItem>
                  <MenuItem value={"CAD"}>Canadian Dollar</MenuItem>
                  <MenuItem value={"GBP"}>British Pound</MenuItem>
                  <MenuItem value={"CHZ"}>Swiss Franc</MenuItem>
                  <MenuItem value={"SEK"}>Swedish Krona</MenuItem>
                  <MenuItem value={"TRL"}>Turkish Lira</MenuItem>
                  <MenuItem value={"RUB"}>Russian Rouble</MenuItem>
                  <MenuItem value={"JPY"}>Japanese Yen</MenuItem>
                  <MenuItem value={"CNY"}>Chinese Yuan</MenuItem>
                  <MenuItem value={"SAR"}>Saudi Arabian Riyal</MenuItem>
                  <MenuItem value={"AUD"}>Australian Dollar</MenuItem>
                </Select>
              </div>
            </div>
            <div className="w-full">
              <Button
                onClick={handleSignUp}
                disabled={
                  name && email && password && confirmPassword && currency
                    ? false
                    : true
                }
              >
                Sign Up
              </Button>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Already a member?&nbsp;
              <a
                href="#"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
                onClick={onAlreadyRegistered}
              >
                Log into your account
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
