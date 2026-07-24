import request from "./client";

// Catalog (admin manages, worker reads for the select)
export const listServices = (token) => request("/services", { token });

export const createService = (token, { name, price, shopPercent }) =>
  request("/services", { method: "POST", token, body: { name, price, shopPercent } });

export const updateService = (token, id, body) =>
  request(`/services/${id}`, { method: "PUT", token, body });

export const deleteService = (token, id) =>
  request(`/services/${id}`, { method: "DELETE", token });

// Service log (worker submits, both roles can view today's entries)
export const submitServiceLog = (token, { barberId, serviceId, price }) =>
  request("/services/log", {
    method: "POST",
    token,
    body: { barberId, serviceId, price },
  });

export const listTodayServiceLogs = (token) =>
  request("/services/log/today", { token });
