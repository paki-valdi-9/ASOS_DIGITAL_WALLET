import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import styles from "./CardHeadline.module.scss";
import { formatCurrency } from "country-currency-map";
import {
  CreateTransactionModal,
  displayToast,
  setCreateTransactionModal,
  useAppDispatch,
} from "app";
import { useParams } from "react-router-dom";

export const CardHeadline: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const userId: string = params.userId ?? "";
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");
  const appInfo = {
    headline: "My Wallet",
    firstSection: "Send",
    balance: "Total Balance:",
  };

  const handleSendMoney = (): void => {
    dispatch(setCreateTransactionModal(true));
  };

  useEffect(() => {
    fetch(`http://localhost:3000/balance/${userId}`, {
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
        if (data.currency) {
          setCurrency(data.currency);
        }
        if (data.balance !== undefined) {
          setBalance(data.balance);
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to get user balace.");
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <CreateTransactionModal />
      <div className={styles["title-container"]}>
        <div className={styles["my-wallet-container"]}>
          <div className={styles["my-wallet-headline"]}>
            <h1>{appInfo.headline}</h1>
          </div>
          <div className={styles["my-wallet-send"]}>
            <Button
              onClick={handleSendMoney}
              label={appInfo.firstSection}
              icon="pi pi-send"
              text
              raised
            ></Button>
          </div>
        </div>
        <div className={styles["container-balance"]}>
          <p className={styles["balance-headline"]}>{appInfo.balance}</p>
          <p className={styles["balance"]}>
            {currency !== "" ? formatCurrency(balance, currency) : balance}
          </p>
        </div>
      </div>
    </>
  );
};
