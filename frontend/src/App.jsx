import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import ThreatIntel from "./pages/ThreatIntel";
import AIAnalysis from "./pages/AIAnalysis";
import AIChat from "./pages/AIChat";
import InvestigationHistory from "./pages/InvestigationHistory";
import InvestigationDetail from "./pages/InvestigationDetail";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Authentication Route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected SentinelX Application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/threat-intel"
              element={<ThreatIntel />}
            />

            <Route
              path="/ai-analysis"
              element={<AIAnalysis />}
            />

            <Route
              path="/ai-chat"
              element={<AIChat />}
            />

            <Route
              path="/investigations"
              element={<InvestigationHistory />}
            />

            <Route
              path="/investigations/:id"
              element={<InvestigationDetail />}
            />

            <Route
              path="/alerts"
              element={<Alerts />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;