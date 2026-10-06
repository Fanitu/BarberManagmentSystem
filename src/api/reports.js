import request from "./client";

export const fetchReport = ({ shopId, from, to, tab }) =>
  request(`/chainadmin/reports?shopId=${shopId}&from=${from}&to=${to}&tab=${tab}`);

export const fetchShopList = () =>
  request("/chainadmin/shops").then((data) => data.shops.map((s) => ({ id: s.id, name: s.name })));