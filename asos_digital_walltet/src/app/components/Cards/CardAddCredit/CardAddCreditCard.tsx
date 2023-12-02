import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import IconButton from "@mui/material/IconButton";
import AddCardIcon from "@mui/icons-material/AddCard";
import CreditCardOffSharpIcon from "@mui/icons-material/CreditCardOffSharp";
import styles from "./CardAddCreditCard.module.scss";
import {
  AddCardModal,
  setAddCardModal,
  useAppDispatch,
  RemoveCardModal,
  setRemoveCardModal,
  displayToast,
} from "app";
import { useParams } from "react-router-dom";

export const CardAddCreditCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const [slot, setSlot] = useState<number>(0);
  const [cardSlot, setCardSlot] = useState<number>(0);

  const appInfo = {
    addCard: "Add Card",
    removeCard: "Remove Card",
  };

  const [cardFirstInputs, setCardFirstInputs] = useState({
    number: "",
    expirationDate: "",
    CVV: "",
    nameOnCard: "",
    type: "",
  });

  const [cardSecondInputs, setCardSecondInputs] = useState({
    number: "",
    expirationDate: "",
    CVV: "",
    nameOnCard: "",
    type: "",
  });

  function dispatchRemoveFirstCardModal(): void {
    setCardSlot(1);
    dispatch(setRemoveCardModal(true));
  }

  function dispatchRemoveSecondCardModal(): void {
    setCardSlot(2);
    dispatch(setRemoveCardModal(true));
  }

  function dispatchFirstAddCardModal(): void {
    setSlot(1);
    dispatch(setAddCardModal(true));
  }

  function dispatchSecondAddCardModal(): void {
    setSlot(2);
    dispatch(setAddCardModal(true));
  }

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
        if (data[0] !== null || data[1] !== null) {
          if (data[0] !== null) {
            setCardFirstInputs(data[0]);
          }
          if (data[1] !== null) {
            setCardSecondInputs(data[1]);
          }
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to get cards.");
        console.error("Error:", error);
      });
  }, []);

  const handleInputChange = (evt: any) => {
    const { name, value } = evt.target;

    setCardFirstInputs((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt: any) => {
    setCardFirstInputs((prev: any) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <>
      <AddCardModal slot={slot} />
      <RemoveCardModal cardSlot={cardSlot} />
      <div className={styles["credit-cards"]}>
        <div className={styles["cards-container-1"]}>
          <Cards
            number={cardFirstInputs.number ?? ""}
            expiry={cardFirstInputs.expirationDate ?? ""}
            cvc={cardFirstInputs.CVV ?? ""}
            name={cardFirstInputs.nameOnCard ?? ""}
            focused="name"
          />
          <div className={styles["add-remove-card"]}>
            <IconButton
              onClick={() => dispatchFirstAddCardModal()}
              className={styles["card-button"]}
              disabled={cardFirstInputs.number !== "" ? true : false}
            >
              <AddCardIcon></AddCardIcon>
            </IconButton>
            <IconButton
              onClick={() => dispatchRemoveFirstCardModal()}
              className={styles["card-button"]}
              disabled={cardFirstInputs.number === "" ? true : false}
            >
              <CreditCardOffSharpIcon></CreditCardOffSharpIcon>
            </IconButton>
          </div>
        </div>
        <div className={styles["cards-container-2"]}>
          <Cards
            number={cardSecondInputs.number ?? ""}
            expiry={cardSecondInputs.expirationDate ?? ""}
            cvc={cardSecondInputs.CVV ?? ""}
            name={cardSecondInputs.nameOnCard ?? ""}
            focused="name"
          />
          <div className={styles["add-remove-card"]}>
            <IconButton
              onClick={() => dispatchSecondAddCardModal()}
              className={styles["card-button"]}
              disabled={cardSecondInputs.number !== "" ? true : false}
            >
              <AddCardIcon></AddCardIcon>
            </IconButton>
            <IconButton
              onClick={() => dispatchRemoveSecondCardModal()}
              className={styles["card-button"]}
              disabled={cardSecondInputs.number === "" ? true : false}
            >
              <CreditCardOffSharpIcon></CreditCardOffSharpIcon>
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
};
