import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import styles from "./WithdrawlModal.module.scss";
import {
  displayToast,
  enableWithdrawlBalanceModal,
  setWithdrawlBalanceModal,
  useAppDispatch,
  useAppSelector,
} from "app";

export const WithdrawlModal: React.FC = ({}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isWithdrawlBalanceModal = useAppSelector(enableWithdrawlBalanceModal);
  const { userId } = useParams();
  const [amount, setAmount] = useState("");
  const [card, setCard] = React.useState("");
  const [card1, setCard1] = React.useState<boolean>(false);
  const [card2, setCard2] = React.useState<boolean>(false);
  const [slot, setSlot] = React.useState(0);

  const validateAmount = (value: string) => {
    const parsedValue = parseInt(value, 10);
    return parsedValue > 0 ? undefined : "Amount must be greater than 0";
  };

  const resetInputs = (): void => {
    setCard("");
    setAmount("");
  };

  const handleCancel = (): void => {
    dispatch(setWithdrawlBalanceModal(false));
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

  const handleWithdrawlMoney = (): void => {
    const withdrawlData = {
      slot,
      amount,
    };

    fetch(`http://localhost:3000/withdrawal/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(withdrawlData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.withdrawl === "true") {
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
    <Modal
      show={isWithdrawlBalanceModal}
      size="md"
      onClose={onCloseModal}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Hello!
          </h3>
          <h3 className="text-xs font-medium text-gray-500 dark:text-white">
            If you wish to withdraw funds. Select the card fill the amount input
            and deposit.
          </h3>
          <div>
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
            <div className="mb-2 block">
              <Label
                htmlFor="card-select"
                value="Select card where to withdraw"
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
                {card1 ? <MenuItem value={1}>Card 1</MenuItem> : undefined}
                {card2 ? <MenuItem value={2}>Card 2</MenuItem> : undefined}
              </Select>
            </div>
          </div>
          <div className="w-full">
            <Button
              onClick={handleWithdrawlMoney}
              disabled={card && amount ? false : true}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
