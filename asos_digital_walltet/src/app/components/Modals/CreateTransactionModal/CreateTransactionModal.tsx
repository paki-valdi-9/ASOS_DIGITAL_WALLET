import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import {
  displayToast,
  enableCreateTransactionModal,
  setCreateTransactionModal,
  useAppDispatch,
  useAppSelector,
} from "app";

export const CreateTransactionModal: React.FC = ({}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isCreateTransactionModal = useAppSelector(enableCreateTransactionModal);
  const { userId } = useParams();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const resetInputs = (): void => {
    setEmail("");
    setAmount("");
  };

  const handleCancel = (): void => {
    dispatch(setCreateTransactionModal(false));
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

  const handleTransaction = (email: string): void => {
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

  return (
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
              onClick={() => handleTransaction(email)}
              disabled={email && amount ? false : true}
            >
              Send Money
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
