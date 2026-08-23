import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  login as loginService,
  logout as logoutService,
  isAuthenticated,
} from "../services/authService";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

  const [authenticated, setAuthenticated] =
    useState(() => {
      return isAuthenticated();
    });


  // ============================================================
  // LOGIN
  // ============================================================

  const login = async (
    email,
    password
  ) => {

    const response =
      await loginService(
        email,
        password
      );

    // authService has already stored
    // access_token in localStorage.

    const authenticatedNow =
      isAuthenticated();

    if (!authenticatedNow) {
      throw new Error(
        "Login succeeded but authentication token was not saved."
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


  // ============================================================
  // CONTEXT
  // ============================================================

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


export function useAuth() {

  return useContext(
    AuthContext
  );
}