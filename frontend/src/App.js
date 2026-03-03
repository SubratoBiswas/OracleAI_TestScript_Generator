import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";
import HistoryDrawer from "./components/HistoryDrawer";
import {
  getConnectionStatus,
  getModules,
  getTestTypes,
  generateTestScript,
} from "./services/api";

const INITIAL_FORM = {
  module: "",
  testType: "",
  description: "",
  additionalContext: "",
  envUrl: "",
  username: "",
  password: "",
};

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [modules, setModules] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mode, setMode] = useState("demo"); // "demo" or "live"

  useEffect(() => {
    async function init() {
      try {
        const [status, mods, types] = await Promise.all([
          getConnectionStatus(),
          getModules(),
          getTestTypes(),
        ]);
        setConnectionStatus(status);
        setModules(mods);
        setTestTypes(types);
        // If backend reports live connection, default to live mode
        if (status?.mode === "live" && status?.connected) {
          setMode("live");
        }
      } catch {
        setConnectionStatus({ mode: "demo", connected: false, message: "Backend not reachable" });
        setModules([
          "Financials - General Ledger",
          "Financials - Accounts Payable",
          "Financials - Accounts Receivable",
          "Procurement - Purchasing",
          "HCM - Core HR",
          "HCM - Payroll",
          "SCM - Inventory Management",
          "SCM - Order Management",
          "PPM - Project Management",
        ]);
        setTestTypes([
          "Functional Test",
          "Integration Test",
          "Regression Test",
          "End-to-End Test",
          "User Acceptance Test (UAT)",
        ]);
      }
    }
    init();
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateTestScript({ ...formData, mode });
      setResult(response);
      setHistory((prev) => [
        {
          module: formData.module,
          testType: formData.testType,
          description: formData.description,
          envUrl: formData.envUrl,
          username: formData.username,
          mode,
          result: response,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to generate test script.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, mode]);

  const handleHistorySelect = useCallback((item) => {
    setResult(item.result);
    setFormData({
      module: item.module,
      testType: item.testType,
      description: item.description,
      additionalContext: "",
      envUrl: item.envUrl || "",
      username: item.username || "",
      password: "",
    });
    if (item.mode) setMode(item.mode);
    setError(null);
  }, []);

  return (
    <>
      <Header
        connectionStatus={connectionStatus}
        onHistoryOpen={() => setHistoryOpen(true)}
        mode={mode}
        onModeChange={setMode}
      />
      <main className="app-main">
        <InputPanel
          modules={modules}
          testTypes={testTypes}
          formData={formData}
          onFormChange={setFormData}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          mode={mode}
        />
        <OutputPanel result={result} isLoading={isLoading} error={error} mode={mode} />
      </main>
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
      />
    </>
  );
}
