import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8005/api", // ajusta pro IP/porta do seu back
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
