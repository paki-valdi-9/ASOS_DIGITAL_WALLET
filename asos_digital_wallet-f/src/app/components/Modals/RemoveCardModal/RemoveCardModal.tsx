import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";

import styles from "./RemoveCardModal.module.scss";
import { IRemoveCardModal } from "./RemoveCardModal.interface";
import {
  displayToast,
  enableRemoveCardModal,
  setRemoveCardModal,
  useAppDispatch,
  useAppSelector,
} from "app";

export const RemoveCardModal: React.FC<IRemoveCardModal> = ({ cardSlot }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isRemoveCardModal = useAppSelector(enableRemoveCardModal);
  const { userId } = useParams();
  const [cardNumber, setCardNumber] = useState<string>("");

  const handleCancel = (): void => {
    dispatch(setRemoveCardModal(false));
  };

  const onCloseModal = (): void => {
    handleCancel();
  };

  const handleRemoveCard = (): void => {
    const cardData = {
      cardSlot,
    };

    fetch("http://localhost:3000/deleteCard", {
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
        if (data.registered === "false") {
          window.location.reload();
          displayToast("success", "Congrats", data.message);
          onCloseModal();
        } else {
          displayToast("error", "Remove Failed", data.message);
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to post transaction.");
        console.error("Error:", error);
      });
  };

  return (
    <Modal show={isRemoveCardModal} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Are you sure that you want to delete this card?
          </h3>
          <h3 className="text-xs font-medium text-gray-500 dark:text-white">
            The card will be deleted immediately. This action cannot be undone.
          </h3>
          <div className={styles["w-full"]}>
            <Button onClick={handleRemoveCard}>Yes</Button>
            <Button onClick={() => handleCancel()}>Cancel</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
