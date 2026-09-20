import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Brain,
  RefreshCw,
  ArrowRight,
  Activity,
} from "lucide-react";

import { getDashboardStats } from "../services/dashboardService";
import { getInvestigations } from "../services/investigationService";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, investigationData] =
        await Promise.all([
          getDashboardStats(),
          getInvestigations(),
        ]);

      setStats(dashboardData);

      setInvestigations(
        Array.isArray(investigationData)
          ? investigationData
          : []
      );
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        "Unable to load SentinelX SOC dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const recentInvestigations = useMemo(() => {
    return [...investigations]
      .sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      )
      .slice(0, 5);
  }, [investigations]);

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          color: "#94a3b8",
        }}
      >
        Loading SentinelX SOC dashboard...
      </div>
    );
  }

  const investigationsTotal =
    stats?.investigations?.total || 0;

  const alertsTotal =
    stats?.alerts?.total || 0;

  const openAlerts =
    stats?.alerts?.status?.open || 0;

  const acknowledgedAlerts =
    stats?.alerts?.status?.acknowledged || 0;

  const resolvedAlerts =
    stats?.alerts?.status?.resolved || 0;

  const criticalAlerts =
    stats?.alerts?.severity?.critical || 0;

  const highAlerts =
    stats?.alerts?.severity?.high || 0;

  const mediumAlerts =
    stats?.alerts?.severity?.medium || 0;

  const lowAlerts =
    stats?.alerts?.severity?.low || 0;

  const highCritical =
    criticalAlerts + highAlerts;

  return (
    <div
      style={{
        padding: "30px",
        color: "white",
        maxWidth: "1500px",
        margin: "0 auto",
      }}
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
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
            <Shield
              size={32}
              color="#00d9ff"
            />

            <h1
              style={{
                margin: 0,
                color: "#00d9ff",
                fontSize: "34px",
              }}
            >
              SentinelX SOC
            </h1>
          </div>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "10px",
              fontSize: "15px",
            }}
          >
            Security Operations Center monitoring,
            threat detection and incident response.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#4ade80",
              fontSize: "13px",
              fontWeight: "600",
              background:
                "rgba(34, 197, 94, 0.08)",
              border:
                "1px solid rgba(34, 197, 94, 0.2)",
              padding: "10px 14px",
              borderRadius: "10px",
            }}
          >
            <Activity size={16} />
            SOC Monitoring Active
          </div>

          <button
            onClick={loadDashboard}
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
      </div>

      {/* =========================================
          ERROR
      ========================================= */}

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

      {/* =========================================
          SOC STATISTICS
      ========================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "25px",
        }}
      >
        <StatCard
          icon={<Activity size={23} />}
          title="Total Investigations"
          value={investigationsTotal}
          color="#00d9ff"
        />

        <StatCard
          icon={<AlertTriangle size={23} />}
          title="High / Critical Threats"
          value={highCritical}
          color="#f87171"
        />

        <StatCard
          icon={<Bell size={23} />}
          title="SOC Alerts"
          value={alertsTotal}
          color="#fbbf24"
        />

        <StatCard
          icon={<CheckCircle size={23} />}
          title="Resolved Alerts"
          value={resolvedAlerts}
          color="#4ade80"
        />
      </div>

      {/* =========================================
          ALERT STATUS
      ========================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <MiniStat
          title="Open"
          value={openAlerts}
          color="#ef4444"
        />

        <MiniStat
          title="Acknowledged"
          value={acknowledgedAlerts}
          color="#fbbf24"
        />

        <MiniStat
          title="Resolved"
          value={resolvedAlerts}
          color="#4ade80"
        />
      </div>

      {/* =========================================
          MAIN SOC GRID
      ========================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: "22px",
          alignItems: "start",
        }}
      >
        {/* =======================================
            RECENT THREAT ACTIVITY
        ======================================= */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #263449",
            borderRadius: "18px",
            padding: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "22px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#e2e8f0",
                  fontSize: "21px",
                }}
              >
                Recent Threat Activity
              </h2>

              <p
                style={{
                  color: "#64748b",
                  margin: "7px 0 0",
                  fontSize: "13px",
                }}
              >
                Latest SentinelX investigations
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/investigations")
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                color: "#00d9ff",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          {recentInvestigations.length === 0 ? (
            <div
              style={{
                background: "#0b1220",
                borderRadius: "12px",
                padding: "30px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              No investigations available.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {recentInvestigations.map(
                (item) => {
                  const risk =
                    (
                      item.risk_level || ""
                    ).toLowerCase();

                  let riskColor =
                    "#94a3b8";

                  if (
                    risk.includes("critical")
                  ) {
                    riskColor = "#ef4444";
                  } else if (
                    risk.includes("high")
                  ) {
                    riskColor = "#f43f5e";
                  } else if (
                    risk.includes("medium")
                  ) {
                    riskColor = "#f59e0b";
                  } else if (
                    risk.includes("low")
                  ) {
                    riskColor = "#22c55e";
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        navigate(
                          `/investigations/${item.id}`
                        )
                      }
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: "20px",
                        padding: "18px",
                        background:
                          "#0b1220",
                        border:
                          "1px solid #1e293b",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "15px",
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius:
                              "10px",
                            background:
                              "rgba(0, 217, 255, 0.1)",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            flexShrink: 0,
                          }}
                        >
                          <Search
                            size={20}
                            color="#00d9ff"
                          />
                        </div>

                        <div>
                          <strong
                            style={{
                              color:
                                "#e2e8f0",
                              display:
                                "block",
                            }}
                          >
                            Investigation #
                            {item.id}
                          </strong>

                          <span
                            style={{
                              color:
                                "#64748b",
                              fontSize:
                                "13px",
                              display:
                                "block",
                              marginTop:
                                "5px",
                            }}
                          >
                            {item.ip ||
                              "--"}{" "}
                            •{" "}
                            {item.organization ||
                              "Unknown organization"}
                          </span>

                          <span
                            style={{
                              color:
                                "#475569",
                              fontSize:
                                "12px",
                              display:
                                "block",
                              marginTop:
                                "4px",
                            }}
                          >
                            {item.created_at
                              ? new Date(
                                  item.created_at
                                ).toLocaleString()
                              : "Date unavailable"}
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          color: riskColor,
                          background:
                            `${riskColor}15`,
                          border:
                            `1px solid ${riskColor}40`,
                          padding:
                            "6px 11px",
                          borderRadius:
                            "999px",
                          fontSize:
                            "11px",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {item.risk_level ||
                          "Unknown"}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* =======================================
            RISK OPERATIONS
        ======================================= */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #263449",
            borderRadius: "18px",
            padding: "25px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#e2e8f0",
              fontSize: "21px",
            }}
          >
            Risk Operations
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              marginTop: "7px",
            }}
          >
            Current alert severity distribution
          </p>

          <div
            style={{
              marginTop: "25px",
              display: "grid",
              gap: "18px",
            }}
          >
            <RiskRow
              label="Critical"
              value={criticalAlerts}
              total={alertsTotal}
              color="#ef4444"
            />

            <RiskRow
              label="High"
              value={highAlerts}
              total={alertsTotal}
              color="#f43f5e"
            />

            <RiskRow
              label="Medium"
              value={mediumAlerts}
              total={alertsTotal}
              color="#f59e0b"
            />

            <RiskRow
              label="Low"
              value={lowAlerts}
              total={alertsTotal}
              color="#22c55e"
            />
          </div>

          {/* AI STATUS */}

          <div
            style={{
              marginTop: "30px",
              padding: "18px",
              background:
                "rgba(0, 217, 255, 0.06)",
              border:
                "1px solid rgba(0, 217, 255, 0.15)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Brain
                size={20}
                color="#00d9ff"
              />

              <strong
                style={{
                  color: "#e2e8f0",
                }}
              >
                AI Security Analysis
              </strong>
            </div>

            <p
              style={{
                color: "#64748b",
                fontSize: "13px",
                lineHeight: "1.6",
                marginBottom: 0,
              }}
            >
              SentinelX AI analysis is available
              for threat investigations created
              through the Threat Intelligence module.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          QUICK ACTIONS
      ========================================= */}

      <div
        style={{
          marginTop: "25px",
          background: "#111827",
          border: "1px solid #263449",
          borderRadius: "18px",
          padding: "25px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#e2e8f0",
            fontSize: "21px",
          }}
        >
          SOC Quick Actions
        </h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <QuickAction
            icon={<Search size={19} />}
            label="Analyze Threat"
            onClick={() =>
              navigate("/threat-intel")
            }
          />

          <QuickAction
            icon={<Bell size={19} />}
            label="SOC Alerts"
            onClick={() =>
              navigate("/alerts")
            }
          />

          <QuickAction
            icon={<HistoryIcon />}
            label="Investigation History"
            onClick={() =>
              navigate("/investigations")
            }
          />

          <QuickAction
            icon={<Brain size={19} />}
            label="AI Chat"
            onClick={() =>
              navigate("/ai-chat")
            }
          />
        </div>
      </div>
    </div>
  );
}

/* =============================================
   STAT CARD
============================================= */

function StatCard({
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
        padding: "22px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "12px",
            background:
              `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            color,
          }}
        >
          {icon}
        </div>

        <span
          style={{
            color: "#475569",
            fontSize: "11px",
            fontWeight: "600",
          }}
        >
          LIVE
        </span>
      </div>

      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#f8fafc",
          marginTop: "18px",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: "14px",
          marginTop: "5px",
        }}
      >
        {title}
      </div>
    </div>
  );
}

/* =============================================
   MINI STAT
============================================= */

function MiniStat({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #263449",
        borderRadius: "12px",
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,
          fontSize: "25px",
          fontWeight: "bold",
          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* =============================================
   RISK ROW
============================================= */

function RiskRow({
  label,
  value,
  total,
  color,
}) {
  const percentage =
    total > 0
      ? (value / total) * 100
      : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "7px",
          fontSize: "13px",
        }}
      >
        <span
          style={{
            color: "#cbd5e1",
          }}
        >
          {label}
        </span>

        <span
          style={{
            color: "#94a3b8",
          }}
        >
          {value}
        </span>
      </div>

      <div
        style={{
          height: "7px",
          background: "#1e293b",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
            borderRadius: "999px",
            transition:
              "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

/* =============================================
   QUICK ACTION
============================================= */

function QuickAction({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        background: "#172033",
        color: "#e2e8f0",
        border: "1px solid #334155",
        padding: "12px 18px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* =============================================
   HISTORY ICON
============================================= */

function HistoryIcon() {
  return (
    <Clock size={19} />
  );
}

export default Dashboard;