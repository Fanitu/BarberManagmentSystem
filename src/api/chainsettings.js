import request from "./client";

export const getSettings = () => request("/chainadmin/settings");
export const setEmailAnalysisEnabled = (enabled) =>
  request("/chainadmin/settings/email-analysis", { method: "PATCH", body: { enabled } });

export const changeChainAdminPassword = (previousPassword, newPassword) =>
  request("/chainadmin/settings/password", { method: "PATCH", body: { previousPassword, newPassword } });

export const saveTelegramPhone = (phone) =>
  request("/chainadmin/settings/telegram-phone", { method: "PATCH", body: { phone } });

export const setTelegramAnalysisEnabled = (enabled) =>
  request("/chainadmin/settings/telegram-analysis", { method: "PATCH", body: { enabled } });