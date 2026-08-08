import { useState } from "react";
import { analyzeIP, analyzeWithAI } from "../services/dashboardService";

function ThreatIntel() {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState({
    reputation: "--",
    country: "--",
    city: "--",
    organization: "--",
    timezone: "--",
  });

  const [aiAnalysis, setAiAnalysis] = useState("");

  const handleAnalyze = async () => {
    if (!ip) return;

    setLoading(true);
    setAiAnalysis("");

    try {
      // Get threat intelligence
      const threat = await analyzeIP(ip);

      setResult({
        reputation: "Safe",
        country: threat.country,
        city: threat.city,
        organization: threat.organization,
        timezone: threat.timezone,
      });

      // Send to Gemini AI
      const ai = await analyzeWithAI(threat);

      setAiAnalysis(ai.analysis);

    } catch (error) {
      console.error(error);
      alert("Analysis Failed");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1
        style={{
          color: "#00d9ff",
          marginBottom: "30px",
        }}
      >
        AI Threat Intelligence
      </h1>

      <div
        style={{
          background: "#172033",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ color: "white" }}>
          Enter IP Address
        </h2>

        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
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
          }}
        />

        <button
          onClick={handleAnalyze}
          style={{
            padding: "15px 40px",
            background: "#00d9ff",
            color: "#050816",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Threat"}
        </button>

        <div
          style={{
            marginTop: "35px",
            background: "#0f172a",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2 style={{ color: "#00d9ff" }}>
            Threat Information
          </h2>

          <p style={{ color: "white" }}>
            <strong>Reputation:</strong> {result.reputation}
          </p>

          <p style={{ color: "white" }}>
            <strong>Country:</strong> {result.country}
          </p>

          <p style={{ color: "white" }}>
            <strong>City:</strong> {result.city}
          </p>

          <p style={{ color: "white" }}>
            <strong>Organization:</strong> {result.organization}
          </p>

          <p style={{ color: "white" }}>
            <strong>Timezone:</strong> {result.timezone}
          </p>
        </div>

        {aiAnalysis && (
          <div
            style={{
              marginTop: "30px",
              background: "#101826",
              padding: "25px",
              borderRadius: "15px",
              border: "2px solid #00d9ff",
            }}
          >
            <h2 style={{ color: "#00d9ff" }}>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreatIntel;