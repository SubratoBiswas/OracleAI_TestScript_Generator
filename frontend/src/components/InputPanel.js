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
        <div className="panel-title">Configure Test Script</div>
        <div className="panel-description">
          Select the Oracle Fusion module, test type, and describe the scenario
          you want to test. Oracle AI Assist will generate a detailed test script.
        </div>
      </div>

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
          Test Description <span className="required">*</span>
        </label>
        <textarea
          className="form-textarea"
          placeholder="Describe the test scenario in detail... e.g., 'Create a purchase order for a standard item, submit for approval, and verify the PO status changes to Approved.'"
          value={formData.description}
          onChange={handleChange("description")}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Additional Context</label>
        <textarea
          className="form-textarea context"
          placeholder="Optional: Add business rules, specific data values, preconditions, or any special instructions..."
          value={formData.additionalContext}
          onChange={handleChange("additionalContext")}
        />
      </div>

      <button
        className="generate-btn"
        onClick={onGenerate}
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Generating with Oracle AI...
          </>
        ) : (
          <>
            <span className="btn-icon">&#9889;</span>
            Generate Test Script
          </>
        )}
      </button>

      {formData.module && (
        <div className="note-box">
          Generating test scripts for <strong>{formData.module}</strong> using
          Oracle AI Assist. Scripts include navigation paths, test steps, expected
          results, and validation checkpoints specific to Oracle Fusion Cloud.
        </div>
      )}
    </aside>
  );
}
