import request from "./client";

export const listRunningCosts = (token) => request("/running-costs", { token });

export const createRunningCost = (token, { name, price }) =>
  request("/running-costs", { method: "POST", token, body: { name, price } });
