import request from "./client";

export const listMonthlyExpenses = (token) => request("/monthly-expenses", { token });

export const createMonthlyExpense = (token, { name, price }) =>
  request("/monthly-expenses", { method: "POST", token, body: { name, price } });

export const updateMonthlyExpense = (token, id, body) =>
  request(`/monthly-expenses/${id}`, { method: "PUT", token, body });

export const deleteMonthlyExpense = (token, id) =>
  request(`/monthly-expenses/${id}`, { method: "DELETE", token });
