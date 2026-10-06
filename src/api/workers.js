import request from "./client";

export const listWorkers = () => request("/workers");
export const activateWorker = (id) => request(`/workers/${id}/activate`, { method: "PATCH" });
export const deactivateWorker = (id) => request(`/workers/${id}/deactivate`, { method: "PATCH" });
export const deleteWorker = (id) => request(`/workers/${id}`, { method: "DELETE" });