import { useState } from "react";
import {
  Bot,
  ShieldAlert,
  Activity,
  MapPin,
  Building2,
  Globe,
  RefreshCw,
} from "lucide-react";

import { analyzeThreatWithAI } from "../services/aiService";


function AIAnalysis() {

  const [ip, setIp] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [organization, setOrganization] = useState("");
  const [timezone, setTimezone] = useState("");

  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
  // RUN AI ANALYSIS
  // ==========================================

  const handleAnalyze = async () => {

    if (!ip.trim()) {
      setError("Please enter an IP address.");
      return;
    }

    try {

      setLoading(true);
      setError("");
      setAnalysis("");

      const result = await analyzeThreatWithAI({
        ip,
        country,
        city,
        organization,
        timezone,
      });

      setAnalysis(
        result?.analysis || "No AI analysis returned."
      );

    } catch (err) {

      console.error(
        "AI Analysis Error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to perform AI analysis."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // CLEAR ANALYSIS
  // ==========================================

  const handleClear = () => {

    setIp("");
    setCountry("");
    setCity("");
    setOrganization("");
    setTimezone("");
    setAnalysis("");
    setError("");

  };


  return (

    <div className="min-h-full p-8">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-4">

          <div className="p-3 rounded-xl bg-cyan-500/10">

            <Bot
              size={34}
              className="text-cyan-400"
            />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-cyan-400">
              AI Analysis
            </h1>

            <p className="text-gray-400 mt-2">
              Automated AI-powered cybersecurity threat assessment.
            </p>

          </div>

        </div>


        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-600 text-gray-300 hover:bg-slate-800"
        >

          <RefreshCw size={18} />

          Clear

        </button>

      </div>


      {/* =====================================
          INPUT PANEL
      ===================================== */}

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 mb-8">

        <h2 className="text-2xl font-semibold text-white mb-6">
          Threat Information
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


          {/* IP */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              IP Address *
            </label>

            <div className="relative">

              <ShieldAlert
                size={18}
                className="absolute left-3 top-3.5 text-cyan-400"
              />

              <input
                type="text"
                value={ip}
                onChange={(e) =>
                  setIp(e.target.value)
                }
                placeholder="8.8.8.8"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

            </div>

          </div>


          {/* Country */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Country
            </label>

            <div className="relative">

              <Globe
                size={18}
                className="absolute left-3 top-3.5 text-cyan-400"
              />

              <input
                type="text"
                value={country}
                onChange={(e) =>
                  setCountry(e.target.value)
                }
                placeholder="US"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

            </div>

          </div>


          {/* City */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              City
            </label>

            <div className="relative">

              <MapPin
                size={18}
                className="absolute left-3 top-3.5 text-cyan-400"
              />

              <input
                type="text"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                placeholder="Mountain View"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

            </div>

          </div>


          {/* Organization */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Organization
            </label>

            <div className="relative">

              <Building2
                size={18}
                className="absolute left-3 top-3.5 text-cyan-400"
              />

              <input
                type="text"
                value={organization}
                onChange={(e) =>
                  setOrganization(e.target.value)
                }
                placeholder="Google LLC"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-400"
              />

            </div>

          </div>


          {/* Timezone */}

          <div className="md:col-span-2">

            <label className="block text-sm text-gray-400 mb-2">
              Timezone
            </label>

            <input
              type="text"
              value={timezone}
              onChange={(e) =>
                setTimezone(e.target.value)
              }
              placeholder="America/Los_Angeles"
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-400"
            />

          </div>

        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (

          <div className="mt-5 p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400">
            {error}
          </div>

        )}


        {/* =====================================
            ANALYZE BUTTON
        ===================================== */}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 flex items-center gap-3 px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50"
        >

          {loading ? (

            <>
              <Activity
                size={18}
                className="animate-pulse"
              />

              Analyzing Threat...

            </>

          ) : (

            <>
              <Bot size={18} />

              Run AI Analysis

            </>

          )}

        </button>

      </div>


      {/* =====================================
          AI RESULT
      ===================================== */}

      {analysis && (

        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6">

          <div className="flex items-center gap-3 mb-6">

            <Bot
              size={28}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-2xl font-semibold text-white">
                AI Security Assessment
              </h2>

              <p className="text-gray-400 text-sm">
                SentinelX AI threat assessment result
              </p>

            </div>

          </div>


          <div className="rounded-xl bg-slate-950 border border-slate-700 p-6">

            <pre className="whitespace-pre-wrap text-gray-200 leading-7 font-sans">
              {analysis}
            </pre>

          </div>

        </div>

      )}

    </div>

  );
}

export default AIAnalysis;