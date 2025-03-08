import { createSlice } from "@reduxjs/toolkit";

import { ISettingsState } from "./settings-interface";
import { reducer } from "./settings-reducer";

const initialState: ISettingsState = {
  logInModal: false,
  signUpModal: false,
  assignedView: false,
  createTransactionModal: false,
  addCardModal: false,
  removeCardModal: false,
  depositBalanceModal: false,
  withdrawlBalanceModal: false,
  forgotPasswordModal: false,
  qrLogInModal: false,
  resetPasswordModal: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: reducer,
});

export const settingsReducer = settingsSlice.reducer;
