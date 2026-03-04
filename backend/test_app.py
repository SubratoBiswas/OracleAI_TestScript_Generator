"""
Test scenarios for the OracleAI TestScript Generator Backend.

Covers:
  - API endpoint tests (health, connection, modules, test-types, generate)
  - Input validation and error handling
  - Demo mode script generation
  - Live mode validation rules
  - OracleAIClient unit tests
"""

import json
import pytest
from unittest.mock import patch, MagicMock

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def app():
    from app import app as flask_app
    flask_app.config["TESTING"] = True
    return flask_app


@pytest.fixture
def client(app):
    return app.test_client()


# ===========================================================================
# 1. Health Check Endpoint
# ===========================================================================

class TestHealthCheck:
    """GET /api/health"""

    def test_health_returns_200(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200

    def test_health_response_body(self, client):
        data = client.get("/api/health").get_json()
        assert data["status"] == "healthy"
        assert data["service"] == "OracleAI TestScript Generator"


# ===========================================================================
# 2. Connection Status Endpoint
# ===========================================================================

class TestConnectionStatus:
    """GET /api/connection-status"""

    def test_returns_200(self, client):
        resp = client.get("/api/connection-status")
        assert resp.status_code == 200

    def test_response_has_required_fields(self, client):
        data = client.get("/api/connection-status").get_json()
        assert "connected" in data
        assert "mode" in data
        assert "message" in data

    def test_demo_mode_when_no_credentials(self, client):
        """Without Oracle AI env vars, should report demo mode."""
        data = client.get("/api/connection-status").get_json()
        assert data["mode"] == "demo"
        assert data["connected"] is False


# ===========================================================================
# 3. Modules Endpoint
# ===========================================================================

class TestModules:
    """GET /api/modules"""

    def test_returns_200(self, client):
        resp = client.get("/api/modules")
        assert resp.status_code == 200

    def test_returns_module_list(self, client):
        data = client.get("/api/modules").get_json()
        assert "modules" in data
        assert isinstance(data["modules"], list)
        assert len(data["modules"]) > 0

    def test_contains_key_modules(self, client):
        modules = client.get("/api/modules").get_json()["modules"]
        expected = [
            "Financials - General Ledger",
            "HCM - Core HR",
            "Procurement - Purchasing",
            "SCM - Order Management",
        ]
        for mod in expected:
            assert mod in modules, f"Expected module '{mod}' not found"

    def test_module_count(self, client):
        modules = client.get("/api/modules").get_json()["modules"]
        assert len(modules) == 24


# ===========================================================================
# 4. Test Types Endpoint
# ===========================================================================

class TestTestTypes:
    """GET /api/test-types"""

    def test_returns_200(self, client):
        resp = client.get("/api/test-types")
        assert resp.status_code == 200

    def test_returns_test_type_list(self, client):
        data = client.get("/api/test-types").get_json()
        assert "testTypes" in data
        assert isinstance(data["testTypes"], list)

    def test_contains_key_test_types(self, client):
        types = client.get("/api/test-types").get_json()["testTypes"]
        expected = [
            "Functional Test",
            "Integration Test",
            "Regression Test",
            "Negative Test",
        ]
        for t in expected:
            assert t in types

    def test_test_type_count(self, client):
        types = client.get("/api/test-types").get_json()["testTypes"]
        assert len(types) == 10


# ===========================================================================
# 5. Generate Endpoint – Validation
# ===========================================================================

class TestGenerateValidation:
    """POST /api/generate – input validation scenarios."""

    def test_empty_body_returns_400(self, client):
        resp = client.post("/api/generate", data="", content_type="application/json")
        assert resp.status_code == 400

    def test_missing_module_returns_400(self, client):
        resp = client.post("/api/generate", json={
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "demo",
        })
        assert resp.status_code == 400
        assert "Module is required" in resp.get_json()["error"]

    def test_missing_test_type_returns_400(self, client):
        resp = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "description": "Create a journal entry",
            "mode": "demo",
        })
        assert resp.status_code == 400
        assert "Test type is required" in resp.get_json()["error"]

    def test_missing_description_returns_400(self, client):
        resp = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "mode": "demo",
        })
        assert resp.status_code == 400
        assert "Test description is required" in resp.get_json()["error"]

    def test_whitespace_only_module_returns_400(self, client):
        resp = client.post("/api/generate", json={
            "module": "   ",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "demo",
        })
        assert resp.status_code == 400

    def test_whitespace_only_description_returns_400(self, client):
        resp = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "   ",
            "mode": "demo",
        })
        assert resp.status_code == 400


# ===========================================================================
# 6. Generate Endpoint – Live Mode Validation
# ===========================================================================

class TestGenerateLiveModeValidation:
    """POST /api/generate – live mode requires environment credentials."""

    def test_live_mode_missing_url_returns_400(self, client):
        resp = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "live",
            "username": "admin",
            "password": "pass",
        })
        assert resp.status_code == 400
        assert "Oracle Fusion URL is required" in resp.get_json()["error"]

    def test_live_mode_missing_username_returns_400(self, client):
        resp = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "live",
            "envUrl": "https://example.com",
            "password": "pass",
        })
        assert resp.status_code == 400
        assert "Username is required" in resp.get_json()["error"]

    def test_live_mode_missing_password_returns_400(self, client):
        resp = client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "live",
            "envUrl": "https://example.com",
            "username": "admin",
        })
        assert resp.status_code == 400
        assert "Password is required" in resp.get_json()["error"]


# ===========================================================================
# 7. Generate Endpoint – Demo Mode Success
# ===========================================================================

class TestGenerateDemoMode:
    """POST /api/generate – demo mode script generation."""

    def _generate(self, client, **overrides):
        payload = {
            "module": "Financials - General Ledger",
            "testType": "Functional Test",
            "description": "Create a journal entry",
            "mode": "demo",
            "additionalContext": "",
            "envUrl": "",
            "username": "",
            "password": "",
        }
        payload.update(overrides)
        return client.post("/api/generate", json=payload)

    def test_demo_returns_200(self, client):
        resp = self._generate(client)
        assert resp.status_code == 200

    def test_demo_response_has_script(self, client):
        data = self._generate(client).get_json()
        assert data["success"] is True
        assert "script" in data
        assert len(data["script"]) > 0

    def test_demo_response_model_is_demo(self, client):
        data = self._generate(client).get_json()
        assert data["model"] == "demo-mode"

    def test_demo_script_contains_login_steps(self, client):
        script = self._generate(client).get_json()["script"]
        assert "Login to:" in script
        assert "Sign In" in script

    def test_demo_script_contains_navigation(self, client):
        script = self._generate(client).get_json()["script"]
        assert "Navigator" in script
        assert "General Accounting" in script  # nav_link for GL

    def test_demo_script_contains_end_of_task(self, client):
        script = self._generate(client).get_json()["script"]
        assert "End of Task." in script

    def test_demo_script_contains_logout(self, client):
        script = self._generate(client).get_json()["script"]
        assert "Sign Out" in script

    def test_demo_script_contains_module_header(self, client):
        script = self._generate(client).get_json()["script"]
        assert "# Module: Financials - General Ledger" in script

    def test_demo_script_numbered_steps(self, client):
        script = self._generate(client).get_json()["script"]
        assert "1. Login to:" in script

    def test_demo_with_env_credentials(self, client):
        """Environment credentials should be embedded in the script."""
        data = self._generate(
            client,
            envUrl="https://fusion.example.com",
            username="testuser",
            password="testpass",
        ).get_json()
        assert "https://fusion.example.com" in data["script"]
        assert "testuser" in data["script"]

    def test_demo_ap_module_create_invoice(self, client):
        data = self._generate(
            client,
            module="Financials - Accounts Payable",
            description="Create an invoice",
        ).get_json()
        assert data["success"] is True
        assert "Invoice" in data["script"]

    def test_demo_hcm_module_hire_employee(self, client):
        data = self._generate(
            client,
            module="HCM - Core HR",
            description="Hire a new employee",
        ).get_json()
        assert data["success"] is True
        assert "Hire" in data["script"] or "Employee" in data["script"]

    def test_demo_procurement_module(self, client):
        data = self._generate(
            client,
            module="Procurement - Purchasing",
            description="Create a purchase order",
        ).get_json()
        assert data["success"] is True
        assert "Purchase" in data["script"]

    def test_demo_scm_inventory(self, client):
        data = self._generate(
            client,
            module="SCM - Inventory Management",
            description="Transfer inventory between organizations",
        ).get_json()
        assert data["success"] is True
        assert "Inventory" in data["script"]

    def test_demo_order_management(self, client):
        data = self._generate(
            client,
            module="SCM - Order Management",
            description="Create a sales order",
        ).get_json()
        assert data["success"] is True
        assert "Order" in data["script"]


# ===========================================================================
# 8. Generate Endpoint – Test-Type-Specific Steps
# ===========================================================================

class TestGenerateTestTypeSpecificSteps:
    """Verify test-type-specific verification steps in demo mode scripts."""

    def _generate(self, client, test_type):
        return client.post("/api/generate", json={
            "module": "Financials - General Ledger",
            "testType": test_type,
            "description": "Create a journal entry",
            "mode": "demo",
        }).get_json()

    def test_regression_adds_regression_checks(self, client):
        data = self._generate(client, "Regression Test")
        assert "no error messages" in data["script"].lower()
        assert "retain" in data["script"].lower()

    def test_integration_adds_cross_module_checks(self, client):
        data = self._generate(client, "Integration Test")
        assert "cross-module" in data["script"].lower() or "related module" in data["script"].lower()

    def test_security_adds_role_checks(self, client):
        data = self._generate(client, "Security/Role Test")
        script = data["script"].lower()
        assert "access denied" in script or "role" in script

    def test_functional_no_extra_regression_steps(self, client):
        data = self._generate(client, "Functional Test")
        assert "retain their expected values" not in data["script"]


# ===========================================================================
# 9. OracleAIClient Unit Tests
# ===========================================================================

class TestOracleAIClient:
    """Unit tests for OracleAIClient internals."""

    def test_validate_connection_no_credentials(self):
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        # Default config has no credentials
        result = client.validate_connection()
        assert result["connected"] is False
        assert result["mode"] == "demo"

    def test_build_prompt_contains_module(self):
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Functional Test",
            "Hire an employee", "", "https://env.com", "user", "pass"
        )
        assert "HCM - Core HR" in prompt
        assert "Functional Test" in prompt
        assert "Hire an employee" in prompt

    def test_build_prompt_includes_additional_context(self):
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Functional Test",
            "Hire an employee", "Use US Legal Entity",
            "https://env.com", "user", "pass"
        )
        assert "Use US Legal Entity" in prompt

    def test_build_prompt_omits_context_when_empty(self):
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Functional Test",
            "Hire an employee", "",
            "https://env.com", "user", "pass"
        )
        assert "Additional Context" not in prompt

    def test_demo_response_for_unknown_module(self):
        """Modules not in FUSION_MODULE_NAVIGATION should still generate a script."""
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        result = client._generate_demo_response(
            "ERP - Tax", "Functional Test",
            "Configure tax rules", "", "", ""
        )
        assert result["success"] is True
        assert "End of Task." in result["script"]

    def test_demo_response_defaults_placeholders(self):
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Create a journal", "", "", ""
        )
        assert "<User provided>" in result["script"]

    @patch("oracle_ai_client.requests.post")
    def test_generate_handles_connection_error(self, mock_post):
        import requests as req
        mock_post.side_effect = req.exceptions.ConnectionError("unreachable")
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        client.endpoint = "https://fake.oracle.com"
        client.api_key = "fake-key"
        result = client.generate_test_script(
            "HCM - Core HR", "Functional Test",
            "Hire an employee",
        )
        assert result["success"] is False
        assert "Cannot connect" in result["error"]

    @patch("oracle_ai_client.requests.post")
    def test_generate_handles_timeout(self, mock_post):
        import requests as req
        mock_post.side_effect = req.exceptions.Timeout("timed out")
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        client.endpoint = "https://fake.oracle.com"
        client.api_key = "fake-key"
        result = client.generate_test_script(
            "HCM - Core HR", "Functional Test",
            "Hire an employee",
        )
        assert result["success"] is False
        assert "timed out" in result["error"]

    @patch("oracle_ai_client.requests.post")
    def test_generate_handles_http_error(self, mock_post):
        mock_resp = MagicMock()
        mock_resp.status_code = 401
        mock_resp.text = "Unauthorized"
        mock_resp.raise_for_status.side_effect = __import__("requests").exceptions.HTTPError(response=mock_resp)
        mock_post.return_value = mock_resp
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        client.endpoint = "https://fake.oracle.com"
        client.api_key = "fake-key"
        result = client.generate_test_script(
            "HCM - Core HR", "Functional Test",
            "Hire an employee",
        )
        assert result["success"] is False
        assert "401" in result["error"]

    @patch("oracle_ai_client.requests.post")
    def test_generate_live_success(self, mock_post):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.raise_for_status = MagicMock()
        mock_resp.json.return_value = {
            "chatResponse": {
                "choices": [{
                    "message": {
                        "content": [{"type": "TEXT", "text": "1. Login to URL...\n2. End of Task."}]
                    }
                }]
            }
        }
        mock_post.return_value = mock_resp
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        client.endpoint = "https://fake.oracle.com"
        client.api_key = "fake-key"
        result = client.generate_test_script(
            "HCM - Core HR", "Functional Test",
            "Hire an employee",
        )
        assert result["success"] is True
        assert "End of Task." in result["script"]

    @patch("oracle_ai_client.requests.post")
    def test_generate_live_empty_choices(self, mock_post):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.raise_for_status = MagicMock()
        mock_resp.json.return_value = {"chatResponse": {"choices": []}}
        mock_post.return_value = mock_resp
        from oracle_ai_client import OracleAIClient
        client = OracleAIClient()
        client.endpoint = "https://fake.oracle.com"
        client.api_key = "fake-key"
        result = client.generate_test_script(
            "HCM - Core HR", "Functional Test",
            "Hire an employee",
        )
        assert result["success"] is False


# ===========================================================================
# 10. Config Tests
# ===========================================================================

class TestConfig:
    """Configuration loading tests."""

    def test_config_has_default_secret(self):
        from config import Config
        assert Config.SECRET_KEY is not None

    def test_config_oracle_fields_exist(self):
        from config import Config
        assert hasattr(Config, "ORACLE_AI_ENDPOINT")
        assert hasattr(Config, "ORACLE_AI_API_KEY")
        assert hasattr(Config, "ORACLE_AI_COMPARTMENT_ID")
        assert hasattr(Config, "ORACLE_AI_MODEL_ID")


# ===========================================================================
# 11. CORS & Method Tests
# ===========================================================================

class TestCORSAndMethods:
    """Ensure correct HTTP methods are supported."""

    def test_generate_get_not_allowed(self, client):
        resp = client.get("/api/generate")
        assert resp.status_code == 405

    def test_modules_post_not_allowed(self, client):
        resp = client.post("/api/modules")
        assert resp.status_code == 405

    def test_health_post_not_allowed(self, client):
        resp = client.post("/api/health")
        assert resp.status_code == 405
