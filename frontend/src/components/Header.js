import React from "react";

export default function Header({ connectionStatus, onHistoryOpen }) {
  const mode = connectionStatus?.mode || "demo";
  const badgeClass =
    mode === "live" && connectionStatus?.connected
      ? "connected"
      : mode === "demo"
      ? "demo"
      : "error";

  const badgeLabel =
    mode === "live" && connectionStatus?.connected
      ? "Oracle AI Connected"
      : mode === "demo"
      ? "Demo Mode"
      : "Disconnected";

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">OA</div>
        <div>
          <div className="header-title">Oracle AI Test Script Generator</div>
          <div className="header-subtitle">Oracle Fusion Cloud - Automated Test Scripts</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="action-btn" onClick={onHistoryOpen}>
          History
        </button>
        <div className={`connection-badge ${badgeClass}`}>
          <span className="status-dot"></span>
          {badgeLabel}
        </div>
      </div>
    </header>
  );
}
