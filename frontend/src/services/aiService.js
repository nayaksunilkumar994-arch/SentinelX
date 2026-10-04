import axios from "axios";

// ==========================================================
// SENTINELX AI ANALYSIS API
// ==========================================================

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================================
// ATTACH JWT AUTHENTICATION
// ==========================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "sentinelx_access_token"
    );

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================================
// AI THREAT ANALYSIS
// ==========================================================

export const analyzeThreatWithAI = async ({
  ip,
  country,
  city,
  organization,
  timezone,
}) => {
  if (!ip || !ip.trim()) {
    throw new Error("IP address is required.");
  }

  const response = await API.post(
    "/ai/analyze",
    {
      ip: ip.trim(),
      country: country || "Unknown",
      city: city || "Unknown",
      organization: organization || "Unknown",
      timezone: timezone || "Unknown",
    }
  );

  return response.data;
};

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default API;