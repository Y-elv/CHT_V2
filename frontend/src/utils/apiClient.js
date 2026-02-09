import axios from "axios";

// Trim env var to remove leading/trailing whitespace (critical)
const API_URL = (process.env.REACT_APP_API_URL || "").trim();

if (!API_URL) {
  console.warn("[apiClient] REACT_APP_API_URL is empty or not set");
}

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

    console.log("[apiClient] Request prepare", {
      base,
      url,
      fullUrl,
      containsWhitespace: /\s/.test(fullUrl),
      containsPct20: fullUrl.includes("%20"),
    });

    if (/\s/.test(fullUrl) || fullUrl.includes("%20")) {
      console.error(
        "[apiClient] Blocked request with invalid URL:",
        JSON.stringify(fullUrl)
      );
      // fail fast in dev/test. In production you may prefer to only log.
      throw new Error(
        "Invalid request URL (contains whitespace or %20): " + fullUrl
      );
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default api;

