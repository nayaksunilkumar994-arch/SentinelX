import { useEffect, useState } from "react";
import {
  Bell,
  Brain,
  FileText,
  KeyRound,
  Monitor,
  Server,
  Shield,
  User,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

// ==========================================================
// SENTINELX SETTINGS
// ==========================================================

const DEFAULT_SETTINGS = {
  loginNotifications: true,
  aiThreatAnalysis: true,
  analysisMode: "Professional",
  recommendations: true,

  criticalAlerts: true,
  highRiskAlerts: true,
  mediumRiskAlerts: true,

  includeAIAssessment: true,
  includeThreatIntelligence: true,
  includeRecommendations: true,
};

const STORAGE_KEY = "sentinelx_settings";

function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  // ========================================================
  // LOAD SETTINGS
  // ========================================================

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY);

      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
        });
      }
    } catch (error) {
      console.error("Failed to load SentinelX settings:", error);
    }
  }, []);

  // ========================================================
  // UPDATE SETTING
  // ========================================================

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  // ========================================================
  // SAVE SETTINGS
  // ========================================================

  const saveSettings = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save SentinelX settings:", error);
    }
  };

  // ========================================================
  // RESET SETTINGS
  // ========================================================

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  };

  // ========================================================
  // TOGGLE COMPONENT
  // ========================================================

  const Toggle = ({ enabled, onChange }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          enabled ? "bg-cyan-500" : "bg-slate-700"
        }`}
        aria-pressed={enabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  };

  // ========================================================
  // STATUS LABEL
  // ========================================================

  const Status = ({ enabled }) => {
    return (
      <span
        className={
          enabled
            ? "text-green-400 text-sm"
            : "text-gray-500 text-sm"
        }
      >
        {enabled ? "Enabled" : "Disabled"}
      </span>
    );
  };

  // ========================================================
  // SETTING ROW
  // ========================================================

  const SettingRow = ({
    label,
    description,
    enabled,
    onChange,
  }) => {
    return (
      <div className="flex items-center justify-between gap-6 py-3">
        <div>
          <p className="text-gray-200">{label}</p>

          {description && (
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Status enabled={enabled} />

          <Toggle
            enabled={enabled}
            onChange={onChange}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full p-8">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="mb-8">

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
            <Monitor
              size={34}
              className="text-cyan-400"
            />
          </div>

          <div>

            <h1 className="text-4xl font-bold text-cyan-400">
              Settings
            </h1>

            <p className="text-gray-400 mt-2">
              Configure SentinelX security, AI,
              threat intelligence, alerts, and reports.
            </p>

          </div>

        </div>

      </div>


      {/* ====================================================
          SAVE BAR
      ==================================================== */}

      <div
        className="
          mb-8
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
          rounded-2xl
          border
          border-cyan-500/20
          bg-slate-900/70
          p-5
        "
      >

        <div>

          <p className="text-white font-semibold">
            SentinelX Configuration
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Changes are stored locally in this browser.
          </p>

        </div>


        <div className="flex items-center gap-3">

          {saved && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 size={18} />
              Settings saved
            </div>
          )}

          <button
            type="button"
            onClick={resetSettings}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-slate-600
              px-4
              py-2
              text-gray-300
              hover:bg-slate-800
              transition
            "
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            type="button"
            onClick={saveSettings}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-cyan-500
              px-5
              py-2
              font-semibold
              text-slate-950
              hover:bg-cyan-400
              transition
            "
          >
            <Save size={17} />
            Save Settings
          </button>

        </div>

      </div>


      {/* ====================================================
          SETTINGS GRID
      ==================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* ==================================================
            PROFILE
        ================================================== */}

        <section className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        ">

          <div className="flex items-center gap-3 mb-6">

            <User
              size={24}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-semibold text-white">
                Profile & Account
              </h2>

              <p className="text-sm text-gray-400">
                Current SentinelX account information.
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <div>
              <p className="text-xs text-gray-500">
                Name
              </p>

              <p className="text-gray-200 mt-1">
                Admin
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Role
              </p>

              <p className="text-gray-200 mt-1">
                Administrator
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Account Status
              </p>

              <p className="text-green-400 mt-1">
                Active
              </p>
            </div>

          </div>

        </section>


        {/* ==================================================
            SECURITY
        ================================================== */}

        <section className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        ">

          <div className="flex items-center gap-3 mb-6">

            <Shield
              size={24}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-semibold text-white">
                Security
              </h2>

              <p className="text-sm text-gray-400">
                Configure account security controls.
              </p>

            </div>

          </div>


          <div>

            <div className="flex items-center justify-between py-3">

              <div>
                <p className="text-gray-300">
                  Two-Factor Authentication
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Authentication service not configured.
                </p>
              </div>

              <span className="text-yellow-400 text-sm">
                Not configured
              </span>

            </div>


            <SettingRow
              label="Login Notifications"
              description="Notify the administrator about account logins."
              enabled={settings.loginNotifications}
              onChange={(value) =>
                updateSetting("loginNotifications", value)
              }
            />


            <div className="flex items-center justify-between py-3">

              <div>
                <p className="text-gray-300">
                  API Authentication
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  SentinelX API authentication remains active.
                </p>
              </div>

              <span className="text-green-400 text-sm">
                Enabled
              </span>

            </div>

          </div>

        </section>


        {/* ==================================================
            AI CONFIGURATION
        ================================================== */}

        <section className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        ">

          <div className="flex items-center gap-3 mb-6">

            <Brain
              size={24}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-semibold text-white">
                AI Configuration
              </h2>

              <p className="text-sm text-gray-400">
                Configure SentinelX AI threat analysis.
              </p>

            </div>

          </div>


          <div>

            <SettingRow
              label="AI Threat Analysis"
              description="Enable automated threat assessment."
              enabled={settings.aiThreatAnalysis}
              onChange={(value) =>
                updateSetting("aiThreatAnalysis", value)
              }
            />


            <div className="flex items-center justify-between py-4">

              <div>

                <p className="text-gray-300">
                  Analysis Mode
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Select the analysis response style.
                </p>

              </div>

              <select
                value={settings.analysisMode}
                onChange={(event) =>
                  updateSetting(
                    "analysisMode",
                    event.target.value
                  )
                }
                className="
                  rounded-lg
                  border
                  border-slate-600
                  bg-slate-800
                  px-3
                  py-2
                  text-gray-200
                  outline-none
                  focus:border-cyan-400
                "
              >
                <option>Professional</option>
                <option>Technical</option>
                <option>Executive</option>
              </select>

            </div>


            <SettingRow
              label="Recommendations"
              description="Include AI-generated security recommendations."
              enabled={settings.recommendations}
              onChange={(value) =>
                updateSetting("recommendations", value)
              }
            />

          </div>

        </section>


        {/* ==================================================
            THREAT INTELLIGENCE
        ================================================== */}

        <section className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        ">

          <div className="flex items-center gap-3 mb-6">

            <Server
              size={24}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-semibold text-white">
                Threat Intelligence
              </h2>

              <p className="text-sm text-gray-400">
                Monitor external intelligence integrations.
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                VirusTotal
              </span>

              <span className="text-green-400">
                Available
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                AbuseIPDB
              </span>

              <span className="text-green-400">
                Available
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                DNS Intelligence
              </span>

              <span className="text-green-400">
                Enabled
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                WHOIS
              </span>

              <span className="text-green-400">
                Enabled
              </span>
            </div>

          </div>

        </section>


        {/* ==================================================
            ALERTS
        ================================================== */}

        <section className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        ">

          <div className="flex items-center gap-3 mb-6">

            <Bell
              size={24}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-semibold text-white">
                Alert Configuration
              </h2>

              <p className="text-sm text-gray-400">
                Configure SOC alert behavior.
              </p>

            </div>

          </div>


          <div>

            <SettingRow
              label="Critical Threat Alerts"
              description="Generate alerts for critical threats."
              enabled={settings.criticalAlerts}
              onChange={(value) =>
                updateSetting("criticalAlerts", value)
              }
            />

            <SettingRow
              label="High Risk Alerts"
              description="Generate alerts for high-risk threats."
              enabled={settings.highRiskAlerts}
              onChange={(value) =>
                updateSetting("highRiskAlerts", value)
              }
            />

            <SettingRow
              label="Medium Risk Alerts"
              description="Generate alerts for medium-risk threats."
              enabled={settings.mediumRiskAlerts}
              onChange={(value) =>
                updateSetting("mediumRiskAlerts", value)
              }
            />

          </div>

        </section>


        {/* ==================================================
            REPORTS
        ================================================== */}

        <section className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        ">

          <div className="flex items-center gap-3 mb-6">

            <FileText
              size={24}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-semibold text-white">
                Report Preferences
              </h2>

              <p className="text-sm text-gray-400">
                Configure generated SentinelX reports.
              </p>

            </div>

          </div>


          <div>

            <SettingRow
              label="Include AI Assessment"
              description="Include AI threat assessment in reports."
              enabled={settings.includeAIAssessment}
              onChange={(value) =>
                updateSetting("includeAIAssessment", value)
              }
            />

            <SettingRow
              label="Include Threat Intelligence"
              description="Include threat intelligence results."
              enabled={settings.includeThreatIntelligence}
              onChange={(value) =>
                updateSetting(
                  "includeThreatIntelligence",
                  value
                )
              }
            />

            <SettingRow
              label="Include Recommendations"
              description="Include recommended security actions."
              enabled={settings.includeRecommendations}
              onChange={(value) =>
                updateSetting(
                  "includeRecommendations",
                  value
                )
              }
            />

          </div>

        </section>


        {/* ==================================================
            API / INTEGRATIONS
        ================================================== */}

        <section className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        ">

          <div className="flex items-center gap-3 mb-6">

            <KeyRound
              size={24}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-semibold text-white">
                API & Integrations
              </h2>

              <p className="text-sm text-gray-400">
                External service connectivity.
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                Backend API
              </span>

              <span className="text-green-400">
                Operational
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                Threat Intelligence APIs
              </span>

              <span className="text-green-400">
                Available
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                AI Service
              </span>

              <span className="text-green-400">
                Available
              </span>
            </div>

          </div>

        </section>


        {/* ==================================================
            SYSTEM
        ================================================== */}

        <section className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          p-6
        ">

          <div className="flex items-center gap-3 mb-6">

            <Monitor
              size={24}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-semibold text-white">
                System Information
              </h2>

              <p className="text-sm text-gray-400">
                SentinelX platform status.
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                Platform
              </span>

              <span className="text-white">
                SentinelX
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                Frontend
              </span>

              <span className="text-white">
                React + Vite
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                Backend
              </span>

              <span className="text-white">
                FastAPI
              </span>
            </div>


            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                Database
              </span>

              <span className="text-white">
                PostgreSQL
              </span>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

// ==========================================================
// EXPORT
// ==========================================================

export default Settings;