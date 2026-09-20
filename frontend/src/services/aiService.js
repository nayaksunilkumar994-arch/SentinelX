import axios from "axios";

const API = "http://127.0.0.1:8000";


// ==========================================
// AI THREAT ANALYSIS
// ==========================================

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

  const response = await axios.post(
    `${API}/ai/analyze`,
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