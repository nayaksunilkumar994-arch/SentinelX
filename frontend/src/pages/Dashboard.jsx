import useDashboard from "../hooks/useDashboard";

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: "#172033",
        borderRadius: "18px",
        padding: "25px",
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 10px 20px rgba(0,0,0,.25)",
      }}
    >
      <h3
        style={{
          color: "#94a3b8",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: "#ffffff",
          fontSize: "42px",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default function Dashboard() {
  const stats = useDashboard();

  return (
    <>
      <h1
        style={{
          color: "#ffffff",
          marginBottom: "30px",
        }}
      >
        Security Operations Center
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        <Card
          title="Threats Detected"
          value={stats.threats_detected}
          color="#ef4444"
        />

        <Card
          title="IPs Analyzed"
          value={stats.ips_analyzed}
          color="#00d9ff"
        />

        <Card
          title="AI Analyses"
          value={stats.ai_analyses}
          color="#10b981"
        />

        <Card
          title="Reports Generated"
          value={stats.reports_generated}
          color="#f59e0b"
        />
      </div>

      <div
        style={{
          marginTop: "35px",
          background: "#172033",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        <h2
          style={{
            color: "#00d9ff",
          }}
        >
          Threat Intelligence Overview
        </h2>

        <p
          style={{
            color: "#94a3b8",
          }}
        >
          Dashboard connected with FastAPI backend.
        </p>
      </div>
    </>
  );
}