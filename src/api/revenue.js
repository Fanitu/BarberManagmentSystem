import request from "./client";

export const getRevenue = (token, period) =>
  request(`/revenue?period=${period}`, { token });

export const getRevenueHistory = (token, period, limit) =>
  request(`/revenue/history?period=${period}${limit ? `&limit=${limit}` : ""}`, {
    token,
  });
