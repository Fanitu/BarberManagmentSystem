import request from "./client";

export const listRunningCosts = () => request("/chainadmin/running-costs");

export const createRunningCost = (data) => request("/chainadmin/running-costs", { method: "POST", body: data });

export const listMonthlyExpenses = () => request("/chainadmin/monthly-expenses");

export const createMonthlyExpense = (data) => request("/chainadmin/monthly-expenses", { method: "POST", body: data });

export const getOverallProfit = (monthsBack = 12) =>
  request(`/chainadmin/overall-profit?monthsBack=${monthsBack}`);

export const updateMonthlyExpense = (id, data) => request(`/chainadmin/monthly-expenses/${id}`, { method: "PUT", body: data });

export const deleteMonthlyExpense = (id) => request(`/chainadmin/monthly-expenses/${id}`, { method: "DELETE" });