import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import ThreatIntel from "../pages/ThreatIntel";

function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#050816",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <div
          style={{
            flex: 1,
            padding: "30px",
            overflow: "auto",
          }}
        >
          <ThreatIntel />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;