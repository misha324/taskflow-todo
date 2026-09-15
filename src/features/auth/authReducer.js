import { createReducer } from "@reduxjs/toolkit";
import { login, logout } from "./authActions";

const initialState = {
  isLoggedIn: false,
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state) => {
      state.isLoggedIn = true;
    })
    .addCase(logout, (state) => {
      state.isLoggedIn = false;
    });
});

export default authReducer;