import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import ThreatIntel from "./pages/ThreatIntel";
import AIChat from "./pages/AIChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="threat-intel" element={<ThreatIntel />} />

          <Route path="ai-chat" element={<AIChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;