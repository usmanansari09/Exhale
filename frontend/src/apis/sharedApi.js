import { getToken } from "../utils/helpers";

export const baseUrl = "https://exhale-30125.botics.co/api";
export const basePath = "https://exhale-30125.botics.co/uploads/";

export const header = async () => ({
  "Content-Type": "application/json",
  Authorization: "Token " + (await getToken()),
  // "x-access-token": await getToken(),
  // "Access-Control-Allow-Origin": "*"
});

export const authHeader = {
  "Content-Type": "application/json",
  // "Access-Control-Allow-Origin": "*"
};

export const customTokenHeader = (token) => ({
  "Content-Type": "application/json",
  Authorization: "Token " + token,
  // "x-access-token": await getToken(),
  // "Access-Control-Allow-Origin": "*"
});
