import axios from "axios";

// Trim env var to remove leading/trailing whitespace (critical)
const API_URL = (process.env.REACT_APP_API_URL || "").trim();

const api = axios.create({
  baseURL: API_URL || undefined,
  withCredentials: true, // enable if cookies/auth depend on credentials; adjust if not needed
});

// Request interceptor for logging + guard against whitespace/encoded spaces
api.interceptors.request.use(
  (config) => {
    const base = config.baseURL || "";
    const url = config.url || "";
    const fullUrl = base + url;
    if (/\s/.test(fullUrl) || fullUrl.includes("%20")) {
      throw new Error(
        "Invalid request URL (contains whitespace or %20): " + fullUrl
      );
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default api;

