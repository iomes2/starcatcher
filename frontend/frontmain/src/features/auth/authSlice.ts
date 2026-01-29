import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { hostMicrofrontendAuth } from "../../services/microfrontendAuth";

interface User {
  id: number;
  nome: string;
  email: string;
  dataCriacao?: string;
  dataAtualizacao?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("jwt_token"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem("jwt_token", token);

      hostMicrofrontendAuth.notifyTokenSet(token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_nome");
      localStorage.removeItem("user_email");

      hostMicrofrontendAuth.notifyTokenRemoved();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
