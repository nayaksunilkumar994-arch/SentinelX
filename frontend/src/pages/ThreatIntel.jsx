import { useState } from "react";

import {
  analyzeIP,
  analyzeWithAI,
  generateReport,
} from "../services/threatService";


function ThreatIntel() {

  const [ip, setIp] = useState("");

  const [loading, setLoading] = useState(false);

  const [reportLoading, setReportLoading] = useState(false);

  const [result, setResult] = useState({
    reputation: "--",
    country: "--",
    city: "--",
    organization: "--",
    timezone: "--",
  });

  const [aiAnalysis, setAiAnalysis] = useState("");


  const handleAnalyze = async () => {

    if (!ip.trim()) {
      alert("Please enter an IP address.");
      return;
    }

    setLoading(true);

    setAiAnalysis("");

    try {

      // ==========================================
      // Step 1 — Threat Intelligence
      // ==========================================

      const threat = await analyzeIP(ip.trim());

      setResult({
        reputation: "Safe",
        country: threat.country || "--",
        city: threat.city || "--",
        organization:
          threat.organization || "--",
        timezone:
          threat.timezone || "--",
      });


      // ==========================================
      // Step 2 — AI Threat Analysis
      // ==========================================

      const ai = await analyzeWithAI({
        ip: ip.trim(),
        country: threat.country || "",
        city: threat.city || "",
        organization:
          threat.organization || "",
        timezone:
          threat.timezone || "",
      });

      setAiAnalysis(ai.analysis || "");

    } catch (error) {

      console.error("Threat Analysis Error:", error);

      alert(
        "Analysis Failed. Please make sure the SentinelX backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // Generate PDF Report
  // ==========================================

  const handleGenerateReport = async () => {

    if (!ip || !aiAnalysis) {

      alert(
        "Please analyze an IP address before generating the report."
      );

      return;
    }

    setReportLoading(true);

    try {

      await generateReport(
        ip,
        aiAnalysis
      );

    } catch (error) {

      console.error(
        "PDF Report Error:",
        error
      );

      alert(
        "Unable to generate the PDF report."
      );

    } finally {

      setReportLoading(false);

    }
  };


  return (

    <div>

      {/* ===================================== */}
      {/* PAGE TITLE */}
      {/* ===================================== */}

      <h1
        style={{
          color: "#00d9ff",
          marginBottom: "30px",
        }}
      >
        AI Threat Intelligence
      </h1>


      {/* ===================================== */}
      {/* MAIN CARD */}
      {/* ===================================== */}

      <div
        style={{
          background: "#172033",
          padding: "30px",
          borderRadius: "20px",
        }}
      >

        <h2
          style={{
            color: "white",
          }}
        >
          Enter IP Address
        </h2>


        {/* ================================= */}
        {/* IP INPUT */}
        {/* ================================= */}

        <input
          value={ip}
          onChange={(e) =>
            setIp(e.target.value)
          }
          placeholder="8.8.8.8"
          style={{
            width: "100%",
            padding: "18px",
            marginTop: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "none",
            background: "#0f172a",
            color: "white",
            fontSize: "18px",
            boxSizing: "border-box",
          }}
        />


        {/* ================================= */}
        {/* ANALYZE BUTTON */}
        {/* ================================= */}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "15px 40px",
            background: loading
              ? "#475569"
              : "#00d9ff",
            color: "#050816",
            border: "none",
            borderRadius: "10px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >

          {loading
            ? "Analyzing..."
            : "Analyze Threat"}

        </button>


        {/* ===================================== */}
        {/* THREAT INFORMATION */}
        {/* ===================================== */}

        <div
          style={{
            marginTop: "35px",
            background: "#0f172a",
            padding: "25px",
            borderRadius: "15px",
          }}
        >

          <h2
            style={{
              color: "#00d9ff",
            }}
          >
            Threat Information
          </h2>


          <p style={{ color: "white" }}>
            <strong>
              Reputation:
            </strong>{" "}
            {result.reputation}
          </p>


          <p style={{ color: "white" }}>
            <strong>
              Country:
            </strong>{" "}
            {result.country}
          </p>


          <p style={{ color: "white" }}>
            <strong>
              City:
            </strong>{" "}
            {result.city}
          </p>


          <p style={{ color: "white" }}>
            <strong>
              Organization:
            </strong>{" "}
            {result.organization}
          </p>


          <p style={{ color: "white" }}>
            <strong>
              Timezone:
            </strong>{" "}
            {result.timezone}
          </p>

        </div>


        {/* ===================================== */}
        {/* AI ANALYSIS */}
        {/* ===================================== */}

        {aiAnalysis && (

          <div
            style={{
              marginTop: "30px",
              background: "#101826",
              padding: "25px",
              borderRadius: "15px",
              border:
                "2px solid #00d9ff",
            }}
          >

            <h2
              style={{
                color: "#00d9ff",
              }}
            >
              🤖 AI Security Analysis
            </h2>


            <pre
              style={{
                color: "#ffffff",
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                lineHeight: "1.7",
              }}
            >
              {aiAnalysis}
            </pre>


            {/* ================================= */}
            {/* PDF REPORT BUTTON */}
            {/* ================================= */}

            <div
              style={{
                marginTop: "25px",
                paddingTop: "20px",
                borderTop:
                  "1px solid #263449",
              }}
            >

              <button
                onClick={
                  handleGenerateReport
                }
                disabled={
                  reportLoading
                }
                style={{
                  padding:
                    "13px 28px",

                  background:
                    reportLoading
                      ? "#475569"
                      : "linear-gradient(135deg, #2563eb, #0891b2)",

                  color: "white",

                  border: "none",

                  borderRadius: "10px",

                  cursor:
                    reportLoading
                      ? "not-allowed"
                      : "pointer",

                  fontWeight: "bold",

                  fontSize: "15px",

                  boxShadow:
                    "0 5px 20px rgba(0,217,255,0.15)",
                }}
              >

                {reportLoading
                  ? "Generating Report..."
                  : "📄 Generate PDF Report"}

              </button>


              <p
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  marginTop: "10px",
                }}
              >
                Generate a professional
                SentinelX threat intelligence
                report from this analysis.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}


export default ThreatIntel;