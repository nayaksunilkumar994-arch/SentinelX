import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
} from "../services/alertService";

function Alerts() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAlerts();

      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Alert loading error:", err);
      setError("Unable to load SOC alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      setActionLoading(id);

      await acknowledgeAlert(id);

      await loadAlerts();
    } catch (err) {
      console.error("Acknowledge alert error:", err);
      setError("Unable to acknowledge alert.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolve = async (id) => {
    try {
      setActionLoading(id);

      await resolveAlert(id);

      await loadAlerts();
    } catch (err) {
      console.error("Resolve alert error:", err);
      setError("Unable to resolve alert.");
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityStyle = (severity) => {
    const value = (severity || "").toLowerCase();

    if (value === "critical") {
      return {
        color: "#f87171",
        background: "rgba(239, 68, 68, 0.12)",
        border: "1px solid rgba(239, 68, 68, 0.35)",
      };
    }

    if (value === "high") {
      return {
        color: "#fb7185",
        background: "rgba(244, 63, 94, 0.12)",
        border: "1px solid rgba(244, 63, 94, 0.35)",
      };
    }

    if (value === "medium") {
      return {
        color: "#fbbf24",
        background: "rgba(245, 158, 11, 0.12)",
        border: "1px solid rgba(245, 158, 11, 0.35)",
      };
    }

    return {
      color: "#4ade80",
      background: "rgba(34, 197, 94, 0.12)",
      border: "1px solid rgba(34, 197, 94, 0.35)",
    };
  };

  const getStatusStyle = (status) => {
    const value = (status || "").toLowerCase();

    if (value === "resolved") {
      return {
        color: "#4ade80",
        background: "rgba(34, 197, 94, 0.10)",
        border: "1px solid rgba(34, 197, 94, 0.25)",
      };
    }

    if (value === "acknowledged") {
      return {
        color: "#fbbf24",
        background: "rgba(245, 158, 11, 0.10)",
        border: "1px solid rgba(245, 158, 11, 0.25)",
      };
    }

    return {
      color: "#f87171",
      background: "rgba(239, 68, 68, 0.10)",
      border: "1px solid rgba(239, 68, 68, 0.25)",
    };
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          color: "#94a3b8",
        }}
      >
        Loading SOC alerts...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        color: "white",
        maxWidth: "1500px",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Bell size={30} color="#00d9ff" />

            <h1
              style={{
                margin: 0,
                color: "#00d9ff",
                fontSize: "34px",
              }}
            >
              SOC Alerts
            </h1>
          </div>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "10px",
              fontSize: "15px",
            }}
          >
            Security alerts requiring analyst monitoring
            and response.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#172033",
            color: "#e2e8f0",
            border: "1px solid #334155",
            padding: "11px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background: "#3f1722",
            border: "1px solid #ef4444",
            color: "#fca5a5",
            padding: "18px",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          {error}
        </div>
      )}

      {/* ALERT COUNT */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "25px",
        }}
      >
        <SummaryCard
          icon={<Bell size={22} />}
          title="Total Alerts"
          value={alerts.length}
          color="#00d9ff"
        />

        <SummaryCard
          icon={<ShieldAlert size={22} />}
          title="Open"
          value={
            alerts.filter(
              (a) =>
                (a.status || "").toLowerCase() === "open"
            ).length
          }
          color="#ef4444"
        />

        <SummaryCard
          icon={<Clock size={22} />}
          title="Acknowledged"
          value={
            alerts.filter(
              (a) =>
                (a.status || "").toLowerCase() ===
                "acknowledged"
            ).length
          }
          color="#fbbf24"
        />

        <SummaryCard
          icon={<CheckCircle size={22} />}
          title="Resolved"
          value={
            alerts.filter(
              (a) =>
                (a.status || "").toLowerCase() ===
                "resolved"
            ).length
          }
          color="#4ade80"
        />
      </div>

      {/* ALERT LIST */}

      <div
        style={{
          background: "#111827",
          border: "1px solid #263449",
          borderRadius: "18px",
          padding: "25px",
        }}
      >
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              margin: 0,
              color: "#e2e8f0",
              fontSize: "21px",
            }}
          >
            Alert Queue
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              marginTop: "7px",
            }}
          >
            All SentinelX security alerts
          </p>
        </div>

        {alerts.length === 0 ? (
          <div
            style={{
              background: "#0b1220",
              borderRadius: "12px",
              padding: "35px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No SOC alerts available.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            {alerts.map((alert) => {
              const severityStyle = getSeverityStyle(
                alert.severity
              );

              const statusStyle = getStatusStyle(
                alert.status
              );

              const status =
                (alert.status || "").toLowerCase();

              return (
                <div
                  key={alert.id}
                  style={{
                    background: "#0b1220",
                    border: "1px solid #1e293b",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  {/* ALERT TOP */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "11px",
                          background:
                            "rgba(0, 217, 255, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <ShieldAlert
                          size={22}
                          color="#00d9ff"
                        />
                      </div>

                      <div>
                        <h3
                          style={{
                            margin: 0,
                            color: "#e2e8f0",
                            fontSize: "17px",
                          }}
                        >
                          {alert.title}
                        </h3>

                        <p
                          style={{
                            color: "#94a3b8",
                            margin:
                              "7px 0 0",
                            lineHeight: "1.5",
                            fontSize: "13px",
                          }}
                        >
                          {alert.description}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          ...severityStyle,
                          padding: "6px 11px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {alert.severity ||
                          "Unknown"}
                      </span>

                      <span
                        style={{
                          ...statusStyle,
                          padding: "6px 11px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {alert.status ||
                          "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* DETAILS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "25px",
                      flexWrap: "wrap",
                      marginTop: "18px",
                      paddingTop: "15px",
                      borderTop:
                        "1px solid #1e293b",
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    <span>
                      Investigation: #
                      {alert.investigation_id}
                    </span>

                    <span>
                      Source: {alert.source || "--"}
                    </span>

                    <span>
                      Created:{" "}
                      {alert.created_at
                        ? new Date(
                            alert.created_at
                          ).toLocaleString()
                        : "--"}
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "18px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `/investigations/${alert.investigation_id}`
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        background:
                          "transparent",
                        color: "#00d9ff",
                        border:
                          "1px solid #155e75",
                        padding: "9px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      View Investigation
                      <ArrowRight size={15} />
                    </button>

                    {status === "open" && (
                      <button
                        disabled={
                          actionLoading === alert.id
                        }
                        onClick={() =>
                          handleAcknowledge(
                            alert.id
                          )
                        }
                        style={{
                          background: "#3b2f0b",
                          color: "#fbbf24",
                          border:
                            "1px solid #854d0e",
                          padding: "9px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        {actionLoading ===
                        alert.id
                          ? "Updating..."
                          : "Acknowledge"}
                      </button>
                    )}

                    {status ===
                      "acknowledged" && (
                      <button
                        disabled={
                          actionLoading === alert.id
                        }
                        onClick={() =>
                          handleResolve(
                            alert.id
                          )
                        }
                        style={{
                          background: "#052e16",
                          color: "#4ade80",
                          border:
                            "1px solid #166534",
                          padding: "9px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        {actionLoading ===
                        alert.id
                          ? "Updating..."
                          : "Resolve"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #263449",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color,
        }}
      >
        {icon}

        <span
          style={{
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          color: "#f8fafc",
          fontSize: "30px",
          fontWeight: "bold",
          marginTop: "15px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default Alerts;