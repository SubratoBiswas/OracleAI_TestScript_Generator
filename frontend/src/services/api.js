import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function checkHealth() {
  const response = await api.get("/health");
  return response.data;
}

export async function getConnectionStatus() {
  const response = await api.get("/connection-status");
  return response.data;
}

export async function getModules() {
  const response = await api.get("/modules");
  return response.data.modules;
}

export async function getTestTypes() {
  const response = await api.get("/test-types");
  return response.data.testTypes;
}

export async function generateTestScript({
  module,
  testType,
  description,
  additionalContext,
  envUrl,
  username,
  password,
  mode,
}) {
  const response = await api.post("/generate", {
    module,
    testType,
    description,
    additionalContext,
    envUrl,
    username,
    password,
    mode,
  });
  return response.data;
}

export default api;
