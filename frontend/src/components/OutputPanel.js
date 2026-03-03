import React, { useState } from "react";

function AutomationStep({ line }) {
  const match = line.match(/^(\d+)\.\s+(.+)$/);
  if (!match) return null;

  const stepNum = match[1];
  const action = match[2];

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
      <div className="auto-step-body">
        <div className="auto-step-action">{action}</div>
      </div>
      <div className={`auto-step-badge badge-${actionType}`}>
        {actionType.toUpperCase()}
      </div>
    </div>
  );
}

export default function OutputPanel({ result, isLoading, error, mode }) {
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
        <div className="output-toolbar">
          <div className="toolbar-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Automation Test Script
          </div>
        </div>
        <div className="output-content">
          <div className="loading-state">
            <div className="loading-spinner-lg" />
            <div className="loading-text">
              {mode === "live" ? "Oracle AI Assist is generating your script..." : "Generating demo script..."}
            </div>
            <div className="loading-subtext">
              Building step-by-step automation actions for your test scenario
            </div>
            <div className="loading-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="output-panel">
        <div className="output-toolbar">
          <div className="toolbar-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Automation Test Script
          </div>
        </div>
        <div className="output-content">
          <div className="error-box">
            <div className="error-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <strong>Generation Failed</strong>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="output-panel">
        <div className="output-toolbar">
          <div className="toolbar-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Automation Test Script
          </div>
        </div>
        <div className="output-content empty">
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="empty-title">No Script Generated Yet</div>
            <div className="empty-description">
              Configure your test parameters on the left panel and click
              &quot;Generate&quot; to create an executable automation test script.
            </div>
            <div className="empty-steps">
              <div className="empty-step">
                <span className="step-num">1</span>
                <span>Select a module and test type</span>
              </div>
              <div className="empty-step">
                <span className="step-num">2</span>
                <span>Describe your test scenario</span>
              </div>
              <div className="empty-step">
                <span className="step-num">3</span>
                <span>Click Generate to create the script</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const scriptLines = result.script.split("\n");
  const commentLines = scriptLines.filter((l) => l.startsWith("#"));
  const stepLines = scriptLines.filter((l) => /^\d+\.\s+/.test(l));
  const totalSteps = stepLines.length;

  return (
    <section className="output-panel">
      <div className="output-toolbar">
        <div className="toolbar-left">
          <div className="toolbar-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Automation Test Script
          </div>
          <div className="toolbar-meta">
            <span className="meta-chip">{totalSteps} steps</span>
            {result.model && (
              <span className="meta-chip model">{result.model === "demo-mode" ? "Demo" : "AI Generated"}</span>
            )}
            {result.note && <span className="meta-note">{result.note}</span>}
          </div>
        </div>
        <div className="toolbar-actions">
          <button className={`toolbar-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
          <button className="toolbar-btn" onClick={handleDownload}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
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
