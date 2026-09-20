import {
  Shield,
  Search,
  Bot,
  MessageCircle,
  FileText,
  Settings,
  History,
  Bell,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { logoutUser } from "../../services/authService";

const menu = [
  {
    icon: <Shield size={20} />,
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <Search size={20} />,
    title: "Threat Intel",
    path: "/threat-intel",
  },
  {
    icon: <Bot size={20} />,
    title: "AI Analysis",
    path: "/ai-analysis",
  },
  {
    icon: <MessageCircle size={20} />,
    title: "AI Chat",
    path: "/ai-chat",
  },
  {
    icon: <History size={20} />,
    title: "Investigation History",
    path: "/investigations",
  },
  {
    icon: <Bell size={20} />,
    title: "SOC Alerts",
    path: "/alerts",
  },
  {
    icon: <FileText size={20} />,
    title: "Reports",
    path: "/reports",
  },
  {
    icon: <Settings size={20} />,
    title: "Settings",
    path: "/settings",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div
      style={{
        width: "260px",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1e293b",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}

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

      {/* Navigation */}

      <div
        style={{
          padding: "20px",
          flex: 1,
        }}
      >
        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            style={{
              textDecoration: "none",
              color: "white",
              display: "block",
            }}
          >
            {({ isActive }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "12px",
                  cursor: "pointer",

                  background: isActive
                    ? "rgba(0, 217, 255, 0.12)"
                    : "transparent",

                  color: isActive
                    ? "#00d9ff"
                    : "white",

                  border: isActive
                    ? "1px solid rgba(0, 217, 255, 0.25)"
                    : "1px solid transparent",

                  transition: "0.3s",
                }}
              >
                {item.icon}

                <span>
                  {item.title}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout */}

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "15px",
            borderRadius: "12px",
            cursor: "pointer",
            background: "rgba(239, 68, 68, 0.08)",
            color: "#f87171",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            fontSize: "15px",
            fontWeight: "500",
            transition: "0.3s",
          }}
        >
          <LogOut size={20} />

          <span>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;