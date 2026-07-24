import request from "./client";

export const createDebt = (token, { barberId, amount }) =>
  request("/debts", { method: "POST", token, body: { barberId, amount } });

export const listTodayDebts = (token) => request("/debts/today", { token });
