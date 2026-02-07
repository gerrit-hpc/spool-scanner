import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Settings } from "@/components/Settings";

function App() {
  const [view, setView] = useState<"dashboard" | "settings">(() => {
    return localStorage.getItem("spoolman_url") ? "dashboard" : "settings";
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "dashboard" ? (
        <Dashboard onSettingsClick={() => setView("settings")} />
      ) : (
        <Settings onBack={() => setView("dashboard")} />
      )}
    </div>
  );
}

export default App;