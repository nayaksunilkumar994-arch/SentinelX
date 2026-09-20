import axios from "axios";

// ==========================================================
// API CONFIGURATION
// ==========================================================

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================================
// ANALYZE IP — DAY 25 CORRELATION ENGINE
// ==========================================================

export const analyzeIP = async (ip) => {
  if (!ip || !ip.trim()) {
    throw new Error("IP address is required.");
  }

  const cleanIP = ip.trim();

  try {
    const response = await api.get(
      `/threat/correlate/${encodeURIComponent(cleanIP)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX Threat Correlation Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// AI THREAT ANALYSIS
// ==========================================================
// Backend endpoint:
// POST /ai/analyze
//
// Backend expects:
//
// {
//   ip: "...",
//   country: "...",
//   city: "...",
//   organization: "...",
//   timezone: "..."
// }
//
// Backend returns:
//
// {
//   status: "success",
//   analysis: "..."
// }
//
// IMPORTANT:
// ThreatIntel.jsx expects:
// ai.analysis
//
// Therefore this function must return response.data
// directly from /ai/analyze.
// ==========================================================

export const analyzeWithAI = async (threatData) => {
  if (!threatData) {
    throw new Error(
      "Threat data is required for AI analysis."
    );
  }

  try {
    const response = await api.post(
      "/ai/analyze",
      {
        ip: threatData.ip || "",
        country:
          threatData.country_code ||
          threatData.country ||
          "Unknown",
        city: threatData.city || "Unknown",
        organization:
          threatData.isp ||
          threatData.organization ||
          "Unknown",
        timezone: threatData.timezone || "Unknown",
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX AI Analysis Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// SAVE INVESTIGATION
// ==========================================================

export const saveInvestigation = async (
  investigationData
) => {
  if (!investigationData) {
    throw new Error(
      "Investigation data is required."
    );
  }

  try {
    const response = await api.post(
      "/investigations",
      investigationData
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX Investigation Save Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// GENERATE PDF REPORT
// ==========================================================
// Backend endpoint:
//
// POST /report/generate
//
// Backend expects:
//
// {
//   ip: "...",
//   ai_analysis: "..."
// }
//
// Backend returns:
//
// application/pdf
// ==========================================================

export const generateReport = async (
  ip,
  aiAnalysis
) => {
  if (!ip || !ip.trim()) {
    throw new Error(
      "IP address is required."
    );
  }

  if (
    !aiAnalysis ||
    !String(aiAnalysis).trim()
  ) {
    throw new Error(
      "AI analysis is required to generate the report."
    );
  }

  const cleanIP = ip.trim();
  const cleanAnalysis = String(aiAnalysis).trim();

  try {
    const response = await api.post(
      "/report/generate",
      {
        ip: cleanIP,
        ai_analysis: cleanAnalysis,
      },
      {
        responseType: "blob",
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX PDF Report Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// IP INFORMATION LOOKUP
// ==========================================================

export const getIPInfo = async (ip) => {
  if (!ip || !ip.trim()) {
    throw new Error(
      "IP address is required."
    );
  }

  const cleanIP = ip.trim();

  try {
    const response = await api.get(
      `/threat/ip/${encodeURIComponent(cleanIP)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX IP Information Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// VIRUSTOTAL IP LOOKUP
// ==========================================================

export const getVirusTotal = async (ip) => {
  if (!ip || !ip.trim()) {
    throw new Error(
      "IP address is required."
    );
  }

  const cleanIP = ip.trim();

  try {
    const response = await api.get(
      `/threat/virustotal/ip/${encodeURIComponent(cleanIP)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX VirusTotal Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// ABUSEIPDB IP LOOKUP
// ==========================================================

export const getAbuseIPDB = async (ip) => {
  if (!ip || !ip.trim()) {
    throw new Error(
      "IP address is required."
    );
  }

  const cleanIP = ip.trim();

  try {
    const response = await api.get(
      `/threat/abuseipdb/ip/${encodeURIComponent(cleanIP)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX AbuseIPDB Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// DNS LOOKUP
// ==========================================================

export const getDNSLookup = async (domain) => {
  if (!domain || !domain.trim()) {
    throw new Error(
      "Domain is required."
    );
  }

  const cleanDomain = domain.trim();

  try {
    const response = await api.get(
      `/threat/dns/${encodeURIComponent(cleanDomain)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX DNS Lookup Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// WHOIS LOOKUP
// ==========================================================

export const getWhoisLookup = async (domain) => {
  if (!domain || !domain.trim()) {
    throw new Error(
      "Domain is required."
    );
  }

  const cleanDomain = domain.trim();

  try {
    const response = await api.get(
      `/threat/whois/${encodeURIComponent(cleanDomain)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "SentinelX WHOIS Lookup Error:",
      error
    );

    throw error;
  }
};

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default api;