function Dashboard() {
  return (
    <>
      <h1
        style={{
          fontSize: "36px",
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
        {[
          "Threats Detected",
          "IPs Analyzed",
          "AI Analyses",
          "Reports Generated",
        ].map((title, index) => (
          <div
            key={index}
            style={{
              background: "#172033",
              borderRadius: "18px",
              padding: "25px",
              boxShadow: "0 8px 20px rgba(0,0,0,.25)",
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
                color: "#00d9ff",
                fontSize: "40px",
              }}
            >
              0
            </h1>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "40px",
          background: "#172033",
          borderRadius: "20px",
          padding: "30px",
          minHeight: "350px",
        }}
      >
        <h2
          style={{
            color: "#00d9ff",
            marginBottom: "20px",
          }}
        >
          Threat Intelligence Overview
        </h2>

        <p
          style={{
            color: "#94a3b8",
          }}
        >
          Dashboard integration with FastAPI APIs will begin in the next phase.
        </p>
      </div>
    </>
  );
}

export default Dashboard;