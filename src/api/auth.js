import request from "./client";

export const login = ({ name, password, barberCode }) =>
  request("/auth/login", {
    method: "POST",
    body: { name, password, barberCode },
  });

  
export const acceptChainAdminInvite = ({ token, name, password }) =>
  request("/auth/chainadmin-setup", { method: "POST", body: { token, name, password } });

export const acceptAdminInvite = ({ token, name, password }) =>
  request("/auth/admin-setup", { method: "POST", body: { token, name, password } });

export const logout = () =>
  request("/auth/logout", {
    method: "POST",
  });

export const getCurrentUser = () =>
  request("/auth/me");