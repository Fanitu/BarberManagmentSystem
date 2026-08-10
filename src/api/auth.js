import request from "./client";

export const login = ({ name, password, barberCode }) =>
  request("/auth/login", {
    method: "POST",
    body: { name, password, barberCode },
  });

export const logout = () =>
  request("/auth/logout", {
    method: "POST",
  });

export const getCurrentUser = () =>
  request("/auth/me");