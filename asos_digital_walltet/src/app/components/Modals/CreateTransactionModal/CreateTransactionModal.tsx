import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import styles from "./CreateTransactionModal.module.scss";
import {
  displayToast,
  enableCreateTransactionModal,
  setCreateTransactionModal,
  useAppDispatch,
  useAppSelector,
} from "app";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export const CreateTransactionModal: React.FC = ({}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isCreateTransactionModal = useAppSelector(enableCreateTransactionModal);
  const { userId } = useParams();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [slot, setSlot] = React.useState("");
  const [card1, setCard1] = React.useState<boolean>(false);
  const [card2, setCard2] = React.useState<boolean>(false);
  const [balanceMethod, setBalanceMethod] = useState("");
  const [cardMethod, setCardMethod] = useState("");

  const validationInputs = (): boolean => {
    if (Number(method) === 1) {
      return true;
    } else if (Number(method) === 2) {
      if (card1 || card2) {
        return true;
      }
      return false;
    }
    return false;
  };

  const resetInputs = (): void => {
    setEmail("");
    setAmount("");
    setMethod("");
    setSlot("");
  };

  const handleCancel = (): void => {
    dispatch(setCreateTransactionModal(false));
  };

  const handleTransaction = (): void => {
    if (Number(method) === 1) {
      handleUserTransaction();
    }
    if (Number(method) === 2) {
      handleCardTransaction();
    }
  };

  const handleMethodChange = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setMethod(event.target.value as string);
    } else {
      setMethod("");
    }
  };

  const handleCardChange = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setSlot(event.target.value as string);
    } else {
      setSlot("");
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

  const onCloseModal = (): void => {
    handleCancel();
    resetInputs();
  };

  const handleUserTransaction = (): void => {
    console.log("user");
    const transactionData = {
      userId,
      email,
      amount,
    };
    fetch("http://localhost:3000/userToUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.sent === "true") {
          displayToast("success", "Congrats", data.message);
          onCloseModal();
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          displayToast("error", "Sent Failed", data.message);
          resetInputs();
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to post transaction.");
        console.error("Error:", error);
      });
  };

  const handleCardTransaction = (): void => {
    console.log("card");
    const transactionData = {
      userId,
      email,
      amount,
      slot,
    };
    fetch("http://localhost:3000/cardToUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.sent === "true") {
          displayToast("success", "Congrats", data.message);
          onCloseModal();
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          displayToast("error", "Sent Failed", data.message);
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
    <>
      <Modal
        show={isCreateTransactionModal}
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
              To send the funds to someone fill the inputs and hit the send.
            </h3>
            <div>
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
                  value={method}
                  onChange={handleMethodChange}
                >
                  <MenuItem value={undefined}>None</MenuItem>
                  <MenuItem value={1}>Balance Method</MenuItem>
                  <MenuItem value={2}>Card Method</MenuItem>
                </Select>
              </div>
              {Number(method) === 2 ? (
                <>
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
                      value={slot}
                      onChange={handleCardChange}
                    >
                      <MenuItem value={undefined}>None</MenuItem>
                      {card1 ? <MenuItem value={1}>Card1</MenuItem> : undefined}
                      {card2 ? <MenuItem value={2}>Card2</MenuItem> : undefined}
                    </Select>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="mb-2 block">
                <Label htmlFor="email" value="Sender Email Address" />
              </div>
              <TextInput
                id="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
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
                onClick={() => handleTransaction()}
                disabled={validationInputs() && email && amount ? false : true}
              >
                Send Money
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
