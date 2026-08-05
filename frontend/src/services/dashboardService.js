import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function getDashboardStats() {
  try {
    const response = await API.get("/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return {
      threats_detected: 0,
      ips_analyzed: 0,
      ai_analyses: 0,
      reports_generated: 0,
    };
  }
}