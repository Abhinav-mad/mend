import axios from "axios";
import { getUserId } from "./userId";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL, // 👈 replace with your backend API URL
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