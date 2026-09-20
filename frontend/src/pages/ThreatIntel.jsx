import { useState } from "react";

import {
  analyzeIP,
  analyzeWithAI,
  saveInvestigation,
  generateReport,
} from "../services/threatService";


const INITIAL_RESULT = {
  ip: "--",

  risk_score: 0,
  risk_level: "--",
  confidence: "--",

  sources_checked: [],

  malicious_detections: 0,
  suspicious_detections: 0,

  abuse_confidence_score: 0,
  total_reports: 0,

  country_code: "--",
  isp: "--",

  recommended_action: "--",
  reason: "--",
};


function ThreatIntel() {

  const [ip, setIp] = useState("");

  const [loading, setLoading] = useState(false);

  const [reportLoading, setReportLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [result, setResult] = useState(
    INITIAL_RESULT
  );

  const [aiAnalysis, setAiAnalysis] = useState("");


  // ==========================================================
  // ERROR MESSAGE
  // ==========================================================

  const getErrorMessage = (error) => {

    if (error?.response?.data?.detail) {
      return error.response.data.detail;
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return "Unable to analyze the IP address.";
  };


  // ==========================================================
  // ANALYZE THREAT
  // ==========================================================

  const handleAnalyze = async () => {
    if (!ip.trim()) {
      setErrorMessage("Please enter an IP address.");
      setResult(INITIAL_RESULT);
      setAiAnalysis("");
      return;
    }

    setErrorMessage("");
    setResult(INITIAL_RESULT);
    setAiAnalysis("");
    setLoading(true);

    try {
      const cleanIP = ip.trim();
      const threat = await analyzeIP(cleanIP);

      console.log("Threat correlation result:", threat);

      setResult({
        ip: threat.ip || cleanIP,
        risk_score: threat.risk_score ?? 0,
        risk_level: threat.risk_level || "--",
        confidence: threat.confidence || "--",
        sources_checked: Array.isArray(threat.sources_checked)
          ? threat.sources_checked
          : [],
        malicious_detections: threat.malicious_detections ?? 0,
        suspicious_detections: threat.suspicious_detections ?? 0,
        abuse_confidence_score: threat.abuse_confidence_score ?? 0,
        total_reports: threat.total_reports ?? 0,
        country_code: threat.country_code || "--",
        isp: threat.isp || "--",
        recommended_action: threat.recommended_action || "--",
        reason: threat.reason || "No additional reason provided.",
      });

      const ai = await analyzeWithAI({
        ip: threat.ip || cleanIP,
        risk_score: threat.risk_score ?? 0,
        risk_level: threat.risk_level || "",
        confidence: threat.confidence || "",
        sources_checked: threat.sources_checked || [],
        malicious_detections: threat.malicious_detections ?? 0,
        suspicious_detections: threat.suspicious_detections ?? 0,
        abuse_confidence_score: threat.abuse_confidence_score ?? 0,
        total_reports: threat.total_reports ?? 0,
        country_code: threat.country_code || "",
        isp: threat.isp || "",
        recommended_action: threat.recommended_action || "",
        reason: threat.reason || "",
      });

      const analysis = ai?.analysis || "";
      setAiAnalysis(analysis);

      try {
        await saveInvestigation({
          ip: threat.ip || cleanIP,
          country: threat.country_code || null,
          region: null,
          city: null,
          organization: threat.isp || null,
          timezone: null,
          risk_level: threat.risk_level || null,
          ai_analysis: analysis,
        });
        console.log("Investigation saved successfully.");
      } catch (saveError) {
        console.error("Investigation Save Error:", saveError);
      }

      if (analysis) {
        try {
          console.log("Generating automatic PDF report...");
          setReportLoading(true);

          const pdfBlob = await generateReport(
            threat.ip || cleanIP,
            analysis
          );

          const url = window.URL.createObjectURL(
            new Blob([pdfBlob], { type: "application/pdf" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.download = `SentinelX_Report_${cleanIP}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          console.log("Automatic PDF report generated successfully.");
        } catch (reportError) {
          console.error("Automatic PDF Report Error:", reportError);
        } finally {
          setReportLoading(false);
        }
      }
    } catch (error) {
      console.error("Threat Analysis Error:", error);
      setResult(INITIAL_RESULT);
      setAiAnalysis("");
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // GENERATE PDF REPORT
  // ==========================================================

  const handleGenerateReport = async () => {

    if (
      !ip.trim() ||
      !aiAnalysis
    ) {

      alert(
        "Please analyze an IP address before generating the report."
      );

      return;
    }


    setReportLoading(true);


    try {

      const pdfBlob =
        await generateReport(
          ip.trim(),
          aiAnalysis
        );


      const url =
        window.URL.createObjectURL(
          new Blob(
            [pdfBlob],
            {
              type:
                "application/pdf",
            }
          )
        );


      const link =
        document.createElement("a");


      link.href = url;

      link.download =
        "SentinelX_Report.pdf";


      document.body.appendChild(
        link
      );


      link.click();

      link.remove();


      window.URL.revokeObjectURL(
        url
      );

    } catch (error) {

      console.error(
        "PDF Report Error:",
        error
      );


      alert(
        "Unable to generate the PDF report."
      );

    } finally {

      setReportLoading(false);

    }

  };


  // ==========================================================
  // RISK LEVEL DISPLAY
  // ==========================================================

  const getRiskColor = () => {

    const level =
      result.risk_level?.toLowerCase();

    if (level === "malicious") {
      return "#ef4444";
    }

    if (level === "suspicious") {
      return "#f59e0b";
    }

    if (level === "safe") {
      return "#22c55e";
    }

    return "#94a3b8";
  };


  // ==========================================================
  // ACTION DISPLAY
  // ==========================================================

  const getActionColor = () => {

    const action =
      result.recommended_action?.toLowerCase();

    if (
      action.includes("block") ||
      action.includes("isolate")
    ) {
      return "#ef4444";
    }

    if (
      action.includes("monitor") ||
      action.includes("investigate")
    ) {
      return "#f59e0b";
    }

    if (
      action.includes("allow")
    ) {
      return "#22c55e";
    }

    return "#94a3b8";
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div>

      {/* ================================================== */}
      {/* PAGE TITLE */}
      {/* ================================================== */}

      <h1
        style={{
          color: "#00d9ff",
          marginBottom: "30px",
        }}
      >
        AI Threat Intelligence
      </h1>


      {/* ================================================== */}
      {/* MAIN CARD */}
      {/* ================================================== */}

      <div
        style={{
          background: "#172033",
          padding: "30px",
          borderRadius: "20px",
        }}
      >

        <h2
          style={{
            color: "white",
          }}
        >
          Enter IP Address
        </h2>


        {/* ================================================== */}
        {/* IP INPUT */}
        {/* ================================================== */}

        <input

          value={ip}

          onChange={(e) => {

            setIp(
              e.target.value
            );

            if (errorMessage) {
              setErrorMessage("");
            }

          }}

          onKeyDown={(e) => {

            if (e.key === "Enter") {
              handleAnalyze();
            }

          }}

          placeholder="8.8.8.8"

          style={{
            width: "100%",
            padding: "18px",
            marginTop: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "none",
            background: "#0f172a",
            color: "white",
            fontSize: "18px",
            boxSizing: "border-box",
          }}

        />


        {/* ================================================== */}
        {/* ANALYZE BUTTON */}
        {/* ================================================== */}

        <button

          onClick={
            handleAnalyze
          }

          disabled={loading}

          style={{
            padding:
              "15px 40px",

            background:
              loading
                ? "#475569"
                : "#00d9ff",

            color:
              "#050816",

            border:
              "none",

            borderRadius:
              "10px",

            cursor:
              loading
                ? "not-allowed"
                : "pointer",

            fontWeight:
              "bold",

            fontSize:
              "16px",
          }}

        >

          {loading
            ? "Analyzing..."
            : "Analyze Threat"}

        </button>


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {errorMessage && (

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              background: "#3f1015",
              border:
                "1px solid #ef4444",
              borderRadius: "10px",
              color: "#fca5a5",
            }}
          >

            <strong>
              Analysis Failed:
            </strong>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              {errorMessage}
            </div>

          </div>

        )}


        {/* ================================================== */}
        {/* CORRELATION RESULT */}
        {/* ================================================== */}

        {result.risk_level !== "--" && (

          <div
            style={{
              marginTop: "35px",
            }}
          >

            {/* ============================================== */}
            {/* RISK SUMMARY */}
            {/* ============================================== */}

            <div
              style={{
                background: "#0f172a",
                padding: "25px",
                borderRadius: "15px",
              }}
            >

              <h2
                style={{
                  color: "#00d9ff",
                  marginTop: 0,
                }}
              >
                Threat Assessment
              </h2>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "15px",
                }}
              >

                {/* Risk Score */}

                <div
                  style={{
                    background: "#172033",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >

                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    Risk Score
                  </div>

                  <div
                    style={{
                      color: "#00d9ff",
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {result.risk_score}
                  </div>

                </div>


                {/* Risk Level */}

                <div
                  style={{
                    background: "#172033",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >

                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    Risk Level
                  </div>

                  <div
                    style={{
                      color: getRiskColor(),
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "12px",
                    }}
                  >
                    {result.risk_level}
                  </div>

                </div>


                {/* Confidence */}

                <div
                  style={{
                    background: "#172033",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >

                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    Confidence
                  </div>

                  <div
                    style={{
                      color: "white",
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "12px",
                    }}
                  >
                    {result.confidence}
                  </div>

                </div>


                {/* Recommended Action */}

                <div
                  style={{
                    background: "#172033",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >

                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    Recommended Action
                  </div>

                  <div
                    style={{
                      color: getActionColor(),
                      fontSize: "22px",
                      fontWeight: "bold",
                      marginTop: "12px",
                    }}
                  >
                    {result.recommended_action}
                  </div>

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* SOURCES */}
            {/* ================================================= */}

            <div
              style={{
                marginTop: "20px",
                background: "#0f172a",
                padding: "25px",
                borderRadius: "15px",
              }}
            >

              <h2
                style={{
                  color: "#00d9ff",
                  marginTop: 0,
                }}
              >
                Intelligence Sources
              </h2>


              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >

                {result.sources_checked.length > 0 ? (

                  result.sources_checked.map(
                    (source) => (

                      <span
                        key={source}
                        style={{
                          padding:
                            "8px 14px",
                          background:
                            "#172033",
                          color:
                            "#00d9ff",
                          borderRadius:
                            "20px",
                          fontSize:
                            "14px",
                        }}
                      >
                        {source}
                      </span>

                    )
                  )

                ) : (

                  <span
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    No source information.
                  </span>

                )}

              </div>

            </div>


            {/* ================================================= */}
            {/* VIRUSTOTAL */}
            {/* ================================================= */}

            <div
              style={{
                marginTop: "20px",
                background: "#0f172a",
                padding: "25px",
                borderRadius: "15px",
              }}
            >

              <h2
                style={{
                  color: "#00d9ff",
                  marginTop: 0,
                }}
              >
                VirusTotal Intelligence
              </h2>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "15px",
                }}
              >

                <div
                  style={{
                    background: "#172033",
                    padding: "18px",
                    borderRadius: "10px",
                  }}
                >

                  <div
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    Malicious Detections
                  </div>

                  <div
                    style={{
                      color:
                        result.malicious_detections > 0
                          ? "#ef4444"
                          : "#22c55e",
                      fontSize: "26px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {result.malicious_detections}
                  </div>

                </div>


                <div
                  style={{
                    background: "#172033",
                    padding: "18px",
                    borderRadius: "10px",
                  }}
                >

                  <div
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    Suspicious Detections
                  </div>

                  <div
                    style={{
                      color:
                        result.suspicious_detections > 0
                          ? "#f59e0b"
                          : "#22c55e",
                      fontSize: "26px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {result.suspicious_detections}
                  </div>

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* ABUSEIPDB */}
            {/* ================================================= */}

            <div
              style={{
                marginTop: "20px",
                background: "#0f172a",
                padding: "25px",
                borderRadius: "15px",
              }}
            >

              <h2
                style={{
                  color: "#00d9ff",
                  marginTop: 0,
                }}
              >
                AbuseIPDB Intelligence
              </h2>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "15px",
                }}
              >

                <div
                  style={{
                    background: "#172033",
                    padding: "18px",
                    borderRadius: "10px",
                  }}
                >

                  <div
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    Abuse Confidence Score
                  </div>

                  <div
                    style={{
                      color:
                        result.abuse_confidence_score > 0
                          ? "#f59e0b"
                          : "#22c55e",
                      fontSize: "26px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {result.abuse_confidence_score}
                  </div>

                </div>


                <div
                  style={{
                    background: "#172033",
                    padding: "18px",
                    borderRadius: "10px",
                  }}
                >

                  <div
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    Total Reports
                  </div>

                  <div
                    style={{
                      color: "white",
                      fontSize: "26px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {result.total_reports}
                  </div>

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* IP INFORMATION */}
            {/* ================================================= */}

            <div
              style={{
                marginTop: "20px",
                background: "#0f172a",
                padding: "25px",
                borderRadius: "15px",
              }}
            >

              <h2
                style={{
                  color: "#00d9ff",
                  marginTop: 0,
                }}
              >
                IP Information
              </h2>


              <p style={{ color: "white" }}>
                <strong>IP Address:</strong>{" "}
                {result.ip}
              </p>


              <p style={{ color: "white" }}>
                <strong>Country:</strong>{" "}
                {result.country_code}
              </p>


              <p style={{ color: "white" }}>
                <strong>ISP:</strong>{" "}
                {result.isp}
              </p>

            </div>


            {/* ================================================= */}
            {/* SECURITY DECISION */}
            {/* ================================================= */}

            <div
              style={{
                marginTop: "20px",
                background: "#0f172a",
                padding: "25px",
                borderRadius: "15px",
                border:
                  `2px solid ${getActionColor()}`,
              }}
            >

              <h2
                style={{
                  color: getActionColor(),
                  marginTop: 0,
                }}
              >
                Security Decision
              </h2>


              <p
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Recommended Action:{" "}
                {result.recommended_action}
              </p>


              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.7",
                }}
              >
                <strong>
                  Reason:
                </strong>{" "}
                {result.reason}
              </p>

            </div>

          </div>

        )}


        {/* ================================================== */}
        {/* AI ANALYSIS */}
        {/* ================================================== */}

        {aiAnalysis && (

          <div
            style={{
              marginTop: "30px",
              background: "#101826",
              padding: "25px",
              borderRadius: "15px",
              border:
                "2px solid #00d9ff",
            }}
          >

            <h2
              style={{
                color: "#00d9ff",
                marginTop: 0,
              }}
            >
              🤖 AI Security Analysis
            </h2>


            <pre
              style={{
                color: "#ffffff",
                whiteSpace:
                  "pre-wrap",
                fontFamily:
                  "inherit",
                lineHeight:
                  "1.7",
              }}
            >
              {aiAnalysis}
            </pre>


            {/* ================================================= */}
            {/* PDF REPORT */}
            {/* ================================================= */}

            <div
              style={{
                marginTop: "25px",
                paddingTop: "20px",
                borderTop:
                  "1px solid #263449",
              }}
            >

              <button

                onClick={
                  handleGenerateReport
                }

                disabled={
                  reportLoading
                }

                style={{
                  padding:
                    "13px 28px",

                  background:
                    reportLoading
                      ? "#475569"
                      : "linear-gradient(135deg, #2563eb, #0891b2)",

                  color:
                    "white",

                  border:
                    "none",

                  borderRadius:
                    "10px",

                  cursor:
                    reportLoading
                      ? "not-allowed"
                      : "pointer",

                  fontWeight:
                    "bold",

                  fontSize:
                    "15px",

                  boxShadow:
                    "0 5px 20px rgba(0,217,255,0.15)",
                }}

              >

                {reportLoading
                  ? "Generating Report..."
                  : "📄 Generate PDF Report"}

              </button>


              <p
                style={{
                  color:
                    "#64748b",

                  fontSize:
                    "12px",

                  marginTop:
                    "10px",
                }}
              >
                Generate a professional
                SentinelX threat intelligence
                report from this analysis.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}


export default ThreatIntel;