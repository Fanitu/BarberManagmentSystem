import request from "./client";

export const listAllServices = () => request("/chainadmin/services");
export const createShopService = (data) => request("/chainadmin/services", { method: "POST", body: data });
export const updateShopService = (id, data) => request(`/chainadmin/services/${id}`, { method: "PUT", body: data });
export const deleteShopService = (id) => request(`/chainadmin/services/${id}`, { method: "DELETE" });