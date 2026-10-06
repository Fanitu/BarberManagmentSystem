import request from "./client";

export const listMyShops = () => request("/chainadmin/shops");

export const createShop = ({ name, ownerName, ownerPhone }) =>
  request("/chainadmin/shops", { method: "POST", body: { name, ownerName, ownerPhone } });

export const enterShopView = (shopId) =>
  request(`/chainadmin/shops/${shopId}/enter`, { method: "POST" });

export const exitShopView = () => request("/chainadmin/exit-shop-view", { method: "POST" });

export const getShopsRevenueOverview = (period) =>
  request(`/chainadmin/shops/revenue-overview?period=${period}`);