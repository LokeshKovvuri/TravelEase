import {
  useState,
} from "react";

import {
  login as loginService,
  logout as logoutService,
  getToken,
} from "../services/authService";
import AuthContext from "./auth-context";


export function AuthProvider({ children }) {

  const [authenticated, setAuthenticated] =
    useState(() => {
      return Boolean(getToken());
    });


  // ============================================================
  // LOGIN
  // ============================================================

  const login = async (email, password) => {

    const response =
      await loginService(
        email,
        password
      );

    const token = getToken();

    if (!token) {

      throw new Error(
        "Authentication token was not saved."
      );

    }

    setAuthenticated(true);

    return response;
  };


  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = () => {

    logoutService();

    setAuthenticated(false);

  };


  return (
    <AuthContext.Provider
      value={{
        authenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
