import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";

import { IAddCardModal } from "./AddCardModal.interface";
import {
  displayToast,
  enableAddCardModal,
  setAddCardModal,
  useAppDispatch,
  useAppSelector,
} from "app";

export const AddCardModal: React.FC<IAddCardModal> = ({ slot }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAddCardModal = useAppSelector(enableAddCardModal);
  const { userId } = useParams();
  const [number, setNumber] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [CVV, setCVV] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [nameOnCard, setNameOnCard] = useState<string>("");
  const [cardNumberValidated, setCardNumberValidated] =
    useState<boolean>(false);
  const [expiricyDateValidated, setExpiricyDateValidated] =
    useState<boolean>(false);
  const [cardCvcValidated, setCardCvcValidated] = useState<boolean>(false);
  const [cardHolderNameValidated, setCardHolderNameValidated] =
    useState<boolean>(false);
  const [cardTypeValidated, setCardTypeValidated] = useState<boolean>(false);

  const resetInputs = () => {
    setNumber("");
    setExpirationDate("");
    setCVV("");
    setNameOnCard("");
    setType("");
    setCardNumberValidated(false);
    setCardHolderNameValidated(false);
    setCardCvcValidated(false);
    setExpiricyDateValidated(false);
    setCardTypeValidated(false);
  };

  const inputValidation = (event: any) => {
    const newValue = event.target.value;
    switch (event.target.name) {
      case "number":
        const numericValue = newValue.replace(/\D/g, "");
        const formattedCardNumber = numericValue.replace(
          /(\d{4}(?!$))/g,
          "$1 "
        );
        setNumber(formattedCardNumber);
        if (formattedCardNumber.length === 19) {
          setCardNumberValidated(true);
        } else {
          setCardNumberValidated(false);
        }
        break;
      case "name":
        const holderNameValue = newValue.replace(/[0-9]/g, "");
        setNameOnCard(holderNameValue);
        if (/^[a-zA-Z]{3,} [a-zA-Z]{3,}$/.test(holderNameValue)) {
          setCardHolderNameValidated(true);
        } else {
          setCardHolderNameValidated(false);
        }
        break;
      case "expiry":
        const expiryValue = newValue.replace(/\D/g, "");
        const formattedExpiricyDate = expiryValue
          .replace(/(\d{2})(\d{2})/, "$1/$2")
          .slice(0, 5);
        if (newValue.length === 4) {
          setExpiricyDateValidated(true);
        } else {
          setExpiricyDateValidated(false);
        }
        setExpirationDate(formattedExpiricyDate);
        break;
      case "cvv":
        const cvcValue = newValue.replace(/\D/g, "");
        setCVV(cvcValue);
        if (newValue.length === 3) {
          setCardCvcValidated(true);
        } else {
          setCardCvcValidated(false);
        }
        break;
      case "type":
        const holderTypeValue = newValue.replace(/[0-9]/g, "");
        setType(holderTypeValue);
        if (/[a-zA-Z]{3,}/.test(holderTypeValue)) {
          setCardTypeValidated(true);
        } else {
          setCardTypeValidated(false);
        }
        break;
    }
  };

  const handleCancel = (): void => {
    resetInputs();
    dispatch(setAddCardModal(false));
  };

  const onCloseModal = (): void => {
    handleCancel();
  };

  const handleAddCard = (): void => {
    const cardData = {
      number,
      expirationDate,
      CVV,
      nameOnCard,
      type,
      slot,
    };

    fetch(`http://localhost:3000/addCard/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.registered === "true") {
          displayToast("success", "Congrats", data.message);
          onCloseModal();
          setTimeout(() => {
            window.location.reload();
          }, 1100);
        } else {
          displayToast("error", "Failed", data.message);
          resetInputs();
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to post transaction.");
        console.error("Error:", error);
      });
  };

  return (
    <Modal show={isAddCardModal} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Hello!
          </h3>
          <h3 className="text-xs font-medium text-gray-500 dark:text-white">
            If you wish to add card. Fill the inputs and hit add card.
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="number" value="Card Number" />
            </div>
            <TextInput
              type="text"
              name="number"
              placeholder="4111 1111 1111 1111"
              maxLength={19}
              value={number}
              onChange={inputValidation}
              color={cardNumberValidated ? "success" : "failure"}
              // onFocus={() => {}}
              required
            />
            <div className="mb-2 block">
              <Label htmlFor="name" value="Card Holder Full Name" />
            </div>
            <TextInput
              type="text"
              name="name"
              placeholder="John Smith"
              maxLength={50}
              value={nameOnCard}
              onChange={inputValidation}
              color={cardHolderNameValidated ? "success" : "failure"}
              onFocus={() => {}}
              required
            />
            <div className="mb-2 block">
              <Label htmlFor="expiry" value="Card Expiration Date" />
            </div>
            <TextInput
              type="text"
              name="expiry"
              placeholder="10/20"
              maxLength={4}
              value={expirationDate}
              onChange={inputValidation}
              color={expiricyDateValidated ? "success" : "failure"}
              onFocus={() => {}}
              required
            />
            <div className="mb-2 block">
              <Label htmlFor="cvv" value="CVV" />
            </div>
            <TextInput
              type="text"
              name="cvv"
              placeholder="111"
              maxLength={3}
              value={CVV}
              onChange={inputValidation}
              color={cardCvcValidated ? "success" : "failure"}
              onFocus={() => {}}
              required
            />
            <div className="mb-2 block">
              <Label htmlFor="type" value="Card Type" />
            </div>
            <TextInput
              type="text"
              name="type"
              placeholder="Visa"
              maxLength={15}
              value={type}
              onChange={inputValidation}
              color={cardTypeValidated ? "success" : "failure"}
              onFocus={() => {}}
              required
            />
          </div>
          <div className="w-full">
            <Button
              onClick={handleAddCard}
              disabled={
                number && nameOnCard && expirationDate && CVV && type
                  ? false
                  : true
              }
            >
              Add Card
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
