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

    throw error;
  }
}

export async function analyzeWithAI(threatData) {
  try {
    const response = await API.post(
      "/ai/analyze",
      threatData
    );

    return response.data;
  } catch (error) {
    console.error("AI Analysis API Error:", error);

    throw error;
  }
}

export async function generateReport(ip, analysis) {
  try {
    const response = await API.post(
      "/report/generate",
      {
        ip,
        analysis,
      },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob(
      [response.data],
      {
        type: "application/pdf",
      }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "SentinelX_Threat_Report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Report Generation Error:", error);

    throw error;
  }
}