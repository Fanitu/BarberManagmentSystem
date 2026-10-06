import request from "./client";

export const listAllBarbers = () => request("/chainadmin/barbers");
export const updateBarber = (id, data) => request(`/chainadmin/barbers/${id}`, { method: "PUT", body: data });
export const deleteBarber = (id) => request(`/chainadmin/barbers/${id}`, { method: "DELETE" });

export const listAllWorkers = () => request("/chainadmin/workers");

export const activateWorker = (id) => request(`/chainadmin/workers/${id}/activate`, { method: "PATCH" });
export const deactivateWorker = (id) => request(`/chainadmin/workers/${id}/deactivate`, { method: "PATCH" });
export const deleteWorker = (id) => request(`/chainadmin/workers/${id}`, { method: "DELETE" });