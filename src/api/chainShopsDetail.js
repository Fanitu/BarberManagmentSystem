import request from "./client";

export const getShopsIncomeHistory = (period) =>
  request(`/chainadmin/shops-detail/income?period=${period}`);

export const getShopsBarbersHistory = (period) =>
  request(`/chainadmin/shops-detail/barbers?period=${period}`);

export const getShopsMonthlyExpense = () => request("/chainadmin/shops-detail/monthly-expense");

export const getShopsProgress = (period) => request(`/chainadmin/shops-progress?period=${period}`);