import axios from "axios";

const API = "http://127.0.0.1:8000";

// ==========================================
// Get All Alerts
// ==========================================

export const getAlerts = async () => {
  const response = await axios.get(`${API}/alerts/`);
  return response.data;
};


// ==========================================
// Get One Alert
// ==========================================

export const getAlert = async (id) => {
  const response = await axios.get(
    `${API}/alerts/${id}`
  );

  return response.data;
};


// ==========================================
// Acknowledge Alert
// ==========================================

export const acknowledgeAlert = async (id) => {
  const response = await axios.patch(
    `${API}/alerts/${id}`,
    {
      status: "Acknowledged",
    }
  );

  return response.data;
};


// ==========================================
// Resolve Alert
// ==========================================

export const resolveAlert = async (id) => {
  const response = await axios.patch(
    `${API}/alerts/${id}`,
    {
      status: "Resolved",
    }
  );

  return response.data;
};