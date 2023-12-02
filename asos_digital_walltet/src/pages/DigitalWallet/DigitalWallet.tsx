import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { Button } from "primereact/button";

import {
  CardHeadline,
  CardTransactionHistory,
  CardAddCreditCard,
  CardFooter,
} from "app";
import styles from "./DigitalWallet.module.scss";

const appInfo = {
  headline: "My Wallet",
  firstSection: "Send",
  secondSection: "Show Transaction History",
  thirdSection: "Log Out",
  cardSection: "Add Card",
  depositSection: "Deposit",
  withdrawlSection: "Withdrawl",
  balance: "Total Balance:",
};

const DigitalWalletView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles["main-container"]}>
        <div className={styles["background-container"]}>
          <CardHeadline />
          <div className={styles["second-section"]}>
            <div className={styles["credit-card"]}>
              <CardAddCreditCard />
            </div>
            <div className={styles["transaction-history"]}>
              <CardTransactionHistory />
            </div>
          </div>

          <div className={styles["footer-btns"]}>
            <CardFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default DigitalWalletView;
