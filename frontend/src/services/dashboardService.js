import axios from "axios";

const API = "http://127.0.0.1:8000";

// ------------------------------------
// Threat Intelligence
// ------------------------------------

export const analyzeIP = async (ip) => {
  const response = await axios.get(`${API}/threat/ip/${ip}`);
  return response.data;
};

// ------------------------------------
// AI Threat Analysis
// ------------------------------------

export const analyzeWithAI = async (threatData) => {
  const response = await axios.post(
    `${API}/ai/analyze`,
    threatData
  );

  return response.data;
};

// ------------------------------------
// Dashboard Statistics
// ------------------------------------

export const getDashboardStats = async () => {
  const response = await axios.get(
    `${API}/dashboard/stats`
  );

  return response.data;
};