import request from "./client";

export const listPayableBarbersToday = (token) => request("/payouts/today", { token });

export const payBarberNow = (token, barberId) =>
  request(`/payouts/${barberId}/pay`, { method: "POST", token });
