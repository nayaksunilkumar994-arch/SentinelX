import axios from "axios";

// ==========================================================
// SENTINELX ALERTS API
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
// GET ALL ALERTS
// ==========================================================

export const getAlerts = async () => {
  const response = await API.get("/alerts/");
  return response.data;
};

// ==========================================================
// GET ONE ALERT
// ==========================================================

export const getAlert = async (id) => {
  if (!id) {
    throw new Error("Alert ID is required.");
  }

  const response = await API.get(
    `/alerts/${id}`
  );

  return response.data;
};

// ==========================================================
// ACKNOWLEDGE ALERT
// Admin-only operation enforced by backend RBAC
// ==========================================================

export const acknowledgeAlert = async (id) => {
  if (!id) {
    throw new Error("Alert ID is required.");
  }

  const response = await API.patch(
    `/alerts/${id}`,
    {
      status: "Acknowledged",
    }
  );

  return response.data;
};

// ==========================================================
// RESOLVE ALERT
// Admin-only operation enforced by backend RBAC
// ==========================================================

export const resolveAlert = async (id) => {
  if (!id) {
    throw new Error("Alert ID is required.");
  }

  const response = await API.patch(
    `/alerts/${id}`,
    {
      status: "Resolved",
    }
  );

  return response.data;
};

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default API;