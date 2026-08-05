import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

export default function useDashboard() {
  const [stats, setStats] = useState({
    threats_detected: 0,
    ips_analyzed: 0,
    ai_analyses: 0,
    reports_generated: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      const data = await getDashboardStats();
      setStats(data);
    }

    loadDashboard();
  }, []);

  return stats;
}