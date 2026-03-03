import React from "react";

export default function InputPanel({
  modules,
  testTypes,
  formData,
  onFormChange,
  onGenerate,
  isLoading,
  mode,
}) {
  const handleChange = (field) => (e) => {
    onFormChange({ ...formData, [field]: e.target.value });
  };

  const isValid =
    formData.module &&
    formData.testType &&
    formData.description.trim() &&
    (mode === "demo" || (formData.envUrl.trim() && formData.username.trim() && formData.password.trim()));

  return (
    <aside className="input-panel">
      <div className="panel-header-section">
        <div className="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Configure Test Script
        </div>
        <div className="panel-description">
          {mode === "live"
            ? "Generate AI-powered automation test scripts using Oracle AI Assist."
            : "Generate sample automation scripts using built-in templates."}
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <span className="form-section-title">Environment</span>
          {mode === "demo" && <span className="section-badge demo-badge">Optional in Demo</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Oracle Fusion URL {mode === "live" && <span className="required">*</span>}
          </label>
          <input
            className="form-input"
            type="url"
            placeholder="https://fa-erzp-dev22-saasfademo1.ds-fa.oraclepdemos.com/"
            value={formData.envUrl}
            onChange={handleChange("envUrl")}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Username {mode === "live" && <span className="required">*</span>}
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="FUSION_USER"
              value={formData.username}
              onChange={handleChange("username")}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Password {mode === "live" && <span className="required">*</span>}
            </label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange("password")}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="form-section-title">Test Configuration</span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Module <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={formData.module}
              onChange={handleChange("module")}
            >
              <option value="">Select module...</option>
              {modules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Test Type <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={formData.testType}
              onChange={handleChange("testType")}
            >
              <option value="">Select type...</option>
              {testTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Test Scenario <span className="required">*</span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="Describe the task to automate... e.g., 'Post Physical Inventory Adjustments for a specific inventory organization'"
            value={formData.description}
            onChange={handleChange("description")}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Additional Context</label>
          <textarea
            className="form-textarea context"
            placeholder="Optional: Specific data values, org names, item numbers, or special conditions..."
            value={formData.additionalContext}
            onChange={handleChange("additionalContext")}
          />
        </div>
      </div>

      <button
        className="generate-btn"
        onClick={onGenerate}
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Generating...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            {mode === "live" ? "Generate with AI" : "Generate Demo Script"}
          </>
        )}
      </button>

      {formData.module && (
        <div className="note-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            Target: <strong>{formData.module}</strong>
            {mode === "demo" && " — Using built-in template"}
            {mode === "live" && " — Using Oracle AI Assist"}
          </span>
        </div>
      )}
    </aside>
  );
}
