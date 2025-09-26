import axios from "axios";
import { getUserId } from "./userId";

export const api = axios.create({
  baseURL: "http://192.168.29.223:4000/api", // 👈 replace with your backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const uid = getUserId();
  if (uid && config.headers) {
    config.headers["X-User-Id"] = uid;
  }
  return config;
});