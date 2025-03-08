import React, { useEffect, useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

import { Button } from "primereact/button";

import {
  LogInModal,
  SignUpModal,
  useAppDispatch,
  setSignUpModal,
  setLogInModal,
} from "app";
import "./Landing.scss";

const appInfo = {
  headline: "Welcome..",
  description: " to digital wallet!",
  firstSection: "Log in",
  secondSection: "Sign up",
};

const LandingView: React.FC = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");

  function dispatchSignUpModal(): void {
    dispatch(setSignUpModal(true));
  }

  function dispatchLogInModal(): void {
    dispatch(setLogInModal(true));
  }

  return (
    <>
      <SignUpModal />
      <LogInModal />

      <div className="main-container">
        <div className="container-image"></div>
        <div className="background-container">
          <div className="landing-panel-container">
            <div className="title-container">
              <h1>{appInfo.headline}</h1>
              <h3>{appInfo.description}</h3>
            </div>
            <div className="log-sign-container">
              <Button
                onClick={() => dispatchLogInModal()}
                label={appInfo.firstSection}
                icon="pi pi-sign-in"
                text
                raised
              ></Button>
              <Button
                onClick={() => dispatchSignUpModal()}
                label={appInfo.secondSection}
                icon="pi pi-user-edit"
                text
                raised
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingView;
