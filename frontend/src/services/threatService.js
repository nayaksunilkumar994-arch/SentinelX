import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function analyzeIP(ip) {
  try {
    const response = await API.get(`/threat/ip/${ip}`);
    return response.data;
  } catch (error) {
    console.error("Threat API Error:", error);

    return {
      reputation: "Unavailable",
      country: "Unknown",
      asn: "Unknown",
      status: "API Error",
    };
  }
}