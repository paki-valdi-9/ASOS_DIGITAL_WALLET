import React from "react";

import { RouteObject } from "react-router-dom";
import { Landing } from "app/layout";
import { LandingView, DigitalWalletView } from "pages";

export const Routess = (): RouteObject[] => [
  {
    path: "/",
    element: <LandingView />,
  },
  {
    path: "/digital-wallet/:userId",
    element: <DigitalWalletView />,
  },
  {
    path: "/login",
    element: <></>,
  },
  {
    path: "/register",
    element: <></>,
  },
];
