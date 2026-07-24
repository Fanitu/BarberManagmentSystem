import request from "./client";

export const listBarbers = (token) => request("/barbers", { token });

export const createBarber = (token, { name, phone, paymentDay }) =>
  request("/barbers", { method: "POST", token, body: { name, phone, paymentDay } });

export const updateBarber = (token, id, body) =>
  request(`/barbers/${id}`, { method: "PUT", token, body });

export const deleteBarber = (token, id) =>
  request(`/barbers/${id}`, { method: "DELETE", token });
