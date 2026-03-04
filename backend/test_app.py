"""Test scenarios for Flask API endpoints (app.py)."""

import json
import pytest


# =============================================================================
# 1. Health Check Endpoint Tests
# =============================================================================

class TestHealthCheck:
    """Test GET /api/health endpoint."""

    def test_health_returns_200(self, client):
        """TC-01: Health check should return HTTP 200."""
        response = client.get("/api/health")
        assert response.status_code == 200

    def test_health_returns_healthy_status(self, client):
        """TC-02: Health check response should contain 'healthy' status."""
        response = client.get("/api/health")
        data = response.get_json()
        assert data["status"] == "healthy"
        assert data["service"] == "OracleAI TestScript Generator"

    def test_health_rejects_post(self, client):
        """TC-03: Health endpoint should reject POST method."""
        response = client.post("/api/health")
        assert response.status_code == 405


# =============================================================================
# 2. Modules Endpoint Tests
# =============================================================================

class TestModulesEndpoint:
    """Test GET /api/modules endpoint."""

    def test_modules_returns_200(self, client):
        """TC-04: Modules endpoint should return HTTP 200."""
        response = client.get("/api/modules")
        assert response.status_code == 200

    def test_modules_returns_list(self, client):
        """TC-05: Modules response should contain a list of modules."""
        response = client.get("/api/modules")
        data = response.get_json()
        assert "modules" in data
        assert isinstance(data["modules"], list)

    def test_modules_count(self, client):
        """TC-06: Should return all 24 Oracle Fusion Cloud modules."""
        response = client.get("/api/modules")
        data = response.get_json()
        assert len(data["modules"]) == 24

    def test_modules_contains_financials(self, client):
        """TC-07: Modules should include Financials modules."""
        response = client.get("/api/modules")
        data = response.get_json()
        assert "Financials - General Ledger" in data["modules"]
        assert "Financials - Accounts Payable" in data["modules"]
        assert "Financials - Accounts Receivable" in data["modules"]

    def test_modules_contains_hcm(self, client):
        """TC-08: Modules should include HCM modules."""
        response = client.get("/api/modules")
        data = response.get_json()
        assert "HCM - Core HR" in data["modules"]
        assert "HCM - Payroll" in data["modules"]
        assert "HCM - Talent Management" in data["modules"]

    def test_modules_contains_scm(self, client):
        """TC-09: Modules should include SCM modules."""
        response = client.get("/api/modules")
        data = response.get_json()
        assert "SCM - Inventory Management" in data["modules"]
        assert "SCM - Order Management" in data["modules"]

    def test_modules_contains_procurement(self, client):
        """TC-10: Modules should include Procurement modules."""
        response = client.get("/api/modules")
        data = response.get_json()
        assert "Procurement - Purchasing" in data["modules"]
        assert "Procurement - Supplier Portal" in data["modules"]


# =============================================================================
# 3. Test Types Endpoint Tests
# =============================================================================

class TestTestTypesEndpoint:
    """Test GET /api/test-types endpoint."""

    def test_types_returns_200(self, client):
        """TC-11: Test types endpoint should return HTTP 200."""
        response = client.get("/api/test-types")
        assert response.status_code == 200

    def test_types_returns_list(self, client):
        """TC-12: Test types response should contain a list."""
        response = client.get("/api/test-types")
        data = response.get_json()
        assert "testTypes" in data
        assert isinstance(data["testTypes"], list)

    def test_types_count(self, client):
        """TC-13: Should return all 10 test types."""
        response = client.get("/api/test-types")
        data = response.get_json()
        assert len(data["testTypes"]) == 10

    def test_types_contains_expected_values(self, client):
        """TC-14: Should include all expected test type values."""
        response = client.get("/api/test-types")
        data = response.get_json()
        expected = [
            "Functional Test", "Integration Test", "Regression Test",
            "End-to-End Test", "User Acceptance Test (UAT)",
            "Data Migration Test", "Security/Role Test",
            "Performance Test", "Negative Test", "Boundary Value Test",
        ]
        for test_type in expected:
            assert test_type in data["testTypes"]


# =============================================================================
# 4. Connection Status Endpoint Tests
# =============================================================================

class TestConnectionStatus:
    """Test GET /api/connection-status endpoint."""

    def test_connection_status_returns_200(self, client):
        """TC-15: Connection status should return HTTP 200."""
        response = client.get("/api/connection-status")
        assert response.status_code == 200

    def test_connection_status_has_required_fields(self, client):
        """TC-16: Response should contain connected, mode, and message fields."""
        response = client.get("/api/connection-status")
        data = response.get_json()
        assert "connected" in data
        assert "mode" in data
        assert "message" in data

    def test_connection_status_demo_mode_without_credentials(self, client):
        """TC-17: Without Oracle credentials, mode should be 'demo'."""
        response = client.get("/api/connection-status")
        data = response.get_json()
        assert data["mode"] == "demo"
        assert data["connected"] is False


# =============================================================================
# 5. Generate Test Script Endpoint Tests
# =============================================================================

class TestGenerateEndpoint:
    """Test POST /api/generate endpoint."""

    def test_generate_rejects_empty_body(self, client):
        """TC-18: Should return 400 when request body is empty."""
        response = client.post("/api/generate",
                               data="",
                               content_type="application/json")
        assert response.status_code == 400

    def test_generate_requires_module(self, client):
        """TC-19: Should return 400 when module is missing."""
        response = client.post("/api/generate", json={
            "testType": "Functional Test",
            "description": "Test scenario",
            "mode": "demo",
        })
        assert response.status_code == 400
        data = response.get_json()
        assert "Module is required" in data["error"]

    def test_generate_requires_test_type(self, client):
        """TC-20: Should return 400 when test type is missing."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "description": "Test scenario",
            "mode": "demo",
        })
        assert response.status_code == 400
        data = response.get_json()
        assert "Test type is required" in data["error"]

    def test_generate_requires_description(self, client):
        """TC-21: Should return 400 when description is missing."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "mode": "demo",
        })
        assert response.status_code == 400
        data = response.get_json()
        assert "Test description is required" in data["error"]

    def test_generate_live_mode_requires_env_url(self, client):
        """TC-22: Live mode should require Oracle Fusion URL."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create journal",
            "mode": "live",
            "username": "user1",
            "password": "pass1",
        })
        assert response.status_code == 400
        data = response.get_json()
        assert "Oracle Fusion URL is required" in data["error"]

    def test_generate_live_mode_requires_username(self, client):
        """TC-23: Live mode should require username."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create journal",
            "mode": "live",
            "envUrl": "https://example.com",
            "password": "pass1",
        })
        assert response.status_code == 400
        data = response.get_json()
        assert "Username is required" in data["error"]

    def test_generate_live_mode_requires_password(self, client):
        """TC-24: Live mode should require password."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create journal",
            "mode": "live",
            "envUrl": "https://example.com",
            "username": "user1",
        })
        assert response.status_code == 400
        data = response.get_json()
        assert "Password is required" in data["error"]

    def test_generate_demo_mode_success(self, client):
        """TC-25: Demo mode should successfully generate a script."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "demo",
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True
        assert "script" in data
        assert data["model"] == "demo-mode"

    def test_generate_demo_mode_with_env_fields(self, client):
        """TC-26: Demo mode should work with optional environment fields."""
        response = client.post("/api/generate", json={
            "module": "HCM - Core HR",
            "testType": "End-to-End Test",
            "description": "Hire a new employee",
            "envUrl": "https://fusion.example.com",
            "username": "HR_USER",
            "password": "SecurePass123",
            "mode": "demo",
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True
        assert "HR_USER" in data["script"]
        assert "fusion.example.com" in data["script"]

    def test_generate_demo_script_contains_login_steps(self, client):
        """TC-27: Generated demo script should contain login steps."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "envUrl": "https://test.oracle.com",
            "username": "TESTUSER",
            "password": "password",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Login to:" in data["script"]
        assert "Sign In" in data["script"]
        assert "TESTUSER" in data["script"]

    def test_generate_demo_script_contains_navigation(self, client):
        """TC-28: Generated script should contain module navigation."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Navigator" in data["script"]
        assert "General Accounting" in data["script"]

    def test_generate_demo_script_ends_with_task_end(self, client):
        """TC-29: Generated script should end with 'End of Task.'."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "demo",
        })
        data = response.get_json()
        assert "End of Task." in data["script"]

    def test_generate_demo_script_contains_logout(self, client):
        """TC-30: Generated script should contain sign out steps."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Sign Out" in data["script"]

    def test_generate_rejects_whitespace_only_fields(self, client):
        """TC-31: Should reject fields that are whitespace only."""
        response = client.post("/api/generate", json={
            "module": "   ",
            "testType": "Functional Test",
            "description": "Test",
            "mode": "demo",
        })
        assert response.status_code == 400

    def test_generate_demo_mode_does_not_require_env_fields(self, client):
        """TC-32: Demo mode should not require environment fields."""
        response = client.post("/api/generate", json={
            "module": "Procurement - Purchasing",
            "testType": "Functional Test",
            "description": "Create a purchase order",
            "mode": "demo",
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True

    def test_generate_rejects_get_method(self, client):
        """TC-33: Generate endpoint should reject GET method."""
        response = client.get("/api/generate")
        assert response.status_code == 405

    def test_generate_with_additional_context(self, client):
        """TC-34: Should accept and process additional context."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "additionalContext": "Use US Primary Ledger with USD currency",
            "mode": "demo",
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True


# =============================================================================
# 6. Module-Specific Script Generation Tests
# =============================================================================

class TestModuleSpecificGeneration:
    """Test demo script generation for different Oracle Fusion modules."""

    def test_generate_gl_journal_steps(self, client):
        """TC-35: GL module should produce journal-related steps."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Journal" in data["script"]
        assert "Ledger" in data["script"]

    def test_generate_ap_invoice_steps(self, client):
        """TC-36: AP module should produce invoice-related steps."""
        response = client.post("/api/generate", json={
            "module": "Financials - Accounts Payable",
            "testType": "Functional Test",
            "description": "Create an invoice",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Invoice" in data["script"]
        assert "Supplier" in data["script"]

    def test_generate_hcm_hire_steps(self, client):
        """TC-37: HCM module should produce hire employee steps."""
        response = client.post("/api/generate", json={
            "module": "HCM - Core HR",
            "testType": "End-to-End Test",
            "description": "Hire an employee",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Hire" in data["script"]
        assert "Employee" in data["script"] or "worker" in data["script"].lower()

    def test_generate_procurement_po_steps(self, client):
        """TC-38: Procurement module should produce PO steps."""
        response = client.post("/api/generate", json={
            "module": "Procurement - Purchasing",
            "testType": "Functional Test",
            "description": "Create a purchase order",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Purchase" in data["script"] or "Order" in data["script"]

    def test_generate_scm_inventory_steps(self, client):
        """TC-39: SCM Inventory module should produce inventory steps."""
        response = client.post("/api/generate", json={
            "module": "SCM - Inventory Management",
            "testType": "Functional Test",
            "description": "Post physical inventory adjustments",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Inventory" in data["script"]

    def test_generate_order_management_steps(self, client):
        """TC-40: Order Management module should produce sales order steps."""
        response = client.post("/api/generate", json={
            "module": "SCM - Order Management",
            "testType": "Functional Test",
            "description": "Create a sales order",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Order" in data["script"]
        assert "Customer" in data["script"]

    def test_generate_payroll_steps(self, client):
        """TC-41: Payroll module should produce payroll run steps."""
        response = client.post("/api/generate", json={
            "module": "HCM - Payroll",
            "testType": "Functional Test",
            "description": "Run payroll for employees",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Payroll" in data["script"]

    def test_generate_ppm_project_steps(self, client):
        """TC-42: PPM module should produce project creation steps."""
        response = client.post("/api/generate", json={
            "module": "PPM - Project Management",
            "testType": "Functional Test",
            "description": "Create a project",
            "mode": "demo",
        })
        data = response.get_json()
        assert "Project" in data["script"]


# =============================================================================
# 7. Test Type-Specific Verification Tests
# =============================================================================

class TestTypeSpecificVerification:
    """Test that different test types produce appropriate verification steps."""

    def test_regression_adds_regression_verification(self, client):
        """TC-43: Regression test should include regression-specific verifications."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Regression Test",
            "description": "Verify journal creation still works",
            "mode": "demo",
        })
        data = response.get_json()
        assert "no error messages" in data["script"].lower() or "retain" in data["script"].lower()

    def test_integration_adds_cross_module_verification(self, client):
        """TC-44: Integration test should include cross-module verifications."""
        response = client.post("/api/generate", json={
            "module": "Financials - Accounts Payable",
            "testType": "Integration Test",
            "description": "Verify invoice integration with GL",
            "mode": "demo",
        })
        data = response.get_json()
        assert "cross-module" in data["script"].lower() or "related module" in data["script"].lower()

    def test_security_adds_role_verification(self, client):
        """TC-45: Security test should include role-based verifications."""
        response = client.post("/api/generate", json={
            "module": "HCM - Core HR",
            "testType": "Security/Role Test",
            "description": "Verify role-based access for HR",
            "mode": "demo",
        })
        data = response.get_json()
        assert "role" in data["script"].lower() or "access denied" in data["script"].lower()

    def test_functional_test_produces_valid_script(self, client):
        """TC-46: Functional test should produce numbered step script."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "demo",
        })
        data = response.get_json()
        lines = data["script"].split("\n")
        step_lines = [l for l in lines if l and l[0].isdigit()]
        assert len(step_lines) > 5


# =============================================================================
# 8. Script Format Validation Tests
# =============================================================================

class TestScriptFormat:
    """Test that generated scripts follow the expected format."""

    def test_script_has_header_comments(self, client):
        """TC-47: Script should start with header comments."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create journal",
            "mode": "demo",
        })
        data = response.get_json()
        assert data["script"].startswith("# Automation Test Script")

    def test_script_has_module_in_header(self, client):
        """TC-48: Script header should include the module name."""
        response = client.post("/api/generate", json={
            "module": "HCM - Core HR",
            "testType": "Functional Test",
            "description": "Hire employee",
            "mode": "demo",
        })
        data = response.get_json()
        assert "# Module: HCM - Core HR" in data["script"]

    def test_script_has_test_type_in_header(self, client):
        """TC-49: Script header should include the test type."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Regression Test",
            "description": "Verify journals",
            "mode": "demo",
        })
        data = response.get_json()
        assert "# Test Type: Regression Test" in data["script"]

    def test_script_steps_are_numbered_sequentially(self, client):
        """TC-50: Script steps should be numbered sequentially starting from 1."""
        response = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create journal",
            "mode": "demo",
        })
        data = response.get_json()
        lines = data["script"].split("\n")
        step_lines = [l for l in lines if l and l[0].isdigit()]
        for i, line in enumerate(step_lines, start=1):
            assert line.startswith(f"{i}. "), f"Step {i} numbering mismatch: {line}"
