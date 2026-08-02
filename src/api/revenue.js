import request from "./client";

export const getRevenue = (token, period) =>
  request(`/revenue?period=${period}`, { token });

export const getRevenueHistory = (token, period, limit) =>
  request(`/revenue/history?period=${period}${limit ? `&limit=${limit}` : ""}`, {
    token,
  });

// `date` is any ISO instant that falls inside the day/week/month you want
// detail for — an entry's own `start` from getRevenueHistory works perfectly.
export const getDailyDetail = (token, date) =>
  request(`/revenue/daily-detail?date=${encodeURIComponent(date)}`, { token });

export const getWeeklyDetail = (token, date) =>
  request(`/revenue/weekly-detail?date=${encodeURIComponent(date)}`, { token });

export const getMonthlyDetail = (token, date) =>
  request(`/revenue/monthly-detail?date=${encodeURIComponent(date)}`, { token });