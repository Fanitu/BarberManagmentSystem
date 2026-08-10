import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest, logout as logoutRequest, getCurrentUser } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [barberShop, setBarberShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user);
      setBarberShop(data.barberShop || null);
    } catch (err) {
      // Not authenticated - this is normal
      setUser(null);
      setBarberShop(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ name, password, barberCode }) => {
    setLoggingIn(true);
    setLoginError("");
    try {
      const data = await loginRequest({ name, password, barberCode });
      setUser(data.user);
      setBarberShop(data.barberShop || null);
      return data;
    } catch (err) {
      setLoginError(err.message);
      return null;
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setBarberShop(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return (
    <AuthContext.Provider
      value={{
        token: undefined, // No longer stored in JS
        user: user,
        role: user?.role,
        barberShop,
        isAuthenticated: Boolean(user),
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