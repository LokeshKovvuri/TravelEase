import { createContext, useContext, useState } from "react";
import {
  login as loginService,
  logout as logoutService,
  isAuthenticated,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(
    isAuthenticated()
  );

  const login = async (email, password) => {
    await loginService(email, password);
    setAuthenticated(true);
  };

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

export function useAuth() {
  return useContext(AuthContext);
}