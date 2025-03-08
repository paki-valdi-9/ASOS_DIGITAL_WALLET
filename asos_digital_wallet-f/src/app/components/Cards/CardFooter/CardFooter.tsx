import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CardFooter.module.scss";
import {
  DepositModal,
  ResetPasswordModal,
  WithdrawlModal,
  displayToast,
  setCreateTransactionModal,
  setDepositBalanceModal,
  setResetPasswordModal,
  setWithdrawlBalanceModal,
  useAppDispatch,
} from "app";

export const CardFooter: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const [enableDepositWithdrawl, setEnableDepositWithdrawl] =
    useState<boolean>(false);
  const appInfo = {
    thirdSection: "Log Out",
    depositSection: "Deposit",
    withdrawlSection: "Withdrawl",
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
        if (data[0] === null && data[1] === null) {
          setEnableDepositWithdrawl(false);
        } else {
          setEnableDepositWithdrawl(true);
        }
      })
      .catch((error) => {
        displayToast("error", "Fetch Error", "Failed to get cards.");
        console.error("Error:", error);
      });
  }, []);

  const handleSendMoney = (): void => {
    dispatch(setCreateTransactionModal(true));
  };

  return (
    <>
      <ResetPasswordModal />
      <DepositModal />
      <WithdrawlModal />
      <div className={styles["footer-btn-container"]}>
        <div className={styles["deposit-withdrawl"]}>
          <Button
            className={styles["deposit-btn"]}
            onClick={() => dispatch(setDepositBalanceModal(true))}
            label={appInfo.depositSection}
            icon="pi pi-upload"
            text
            raised
            disabled={!enableDepositWithdrawl}
          ></Button>
          <Button
            className={styles["withdrawl-btn"]}
            onClick={() => dispatch(setWithdrawlBalanceModal(true))}
            label={appInfo.withdrawlSection}
            icon="pi pi-download"
            text
            raised
            disabled={!enableDepositWithdrawl}
          ></Button>
        </div>
        <div className={styles["footer-action-buttons"]}>
          <Button
            className={styles["logout-btn"]}
            onClick={() => dispatch(setResetPasswordModal(true))}
            icon="pi pi-lock"
            text
            raised
          ></Button>
          <Button
            className={styles["logout-btn"]}
            onClick={() => navigate("/")}
            icon="pi pi-sign-out"
            text
            raised
          ></Button>
        </div>
      </div>
    </>
  );
};
