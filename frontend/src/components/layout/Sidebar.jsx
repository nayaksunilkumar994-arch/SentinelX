import {
  Shield,
  Search,
  Bot,
  MessageCircle,
  FileText,
  Settings,
} from "lucide-react";

const menu = [
  { icon: <Shield size={20} />, title: "Dashboard" },
  { icon: <Search size={20} />, title: "Threat Intel" },
  { icon: <Bot size={20} />, title: "AI Analysis" },
  { icon: <MessageCircle size={20} />, title: "AI Chat" },
  { icon: <FileText size={20} />, title: "Reports" },
  { icon: <Settings size={20} />, title: "Settings" },
];

function Sidebar() {
  return (
    <div
      style={{
        width: "260px",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1e293b",
      }}
    >
      <div
        style={{
          padding: "30px",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#00d9ff",
          textAlign: "center",
        }}
      >
        SentinelX
      </div>

      <div style={{ padding: "20px" }}>
        {menu.map((item) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {item.icon}
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;