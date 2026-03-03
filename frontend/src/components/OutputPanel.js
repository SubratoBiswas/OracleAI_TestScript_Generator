import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function OutputPanel({ result, isLoading, error }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result?.script) {
      navigator.clipboard.writeText(result.script).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownload = () => {
    if (result?.script) {
      const blob = new Blob([result.script], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "oracle_fusion_test_script.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <section className="output-panel">
        <div className="output-header">
          <div className="panel-title">Generated Test Script</div>
        </div>
        <div className="output-content">
          <div className="loading-state">
            <div className="loading-spinner-lg"></div>
            <div className="loading-text">Generating your test script...</div>
            <div className="loading-subtext">
              Oracle AI Assist is crafting a detailed test script for your scenario
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="output-panel">
        <div className="output-header">
          <div className="panel-title">Generated Test Script</div>
        </div>
        <div className="output-content">
          <div className="error-box">
            <strong>Generation Failed</strong>
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="output-panel">
        <div className="output-header">
          <div className="panel-title">Generated Test Script</div>
        </div>
        <div className="output-content empty">
          <div className="empty-icon">&#128196;</div>
          <div className="empty-title">No Test Script Generated Yet</div>
          <div className="empty-description">
            Select an Oracle Fusion module, choose a test type, describe your
            test scenario, and click &quot;Generate Test Script&quot; to create an
            AI-powered test script.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="output-panel">
      <div className="output-header">
        <div>
          <div className="panel-title">Generated Test Script</div>
          {result.note && (
            <div style={{ fontSize: "12px", color: "var(--accent-yellow)", marginTop: "4px" }}>
              {result.note}
            </div>
          )}
        </div>
        <div className="output-actions">
          <button className={`action-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="action-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
      <div className="output-content">
        <ReactMarkdown>{result.script}</ReactMarkdown>
      </div>
    </section>
  );
}
