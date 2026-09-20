import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Shield,
  Globe,
  MapPin,
  Building2,
  Clock,
  Calendar,
  Brain,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

import {
  getInvestigation,
  deleteInvestigation,
} from "../services/investigationService";

function InvestigationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInvestigation();
  }, [id]);

  const loadInvestigation = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInvestigation(id);

      setInvestigation(data);
    } catch (err) {
      console.error("Investigation Detail Error:", err);
      setError("Failed to load investigation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this investigation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteInvestigation(id);

      navigate("/investigations");
    } catch (err) {
      console.error("Delete Investigation Error:", err);
      alert("Failed to delete investigation.");
    }
  };

  const getRiskStyle = (risk) => {
    const value = (risk || "").toLowerCase();

    if (value.includes("critical")) {
      return {
        background: "rgba(220, 38, 38, 0.15)",
        color: "#f87171",
        border: "1px solid rgba(220, 38, 38, 0.4)",
      };
    }

    if (value.includes("high")) {
      return {
        background: "rgba(239, 68, 68, 0.15)",
        color: "#fb7185",
        border: "1px solid rgba(239, 68, 68, 0.4)",
      };
    }

    if (value.includes("medium")) {
      return {
        background: "rgba(245, 158, 11, 0.15)",
        color: "#fbbf24",
        border: "1px solid rgba(245, 158, 11, 0.4)",
      };
    }

    if (value.includes("low")) {
      return {
        background: "rgba(34, 197, 94, 0.15)",
        color: "#4ade80",
        border: "1px solid rgba(34, 197, 94, 0.4)",
      };
    }

    return {
      background: "rgba(148, 163, 184, 0.12)",
      color: "#cbd5e1",
      border: "1px solid rgba(148, 163, 184, 0.3)",
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
        Loading investigation...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        <div
          style={{
            background: "#3f1722",
            border: "1px solid #ef4444",
            borderRadius: "15px",
            padding: "25px",
            color: "#fca5a5",
          }}
        >
          {error}
        </div>

        <button
          onClick={() => navigate("/investigations")}
          style={backButtonStyle}
        >
          <ArrowLeft size={18} />
          Back to History
        </button>
      </div>
    );
  }

  if (!investigation) {
    return (
      <div
        style={{
          padding: "40px",
          color: "#94a3b8",
        }}
      >
        Investigation not found.
      </div>
    );
  }

  const riskStyle = getRiskStyle(investigation.risk_level);

  return (
    <div
      style={{
        padding: "30px",
        color: "white",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* ========================================= */}
      {/* BACK BUTTON */}
      {/* ========================================= */}

      <button
        onClick={() => navigate("/investigations")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          fontSize: "15px",
          marginBottom: "25px",
        }}
      >
        <ArrowLeft size={18} />
        Back to Investigation History
      </button>

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div
        style={{
          background:
            "linear-gradient(135deg, #111827 0%, #172033 100%)",
          border: "1px solid #263449",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "25px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <Shield
                size={30}
                color="#00d9ff"
              />

              <h1
                style={{
                  margin: 0,
                  color: "#00d9ff",
                  fontSize: "32px",
                }}
              >
                Investigation #{investigation.id}
              </h1>
            </div>

            <p
              style={{
                margin: 0,
                color: "#94a3b8",
              }}
            >
              SentinelX Threat Investigation
            </p>
          </div>

          {/* Risk Badge */}

          <div
            style={{
              ...riskStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "999px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            <AlertTriangle size={17} />

            Risk:{" "}
            {investigation.risk_level || "Unknown"}
          </div>
        </div>

        {/* Timestamp */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "25px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          <Calendar size={16} />

          Created:{" "}
          {investigation.created_at
            ? new Date(
                investigation.created_at
              ).toLocaleString()
            : "Unavailable"}
        </div>
      </div>

      {/* ========================================= */}
      {/* THREAT OVERVIEW */}
      {/* ========================================= */}

      <SectionTitle
        icon={<Activity size={21} />}
        title="Threat Investigation Overview"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        <InfoCard
          icon={<Globe size={22} />}
          label="IP Address"
          value={investigation.ip}
          highlight
        />

        <InfoCard
          icon={<MapPin size={22} />}
          label="Country"
          value={investigation.country}
        />

        <InfoCard
          icon={<MapPin size={22} />}
          label="Region"
          value={investigation.region}
        />

        <InfoCard
          icon={<MapPin size={22} />}
          label="City"
          value={investigation.city}
        />

        <InfoCard
          icon={<Building2 size={22} />}
          label="Organization"
          value={investigation.organization}
        />

        <InfoCard
          icon={<Clock size={22} />}
          label="Timezone"
          value={investigation.timezone}
        />
      </div>

      {/* ========================================= */}
      {/* AI ANALYSIS */}
      {/* ========================================= */}

      <SectionTitle
        icon={<Brain size={21} />}
        title="AI Security Analysis"
      />

      <div
        style={{
          background: "#111827",
          border: "1px solid rgba(0, 217, 255, 0.3)",
          borderRadius: "18px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow:
            "0 0 30px rgba(0, 217, 255, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(0, 217, 255, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain
              size={22}
              color="#00d9ff"
            />
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                color: "#00d9ff",
              }}
            >
              SentinelX AI Analysis
            </h3>

            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Automated threat assessment
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#0b1220",
            borderRadius: "12px",
            padding: "25px",
            border: "1px solid #1e293b",
          }}
        >
          <pre
            style={{
              margin: 0,
              color: "#e2e8f0",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "inherit",
              lineHeight: "1.8",
              fontSize: "15px",
            }}
          >
            {investigation.ai_analysis ||
              "No AI analysis available for this investigation."}
          </pre>
        </div>
      </div>

      {/* ========================================= */}
      {/* INVESTIGATION STATUS */}
      {/* ========================================= */}

      <SectionTitle
        icon={<CheckCircle size={21} />}
        title="Investigation Status"
      />

      <div
        style={{
          background: "#111827",
          border: "1px solid #263449",
          borderRadius: "18px",
          padding: "25px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <CheckCircle
            size={24}
            color="#22c55e"
          />

          <div>
            <strong
              style={{
                color: "#e2e8f0",
                fontSize: "16px",
              }}
            >
              Investigation Available
            </strong>

            <p
              style={{
                color: "#64748b",
                margin: "5px 0 0",
              }}
            >
              This investigation has been stored in the
              SentinelX investigation history.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* ACTIONS */}
      {/* ========================================= */}

      <SectionTitle
        icon={<Shield size={21} />}
        title="Investigation Actions"
      />

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          paddingBottom: "40px",
        }}
      >
        <button
          onClick={() => navigate("/investigations")}
          style={{
            ...backButtonStyle,
            margin: 0,
          }}
        >
          <ArrowLeft size={18} />
          Back to History
        </button>

        <button
          onClick={handleDelete}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          <Trash2 size={18} />
          Delete Investigation
        </button>
      </div>
    </div>
  );
}

/* ============================================= */
/* SECTION TITLE */
/* ============================================= */

function SectionTitle({ icon, title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "15px",
      }}
    >
      <span style={{ color: "#00d9ff" }}>
        {icon}
      </span>

      <h2
        style={{
          margin: 0,
          color: "#e2e8f0",
          fontSize: "21px",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ============================================= */
/* INFO CARD */
/* ============================================= */

function InfoCard({
  icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      style={{
        background: "#111827",
        border: highlight
          ? "1px solid rgba(0, 217, 255, 0.4)"
          : "1px solid #263449",
        borderRadius: "15px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#00d9ff",
          marginBottom: "12px",
        }}
      >
        {icon}

        <span
          style={{
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          color: "#f8fafc",
          fontSize: "16px",
          fontWeight: "600",
          wordBreak: "break-word",
        }}
      >
        {value || "--"}
      </div>
    </div>
  );
}

const backButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#172033",
  color: "#e2e8f0",
  border: "1px solid #475569",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

export default InvestigationDetail;