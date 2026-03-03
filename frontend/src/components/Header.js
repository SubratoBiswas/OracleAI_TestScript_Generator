import React from "react";

export default function Header({ connectionStatus, onHistoryOpen, mode, onModeChange }) {
  const connMode = connectionStatus?.mode || "demo";
  const badgeClass =
    connMode === "live" && connectionStatus?.connected
      ? "connected"
      : connMode === "demo"
      ? "demo"
      : "error";

  const badgeLabel =
    connMode === "live" && connectionStatus?.connected
      ? "Oracle AI Connected"
      : connMode === "demo"
      ? "Demo Mode"
      : "Disconnected";

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-brand">
          <div className="header-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="header-text">
            <div className="header-title">Oracle AI Test Script Generator</div>
            <div className="header-subtitle">Oracle Fusion Cloud &middot; Automated Test Scripts</div>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="mode-toggle">
          <span className={`mode-label ${mode === "demo" ? "active" : ""}`}>Demo</span>
          <button
            className={`toggle-switch ${mode === "live" ? "on" : ""}`}
            onClick={() => onModeChange(mode === "demo" ? "live" : "demo")}
            title={mode === "demo" ? "Switch to Live AI generation" : "Switch to Demo mode"}
          >
            <span className="toggle-knob" />
          </button>
          <span className={`mode-label ${mode === "live" ? "active" : ""}`}>Live AI</span>
        </div>

        <div className="header-divider" />

        <button className="header-btn" onClick={onHistoryOpen} title="View generation history">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          History
        </button>

        <div className={`connection-badge ${badgeClass}`}>
          <span className="status-dot" />
          {badgeLabel}
        </div>
      </div>
    </header>
  );
}
