import { RootState } from "../store";
import { settingsSlice } from "./settings-slice";

export const {
  setLogInModal,
  setSignUpModal,
  setAssignedView,
  setCreateTransactionModal,
  setAddCardModal,
  setRemoveCardModal,
  setDepositBalanceModal,
  setWithdrawlBalanceModal,
  setForgotPasswordModal,
  setQrLogInModal,
  setResetPasswordModal,
} = settingsSlice.actions;

export const enableLogInModal = (state: RootState): any =>
  state.settings.logInModal;

export const enableSignUpModal = (state: RootState): any =>
  state.settings.signUpModal;

export const enableAssignedView = (state: RootState): any =>
  state.settings.assignedView;

export const enableCreateTransactionModal = (state: RootState): any =>
  state.settings.createTransactionModal;

export const enableAddCardModal = (state: RootState): any =>
  state.settings.addCardModal;

export const enableRemoveCardModal = (state: RootState): any =>
  state.settings.removeCardModal;

export const enableDepositBalanceModal = (state: RootState): any =>
  state.settings.depositBalanceModal;

export const enableWithdrawlBalanceModal = (state: RootState): any =>
  state.settings.withdrawlBalanceModal;

export const enableForgotPasswordModal = (state: RootState): any =>
  state.settings.forgotPasswordModal;

export const enableQrLogInModal = (state: RootState): any =>
  state.settings.qrLogInModal;

export const enableResetPasswordModal = (state: RootState): any =>
  state.settings.resetPasswordModal;
