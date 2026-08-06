import { useState } from "react";
import { analyzeIP } from "../services/dashboardService";

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

  const handleAnalyze = async () => {
    if (!ip) return;

    setLoading(true);

    try {
      const data = await analyzeIP(ip);

      setResult({
        reputation: "Safe",
        country: data.country,
        city: data.city,
        organization: data.organization,
        timezone: data.timezone,
      });
    } catch (error) {
      alert("Unable to analyze IP.");
      console.error(error);
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
        Threat Intelligence
      </h1>

      <div
        style={{
          background: "#172033",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ color: "white" }}>Enter IP Address</h2>

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
            padding: "16px 40px",
            background: "#00d9ff",
            color: "#000",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Threat"}
        </button>

        <div
          style={{
            marginTop: "40px",
            background: "#0f172a",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2 style={{ color: "#00d9ff" }}>Analysis Result</h2>

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
      </div>
    </div>
  );
}

export default ThreatIntel;