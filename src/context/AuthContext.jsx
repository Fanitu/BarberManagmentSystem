import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest } from "../api/auth";

const AuthContext = createContext(null);
const STORAGE_KEY = "bms-session";

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = async ({ name, password, barberCode }) => {
    setLoggingIn(true);
    setLoginError("");
    try {
      const data = await loginRequest({ name, password, barberCode });
      setSession(data);
      return data;
    } catch (err) {
      setLoginError(err.message);
      return null;
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => setSession(null);

  return (
    <AuthContext.Provider
      value={{
        token: session?.token,
        user: session?.user,
        role: session?.user?.role, // 'worker' | 'admin'
        barberShop: session?.barberShop,
        isAuthenticated: Boolean(session?.token),
        login,
        logout,
        loginError,
        loggingIn,
        clearLoginError: () => setLoginError(""),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
