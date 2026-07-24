import request from "./client";

export const login = ({ name, password, barberCode }) =>
  request("/auth/login", {
    method: "POST",
    body: { name, password, barberCode },
  });
