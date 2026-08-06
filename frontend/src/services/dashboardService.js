import axios from "axios";

const API = "http://127.0.0.1:8000";

export const analyzeIP = async (ip) => {
  const response = await axios.get(`${API}/threat/ip/${ip}`);
  return response.data;
};