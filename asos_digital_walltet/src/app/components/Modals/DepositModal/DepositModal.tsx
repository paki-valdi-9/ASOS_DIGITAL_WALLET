import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import styles from "./DepositModal.module.scss";

import {
  displayToast,
  enableDepositBalanceModal,
  setDepositBalanceModal,
  useAppDispatch,
  useAppSelector,
} from "app";

export const DepositModal: React.FC = ({}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isDepositBalanceModal = useAppSelector(enableDepositBalanceModal);
  const { userId } = useParams();
  const [amount, setAmount] = useState("");
  const [card, setCard] = React.useState("");
  const [card1, setCard1] = React.useState<boolean>(false);
  const [card2, setCard2] = React.useState<boolean>(false);
  const [slot, setSlot] = React.useState(0);

  const resetInputs = (): void => {
    setCard("");
    setAmount("");
  };

  const handleCancel = (): void => {
    dispatch(setDepositBalanceModal(false));
  };

  const onCloseModal = (): void => {
    handleCancel();
    resetInputs();
  };

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setCard(event.target.value as string);
    } else {
      setCard("");
    }
  };

  const handleAmountChange = (event: any) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/\D/g, "");

    if (sanitizedValue === "" || parseInt(sanitizedValue) <= 0) {
      setAmount("");
    } else {
      setAmount(sanitizedValue);
    }
  };

  useEffect(() => {
    Number(card) === 1 ? setSlot(1) : setSlot(2);
  }, [slot, card]);

  const handleDepositMoney = (): void => {
    const depositData = {
      slot,
      amount,
    };

    fetch(`http://localhost:3000/deposit/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(depositData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.sent === "true") {
          displayToast("success", "Congrats!", data.message);
          onCloseModal();
          setTimeout(() => {
            window.location.reload();
          }, 1100);
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

  useEffect(() => {
    fetch(`http://localhost:3000/cards/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data[0] !== null) {
          setCard1(true);
        }
        if (data[1] !== null) {
          setCard2(true);
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to post transaction.");
        console.error("Error:", error);
      });
  }, []);

  return (
    <Modal show={isDepositBalanceModal} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Hello!
          </h3>
          <h3 className="text-xs font-medium text-gray-500 dark:text-white">
            If you wish to send funds. Select the card fill the amount input and
            deposit.
          </h3>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="card-select"
                value="Select card to do deposit with"
              />
            </div>
            <div className={styles["select-card-input"]}>
              <Select
                labelId="demo-simple-select-label"
                id="card-select"
                value={card}
                onChange={handleChange}
              >
                <MenuItem value={undefined}>None</MenuItem>
                {card1 ? <MenuItem value={1}>Card1</MenuItem> : undefined}
                {card2 ? <MenuItem value={2}>Card2</MenuItem> : undefined}
              </Select>
            </div>
            <div className="mb-2 block">
              <Label htmlFor="amount" value="Amount" />
            </div>
            <TextInput
              placeholder="Amount"
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              required
            />
          </div>
          <div className="w-full">
            <Button
              onClick={handleDepositMoney}
              disabled={card && amount ? false : true}
            >
              Deposit
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
