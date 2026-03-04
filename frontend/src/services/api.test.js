import axios from "axios";
import api, {
  checkHealth,
  getConnectionStatus,
  getModules,
  getTestTypes,
  generateTestScript,
} from "./api";

// Mock axios
jest.mock("axios", () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
  };
  return {
    create: jest.fn(() => mockInstance),
    __mockInstance: mockInstance,
  };
});

// =============================================================================
// API Service Test Scenarios
// =============================================================================

describe("API Service", () => {
  const mockApi = axios.__mockInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-FE-70
  test("checkHealth calls GET /health", async () => {
    mockApi.get.mockResolvedValue({ data: { status: "healthy" } });
    const result = await checkHealth();
    expect(mockApi.get).toHaveBeenCalledWith("/health");
    expect(result).toEqual({ status: "healthy" });
  });

  // TC-FE-71
  test("getConnectionStatus calls GET /connection-status", async () => {
    mockApi.get.mockResolvedValue({
      data: { mode: "demo", connected: false, message: "Demo" },
    });
    const result = await getConnectionStatus();
    expect(mockApi.get).toHaveBeenCalledWith("/connection-status");
    expect(result).toEqual({ mode: "demo", connected: false, message: "Demo" });
  });

  // TC-FE-72
  test("getModules calls GET /modules and extracts modules array", async () => {
    mockApi.get.mockResolvedValue({
      data: { modules: ["Financials - General Ledger", "HCM - Core HR"] },
    });
    const result = await getModules();
    expect(mockApi.get).toHaveBeenCalledWith("/modules");
    expect(result).toEqual(["Financials - General Ledger", "HCM - Core HR"]);
  });

  // TC-FE-73
  test("getTestTypes calls GET /test-types and extracts testTypes array", async () => {
    mockApi.get.mockResolvedValue({
      data: { testTypes: ["Functional Test", "Integration Test"] },
    });
    const result = await getTestTypes();
    expect(mockApi.get).toHaveBeenCalledWith("/test-types");
    expect(result).toEqual(["Functional Test", "Integration Test"]);
  });

  // TC-FE-74
  test("generateTestScript calls POST /generate with correct payload", async () => {
    const params = {
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire employee",
      additionalContext: "",
      envUrl: "https://fusion.example.com",
      username: "admin",
      password: "pass",
      mode: "demo",
    };
    mockApi.post.mockResolvedValue({
      data: { success: true, script: "1. Login", model: "demo-mode" },
    });
    const result = await generateTestScript(params);
    expect(mockApi.post).toHaveBeenCalledWith("/generate", params);
    expect(result).toEqual({ success: true, script: "1. Login", model: "demo-mode" });
  });

  // TC-FE-75
  test("generateTestScript propagates API errors", async () => {
    mockApi.post.mockRejectedValue(new Error("Network Error"));
    await expect(
      generateTestScript({
        module: "HCM - Core HR",
        testType: "Functional Test",
        description: "Test",
        mode: "demo",
      })
    ).rejects.toThrow("Network Error");
  });

  // TC-FE-76
  test("API module exports default api instance", () => {
    expect(api).toBeDefined();
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
  });

  // TC-FE-77
  test("api instance has expected HTTP methods", () => {
    expect(typeof api.get).toBe("function");
    expect(typeof api.post).toBe("function");
  });
});
