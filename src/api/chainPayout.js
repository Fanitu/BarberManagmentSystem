import request from "./client";

export const listPayableBarbersToday = () => request("/chainadmin/payouts/today");

export const payBarberNow = (barberId) =>
  request(`/chainadmin/payouts/${barberId}/pay`, { method: "POST" });

export const listPayoutHistory = () => request("/chainadmin/payouts/history");

export const getPayoutDetail = (barberId, paidAt) =>
  request(`/chainadmin/payouts/history/detail?barberId=${barberId}&paidAt=${encodeURIComponent(paidAt)}`);