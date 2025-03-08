import { PayloadAction } from "@reduxjs/toolkit";
import { ISettingsState } from "./settings-interface";

export const reducer = {
  setAssignedView: (state: ISettingsState, action: PayloadAction<boolean>) => {
    state.assignedView = action.payload;
  },
  setLogInModal: (state: ISettingsState, action: PayloadAction<boolean>) => {
    state.logInModal = action.payload;
  },
  setSignUpModal: (state: ISettingsState, action: PayloadAction<boolean>) => {
    state.signUpModal = action.payload;
  },
  setCreateTransactionModal: (
    state: ISettingsState,
    action: PayloadAction<boolean>
  ) => {
    state.createTransactionModal = action.payload;
  },
  setAddCardModal: (state: ISettingsState, action: PayloadAction<boolean>) => {
    state.addCardModal = action.payload;
  },
  setRemoveCardModal: (
    state: ISettingsState,
    action: PayloadAction<boolean>
  ) => {
    state.removeCardModal = action.payload;
  },
  setDepositBalanceModal: (
    state: ISettingsState,
    action: PayloadAction<boolean>
  ) => {
    state.depositBalanceModal = action.payload;
  },
  setWithdrawlBalanceModal: (
    state: ISettingsState,
    action: PayloadAction<boolean>
  ) => {
    state.withdrawlBalanceModal = action.payload;
  },
  setForgotPasswordModal: (
    state: ISettingsState,
    action: PayloadAction<boolean>
  ) => {
    state.forgotPasswordModal = action.payload;
  },
  setQrLogInModal: (state: ISettingsState, action: PayloadAction<boolean>) => {
    state.qrLogInModal = action.payload;
  },
  setResetPasswordModal: (
    state: ISettingsState,
    action: PayloadAction<boolean>
  ) => {
    state.resetPasswordModal = action.payload;
  },
};
