import { useState } from "react";

import {
  AlertTriangle,
  Download,
  FileText,
  Loader2,
  Server,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { generateReport } from "../services/threatService";


// ==========================================================
// REPORTS PAGE
// ==========================================================

function Reports() {
  const [ip, setIp] = useState("");
  const [analysis, setAnalysis] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  // ==========================================================
  // GENERATE PDF REPORT
  // ==========================================================

  const handleGenerateReport = async () => {
    setSuccess("");
    setError("");

    const cleanIP = ip.trim();
    const cleanAnalysis = analysis.trim();

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!cleanIP) {
      setError("Please enter an IP address.");
      return;
    }

    if (!cleanAnalysis) {
      setError("Please enter the AI security analysis.");
      return;
    }

    // --------------------------------------------------------
    // GENERATE REPORT
    // --------------------------------------------------------

    try {
      setLoading(true);

      const pdfBlob = await generateReport(
        cleanIP,
        cleanAnalysis
      );

      // ------------------------------------------------------
      // CREATE DOWNLOAD BLOB
      // ------------------------------------------------------

      const blob = new Blob(
        [pdfBlob],
        {
          type: "application/pdf",
        }
      );

      // ------------------------------------------------------
      // CREATE DOWNLOAD URL
      // ------------------------------------------------------

      const url = window.URL.createObjectURL(blob);

      // ------------------------------------------------------
      // CREATE DOWNLOAD LINK
      // ------------------------------------------------------

      const link = document.createElement("a");

      link.href = url;
      link.download = "SentinelX_Report.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // ------------------------------------------------------
      // CLEANUP
      // ------------------------------------------------------

      window.URL.revokeObjectURL(url);

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      setSuccess(
        "SentinelX PDF report generated and downloaded successfully."
      );
    } catch (err) {
      console.error(
        "SentinelX PDF Report Error:",
        err
      );

      let message =
        "Unable to generate the PDF report.";

      // ------------------------------------------------------
      // HANDLE BLOB ERROR
      // ------------------------------------------------------

      try {
        if (err?.response?.data instanceof Blob) {
          const text =
            await err.response.data.text();

          const parsed =
            JSON.parse(text);

          if (parsed?.detail) {
            message = parsed.detail;
          }
        } else if (err?.response?.data?.detail) {
          message = err.response.data.detail;
        } else if (err?.message) {
          message = err.message;
        }
      } catch {
        if (err?.message) {
          message = err.message;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // CLEAR FORM
  // ==========================================================

  const handleClear = () => {
    if (loading) {
      return;
    }

    setIp("");
    setAnalysis("");
    setSuccess("");
    setError("");
  };


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="min-h-full p-8">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-4">

          <div
            className="
              p-3
              rounded-xl
              bg-cyan-500/10
              border
              border-cyan-500/20
            "
          >
            <FileText
              size={34}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-cyan-400">
              Reports
            </h1>

            <p className="text-gray-400 mt-2">
              Generate professional SentinelX
              cybersecurity investigation reports.
            </p>
          </div>

        </div>


        {/* CLEAR */}

        <button
          type="button"
          onClick={handleClear}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-lg
            border
            border-slate-600
            text-gray-300
            hover:bg-slate-800
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <Trash2 size={18} />
          Clear
        </button>

      </div>


      {/* ====================================================
          REPORT GENERATOR
      ==================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        "
      >

        {/* TITLE */}

        <div className="flex items-center gap-3 mb-6">

          <ShieldCheck
            size={26}
            className="text-cyan-400"
          />

          <div>

            <h2 className="text-2xl font-semibold text-white">
              PDF Security Report Generator
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Convert an AI security assessment into
              a downloadable PDF report.
            </p>

          </div>

        </div>


        {/* ==================================================
            IP ADDRESS
        ================================================== */}

        <div className="mb-6">

          <label
            htmlFor="report-ip"
            className="
              block
              text-sm
              font-medium
              text-gray-300
              mb-2
            "
          >
            IP Address
            <span className="text-red-400 ml-1">
              *
            </span>
          </label>

          <div className="relative">

            <Server
              size={18}
              className="
                absolute
                left-3
                top-3.5
                text-cyan-400
              "
            />

            <input
              id="report-ip"
              type="text"
              value={ip}
              onChange={(event) => {
                setIp(event.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Enter IP address, e.g. 8.8.8.8"
              autoComplete="off"
              disabled={loading}
              className="
                w-full
                pl-10
                pr-4
                py-3
                rounded-lg
                bg-slate-950
                border
                border-slate-700
                text-white
                placeholder-slate-600
                outline-none
                focus:border-cyan-400
                focus:ring-1
                focus:ring-cyan-400
                transition
                disabled:opacity-50
              "
            />

          </div>

        </div>


        {/* ==================================================
            AI ANALYSIS
        ================================================== */}

        <div className="mb-6">

          <label
            htmlFor="report-analysis"
            className="
              block
              text-sm
              font-medium
              text-gray-300
              mb-2
            "
          >
            AI Security Analysis
            <span className="text-red-400 ml-1">
              *
            </span>
          </label>

          <textarea
            id="report-analysis"
            value={analysis}
            onChange={(event) => {
              setAnalysis(event.target.value);
              setError("");
              setSuccess("");
            }}
            placeholder="Paste the SentinelX AI Security Assessment here..."
            rows={14}
            disabled={loading}
            className="
              w-full
              px-4
              py-3
              rounded-lg
              bg-slate-950
              border
              border-slate-700
              text-white
              placeholder-slate-600
              outline-none
              resize-y
              focus:border-cyan-400
              focus:ring-1
              focus:ring-cyan-400
              transition
              disabled:opacity-50
            "
          />

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="
              mb-5
              flex
              items-start
              gap-3
              p-4
              rounded-lg
              border
              border-red-500/40
              bg-red-500/10
              text-red-400
            "
          >

            <AlertTriangle
              size={20}
              className="mt-0.5 flex-shrink-0"
            />

            <div>
              <p className="font-medium">
                Report Generation Failed
              </p>

              <p className="text-sm mt-1">
                {error}
              </p>
            </div>

          </div>
        )}


        {/* ==================================================
            SUCCESS
        ================================================== */}

        {success && (
          <div
            className="
              mb-5
              flex
              items-start
              gap-3
              p-4
              rounded-lg
              border
              border-green-500/40
              bg-green-500/10
              text-green-400
            "
          >

            <ShieldCheck
              size={20}
              className="mt-0.5 flex-shrink-0"
            />

            <div>
              <p className="font-medium">
                Report Generated
              </p>

              <p className="text-sm mt-1">
                {success}
              </p>
            </div>

          </div>
        )}


        {/* ==================================================
            GENERATE BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={handleGenerateReport}
          disabled={loading}
          className="
            flex
            items-center
            gap-3
            px-6
            py-3
            rounded-lg
            bg-cyan-500
            text-black
            font-semibold
            hover:bg-cyan-400
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >

          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />

              Generating Report...
            </>
          ) : (
            <>
              <Download size={20} />

              Generate PDF Report
            </>
          )}

        </button>

      </div>


      {/* ====================================================
          WORKFLOW
      ==================================================== */}

      <div
        className="
          mt-6
          rounded-xl
          border
          border-slate-700
          bg-slate-900/40
          p-5
        "
      >

        <h3 className="text-lg font-semibold text-white mb-4">
          Report Workflow
        </h3>

        <div className="space-y-3 text-gray-400">

          <p>
            <span className="text-cyan-400 font-medium">
              1.
            </span>{" "}
            Enter the investigated IP address.
          </p>

          <p>
            <span className="text-cyan-400 font-medium">
              2.
            </span>{" "}
            Run the threat intelligence investigation.
          </p>

          <p>
            <span className="text-cyan-400 font-medium">
              3.
            </span>{" "}
            Run the AI security analysis.
          </p>

          <p>
            <span className="text-cyan-400 font-medium">
              4.
            </span>{" "}
            Paste the AI Security Assessment above.
          </p>

          <p>
            <span className="text-cyan-400 font-medium">
              5.
            </span>{" "}
            Click Generate PDF Report.
          </p>

          <p>
            <span className="text-cyan-400 font-medium">
              6.
            </span>{" "}
            SentinelX sends the request to the FastAPI
            report engine.
          </p>

          <p>
            <span className="text-cyan-400 font-medium">
              7.
            </span>{" "}
            The generated PDF is downloaded automatically.
          </p>

        </div>

      </div>

    </div>
  );
}


// ==========================================================
// EXPORT
// ==========================================================

export default Reports;