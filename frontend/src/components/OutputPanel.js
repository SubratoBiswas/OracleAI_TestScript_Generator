import React, { useState } from "react";

function AutomationStep({ line }) {
  // Parse a numbered step line like "1. Click the Navigator icon..."
  const match = line.match(/^(\d+)\.\s+(.+)$/);
  if (!match) return null;

  const stepNum = match[1];
  const action = match[2];

  // Determine action type for visual styling
  let actionType = "action";
  const lower = action.toLowerCase();
  if (lower.startsWith("login to:")) actionType = "login";
  else if (lower.startsWith("verify") || lower.startsWith("confirm")) actionType = "verify";
  else if (lower.startsWith("click") || lower.startsWith("press")) actionType = "click";
  else if (lower.startsWith("enter") || lower.includes("enter your") || lower.includes("enter the")) actionType = "input";
  else if (lower.startsWith("select")) actionType = "select";
  else if (lower.startsWith("wait")) actionType = "wait";
  else if (lower === "end of task.") actionType = "end";

  return (
    <div className={`auto-step auto-step-${actionType}`}>
      <div className="auto-step-num">{stepNum}</div>
      <div className="auto-step-action">{action}</div>
      <div className={`auto-step-badge badge-${actionType}`}>
        {actionType === "login" && "LOGIN"}
        {actionType === "click" && "CLICK"}
        {actionType === "input" && "INPUT"}
        {actionType === "select" && "SELECT"}
        {actionType === "verify" && "VERIFY"}
        {actionType === "wait" && "WAIT"}
        {actionType === "end" && "END"}
        {actionType === "action" && "ACTION"}
      </div>
    </div>
  );
}

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
      a.download = "oracle_fusion_automation_script.txt";
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
          <div className="panel-title">Automation Test Script</div>
        </div>
        <div className="output-content">
          <div className="loading-state">
            <div className="loading-spinner-lg"></div>
            <div className="loading-text">Generating automation script...</div>
            <div className="loading-subtext">
              Oracle AI Assist is building step-by-step UI actions for your test scenario
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
          <div className="panel-title">Automation Test Script</div>
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
          <div className="panel-title">Automation Test Script</div>
        </div>
        <div className="output-content empty">
          <div className="empty-icon">&#9881;</div>
          <div className="empty-title">No Automation Script Generated Yet</div>
          <div className="empty-description">
            Configure your Oracle Fusion environment, select a module and test
            type, describe your scenario, and click &quot;Generate Automation
            Script&quot; to create an executable test script.
          </div>
          <div className="empty-example">
            <div className="example-title">Example output format:</div>
            <div className="example-steps">
              <div className="example-step">1. Login to: URL: https://..., Username: USER</div>
              <div className="example-step">2. Click in the User ID field and enter your User ID.</div>
              <div className="example-step">3. Press the Sign In button.</div>
              <div className="example-step">4. Click the Navigator link.</div>
              <div className="example-step">5. Under Financials, click Invoices link.</div>
              <div className="example-step">...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Parse script into lines
  const scriptLines = result.script.split("\n");
  const commentLines = scriptLines.filter((l) => l.startsWith("#"));
  const stepLines = scriptLines.filter((l) => /^\d+\.\s+/.test(l));
  const totalSteps = stepLines.length;

  return (
    <section className="output-panel">
      <div className="output-header">
        <div>
          <div className="panel-title">Automation Test Script</div>
          <div className="script-meta">
            {totalSteps} steps
            {result.note && (
              <span className="meta-note"> &middot; {result.note}</span>
            )}
          </div>
        </div>
        <div className="output-actions">
          <button className={`action-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="action-btn" onClick={handleDownload}>
            Download .txt
          </button>
        </div>
      </div>
      <div className="output-content automation-output">
        {commentLines.length > 0 && (
          <div className="script-header-block">
            {commentLines.map((line, i) => (
              <div key={i} className="script-comment">{line}</div>
            ))}
          </div>
        )}
        <div className="auto-steps-list">
          {stepLines.map((line, i) => (
            <AutomationStep key={i} line={line} />
          ))}
        </div>
      </div>
    </section>
  );
}
