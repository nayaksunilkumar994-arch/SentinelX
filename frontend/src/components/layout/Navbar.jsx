export default function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#111827",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
      }}
    >
      <h2
        style={{
          color: "#00d9ff",
          margin: 0,
        }}
      >
        SentinelX Dashboard
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span style={{ color: "#94a3b8" }}>
          Welcome, Admin
        </span>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#00d9ff",
            color: "#050816",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          A
        </div>
      </div>
    </div>
  );
}