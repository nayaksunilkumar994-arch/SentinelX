import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getInvestigations,
  deleteInvestigation,
} from "../services/investigationService";

function InvestigationHistory() {
  const navigate = useNavigate();

  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD INVESTIGATION HISTORY
  // ==========================================

  const loadInvestigations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInvestigations();

      setInvestigations(data);
    } catch (err) {
      console.error(
        "Investigation History Error:",
        err
      );

      setError(
        "Failed to load investigation history."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadInvestigations();
  }, []);

  // ==========================================
  // DELETE INVESTIGATION
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this investigation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteInvestigation(id);

      setInvestigations((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete Investigation Error:",
        err
      );

      alert(
        "Failed to delete investigation."
      );
    }
  };

  // ==========================================
  // VIEW INVESTIGATION DETAILS
  // ==========================================

  const handleViewDetails = (id) => {
    navigate(`/investigations/${id}`);
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div
      style={{
        padding: "30px",
        color: "white",
      }}
    >
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <h1
        style={{
          color: "#00d9ff",
          marginBottom: "10px",
        }}
      >
        Investigation History
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "30px",
        }}
      >
        View and manage previous SentinelX
        threat investigations.
      </p>

      {/* =====================================
          LOADING
      ===================================== */}

      {loading && (
        <div
          style={{
            background: "#172033",
            padding: "25px",
            borderRadius: "15px",
            border: "1px solid #263449",
          }}
        >
          Loading investigation history...
        </div>
      )}

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div
          style={{
            background: "#3f1722",
            border: "1px solid #ef4444",
            padding: "20px",
            borderRadius: "12px",
            color: "#fca5a5",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {!loading &&
        !error &&
        investigations.length === 0 && (
          <div
            style={{
              background: "#172033",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              color: "#94a3b8",
              border:
                "1px solid #263449",
            }}
          >
            No investigations found.
          </div>
        )}

      {/* =====================================
          INVESTIGATION LIST
      ===================================== */}

      {!loading &&
        !error &&
        investigations.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {investigations.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#172033",
                  padding: "25px",
                  borderRadius: "16px",
                  border:
                    "1px solid #263449",
                }}
              >
                {/* =================================
                    CARD HEADER
                ================================= */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Investigation information */}

                  <div>
                    <h2
                      style={{
                        color: "#00d9ff",
                        margin: 0,
                      }}
                    >
                      Investigation #
                      {item.id}
                    </h2>

                    <p
                      style={{
                        color: "#94a3b8",
                        marginTop: "8px",
                        marginBottom: 0,
                      }}
                    >
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  {/* =================================
                      ACTION BUTTONS
                  ================================= */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* VIEW DETAILS */}

                    <button
                      onClick={() =>
                        handleViewDetails(
                          item.id
                        )
                      }
                      style={{
                        background:
                          "#00d9ff",
                        color: "#050816",
                        border: "none",
                        padding:
                          "10px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight:
                          "bold",
                      }}
                    >
                      View Details
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      style={{
                        background:
                          "#dc2626",
                        color: "white",
                        border: "none",
                        padding:
                          "10px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight:
                          "bold",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* =================================
                    INVESTIGATION INFORMATION
                ================================= */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <Info
                    label="IP Address"
                    value={item.ip}
                  />

                  <Info
                    label="Country"
                    value={item.country}
                  />

                  <Info
                    label="Region"
                    value={item.region}
                  />

                  <Info
                    label="City"
                    value={item.city}
                  />

                  <Info
                    label="Organization"
                    value={
                      item.organization
                    }
                  />

                  <Info
                    label="Timezone"
                    value={
                      item.timezone
                    }
                  />

                  {/* Risk Level */}

                  <div
                    style={{
                      background:
                        "#0f172a",
                      padding: "15px",
                      borderRadius:
                        "10px",
                    }}
                  >
                    <div
                      style={{
                        color:
                          "#64748b",
                        fontSize:
                          "13px",
                        marginBottom:
                          "6px",
                      }}
                    >
                      Risk Level
                    </div>

                    <div
                      style={{
                        color:
                          getRiskColor(
                            item.risk_level
                          ),
                        fontWeight:
                          "bold",
                        textTransform:
                          "uppercase",
                      }}
                    >
                      {item.risk_level ||
                        "--"}
                    </div>
                  </div>
                </div>

                {/* =================================
                    AI ANALYSIS PREVIEW
                ================================= */}

                <div
                  style={{
                    marginTop: "20px",
                    background:
                      "#0f172a",
                    padding: "20px",
                    borderRadius:
                      "12px",
                  }}
                >
                  <h3
                    style={{
                      color: "#00d9ff",
                      marginTop: 0,
                      marginBottom:
                        "12px",
                    }}
                  >
                    AI Threat Analysis
                  </h3>

                  <p
                    style={{
                      color:
                        "#e2e8f0",
                      lineHeight: "1.7",
                      whiteSpace:
                        "pre-wrap",
                      marginBottom: 0,
                      display:
                        "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient:
                        "vertical",
                      overflow:
                        "hidden",
                    }}
                  >
                    {item.ai_analysis ||
                      "No AI analysis available."}
                  </p>
                </div>

                {/* =================================
                    DETAIL ACTION
                ================================= */}

                <div
                  style={{
                    marginTop: "18px",
                    textAlign: "right",
                  }}
                >
                  <button
                    onClick={() =>
                      handleViewDetails(
                        item.id
                      )
                    }
                    style={{
                      background:
                        "transparent",
                      color:
                        "#00d9ff",
                      border:
                        "1px solid rgba(0, 217, 255, 0.35)",
                      padding:
                        "10px 18px",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "600",
                    }}
                  >
                    Open Full Investigation →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

// ==========================================
// INFORMATION CARD
// ==========================================

function Info({ label, value }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "15px",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: "13px",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "white",
          fontWeight: "600",
        }}
      >
        {value || "--"}
      </div>
    </div>
  );
}

// ==========================================
// RISK COLOR
// ==========================================

function getRiskColor(riskLevel) {
  const risk =
    riskLevel?.toLowerCase();

  if (risk === "high") {
    return "#ef4444";
  }

  if (risk === "medium") {
    return "#f59e0b";
  }

  if (risk === "low") {
    return "#22c55e";
  }

  return "#94a3b8";
}

export default InvestigationHistory;