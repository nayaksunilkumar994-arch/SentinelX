import axios from "axios";

// ==========================================================
// SENTINELX DASHBOARD / SECURITY API
// ==========================================================

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
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
// THREAT INTELLIGENCE
// ==========================================================

export const analyzeIP = async (ip) => {
  if (!ip || !ip.trim()) {
    throw new Error("IP address is required.");
  }

  const response = await API.get(
    `/threat/ip/${ip.trim()}`
  );

  return response.data;
};

// ==========================================================
// AI THREAT ANALYSIS
// ==========================================================

export const analyzeWithAI = async (threatData) => {
  if (!threatData) {
    throw new Error("Threat data is required.");
  }

  const response = await API.post(
    "/ai/analyze",
    threatData
  );

  return response.data;
};

// ==========================================================
// DASHBOARD STATISTICS
// ==========================================================

export const getDashboardStats = async () => {
  const response = await API.get(
    "/dashboard/stats"
  );

  return response.data;
};

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default API;