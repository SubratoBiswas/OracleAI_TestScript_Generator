import React from "react";

export default function InputPanel({
  modules,
  testTypes,
  formData,
  onFormChange,
  onGenerate,
  isLoading,
}) {
  const handleChange = (field) => (e) => {
    onFormChange({ ...formData, [field]: e.target.value });
  };

  const isValid =
    formData.module && formData.testType && formData.description.trim();

  return (
    <aside className="input-panel">
      <div>
        <div className="panel-title">Configure Automation Test Script</div>
        <div className="panel-description">
          Generate step-by-step automation test scripts that an AI testing tool
          can execute directly against Oracle Fusion Cloud. Each step is a
          precise, atomic UI action.
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Environment</div>

        <div className="form-group">
          <label className="form-label">Oracle Fusion URL</label>
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
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="FUSION_USER"
              value={formData.username}
              onChange={handleChange("username")}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange("password")}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Test Configuration</div>

        <div className="form-group">
          <label className="form-label">
            Oracle Fusion Module <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={formData.module}
            onChange={handleChange("module")}
          >
            <option value="">Select a module...</option>
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
            <option value="">Select test type...</option>
            {testTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
            <span className="spinner"></span>
            Generating Automation Script...
          </>
        ) : (
          <>
            <span className="btn-icon">&#9889;</span>
            Generate Automation Script
          </>
        )}
      </button>

      {formData.module && (
        <div className="note-box">
          Generating automation test script for <strong>{formData.module}</strong>.
          Output will be numbered step-by-step actions (click, enter, select,
          verify) that an AI testing tool can execute directly.
        </div>
      )}
    </aside>
  );
}
