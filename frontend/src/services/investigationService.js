import axios from "axios";

// ==========================================================
// SENTINELX INVESTIGATION API
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
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================================
// CREATE INVESTIGATION
// ==========================================================

export async function createInvestigation(
  investigationData
) {
  if (!investigationData) {
    throw new Error(
      "Investigation data is required."
    );
  }

  if (
    !investigationData.ip ||
    !investigationData.ip.trim()
  ) {
    throw new Error(
      "IP address is required."
    );
  }

  const response = await API.post(
    "/investigations/",
    investigationData
  );

  return response.data;
}

// ==========================================================
// GET ALL INVESTIGATIONS
// ==========================================================

export async function getInvestigations() {
  const response = await API.get(
    "/investigations/"
  );

  return response.data;
}

// ==========================================================
// GET ONE INVESTIGATION
// ==========================================================

export async function getInvestigation(id) {
  if (!id) {
    throw new Error(
      "Investigation ID is required."
    );
  }

  const response = await API.get(
    `/investigations/${id}`
  );

  return response.data;
}

// ==========================================================
// DELETE INVESTIGATION
// ==========================================================

export async function deleteInvestigation(id) {
  if (!id) {
    throw new Error(
      "Investigation ID is required."
    );
  }

  const response = await API.delete(
    `/investigations/${id}`
  );

  return response.data;
}

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default API;