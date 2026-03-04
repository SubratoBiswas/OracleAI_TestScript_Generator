"""Test scenarios for OracleAIClient (oracle_ai_client.py)."""

import pytest
from unittest.mock import patch, MagicMock
from oracle_ai_client import OracleAIClient, FUSION_MODULE_NAVIGATION


# =============================================================================
# 1. OracleAIClient Initialization Tests
# =============================================================================

class TestClientInitialization:
    """Test OracleAIClient constructor and configuration."""

    def test_client_initializes_with_defaults(self):
        """TC-51: Client should initialize with empty defaults when no env vars set."""
        with patch.dict("os.environ", {}, clear=True):
            client = OracleAIClient()
            assert client.endpoint == ""
            assert client.api_key == ""

    def test_client_reads_endpoint_from_config(self):
        """TC-52: Client should read endpoint from Config."""
        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.test.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "key123"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = "comp-id"
            MockConfig.ORACLE_AI_MODEL_ID = "model-id"
            client = OracleAIClient()
            assert client.endpoint == "https://ai.test.oracle.com"
            assert client.api_key == "key123"


# =============================================================================
# 2. Headers Generation Tests
# =============================================================================

class TestHeaders:
    """Test _get_headers method."""

    def test_headers_include_content_type(self):
        """TC-53: Headers should include Content-Type: application/json."""
        client = OracleAIClient()
        headers = client._get_headers()
        assert headers["Content-Type"] == "application/json"

    def test_headers_include_bearer_token(self):
        """TC-54: Headers should include Bearer authorization token."""
        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://test.com"
            MockConfig.ORACLE_AI_API_KEY = "my-secret-key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = ""
            MockConfig.ORACLE_AI_MODEL_ID = ""
            client = OracleAIClient()
            headers = client._get_headers()
            assert headers["Authorization"] == "Bearer my-secret-key"


# =============================================================================
# 3. Prompt Building Tests
# =============================================================================

class TestBuildPrompt:
    """Test _build_prompt method."""

    def test_prompt_contains_module(self):
        """TC-55: Prompt should contain the module name."""
        client = OracleAIClient()
        prompt = client._build_prompt(
            "Financials - General Ledger", "Functional Test",
            "Create journal", "", "https://env.com", "user", "pass"
        )
        assert "Financials - General Ledger" in prompt

    def test_prompt_contains_test_type(self):
        """TC-56: Prompt should contain the test type."""
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Integration Test",
            "Hire employee", "", "https://env.com", "user", "pass"
        )
        assert "Integration Test" in prompt

    def test_prompt_contains_description(self):
        """TC-57: Prompt should contain the test description."""
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Functional Test",
            "Hire a new full-time employee", "", "", "", ""
        )
        assert "Hire a new full-time employee" in prompt

    def test_prompt_contains_credentials(self):
        """TC-58: Prompt should contain environment URL and credentials."""
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Functional Test",
            "Test", "", "https://fusion.example.com", "admin", "secret"
        )
        assert "https://fusion.example.com" in prompt
        assert "admin" in prompt

    def test_prompt_includes_additional_context(self):
        """TC-59: Prompt should include additional context when provided."""
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Functional Test", "Test",
            "Use US Business Unit with specific job codes", "", "", ""
        )
        assert "US Business Unit" in prompt

    def test_prompt_without_additional_context(self):
        """TC-60: Prompt should work without additional context."""
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Functional Test", "Test", "", "", "", ""
        )
        assert "Additional Context" not in prompt

    def test_prompt_contains_automation_instructions(self):
        """TC-61: Prompt should contain automation format instructions."""
        client = OracleAIClient()
        prompt = client._build_prompt(
            "HCM - Core HR", "Functional Test", "Test", "", "", "", ""
        )
        assert "NUMBERED LIST" in prompt
        assert "atomic UI actions" in prompt
        assert "End of Task." in prompt


# =============================================================================
# 4. Demo Response Generation Tests
# =============================================================================

class TestDemoResponse:
    """Test _generate_demo_response method."""

    def test_demo_returns_success(self):
        """TC-62: Demo response should return success=True."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Create journal", "", "", ""
        )
        assert result["success"] is True

    def test_demo_returns_demo_model(self):
        """TC-63: Demo response model should be 'demo-mode'."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Create journal", "", "", ""
        )
        assert result["model"] == "demo-mode"

    def test_demo_returns_note(self):
        """TC-64: Demo response should include a note about demo mode."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Create journal", "", "", ""
        )
        assert "Demo mode active" in result["note"]

    def test_demo_uses_placeholder_for_empty_credentials(self):
        """TC-65: Demo should use placeholder text for empty credentials."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Create journal", "", "", ""
        )
        assert "<User provided>" in result["script"]

    def test_demo_uses_provided_credentials(self):
        """TC-66: Demo should use actual credentials when provided."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Create journal", "https://fusion.oracle.com", "admin", "pass123"
        )
        assert "admin" in result["script"]
        assert "https://fusion.oracle.com" in result["script"]

    def test_demo_gl_matches_correct_navigation(self):
        """TC-67: GL module should navigate to General Accounting."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Create journal", "", "", ""
        )
        assert "General Accounting" in result["script"]
        assert "Financials" in result["script"]

    def test_demo_ap_matches_correct_navigation(self):
        """TC-68: AP module should navigate to Invoices."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - Accounts Payable", "Functional Test",
            "Create invoice", "", "", ""
        )
        assert "Invoices" in result["script"]

    def test_demo_hcm_matches_correct_navigation(self):
        """TC-69: HCM module should navigate to Person Management."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "HCM - Core HR", "Functional Test",
            "Hire employee", "", "", ""
        )
        assert "Person Management" in result["script"]

    def test_demo_keyword_matching_finds_correct_task(self):
        """TC-70: Should match task based on description keywords."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Close the accounting period", "", "", ""
        )
        assert "Period" in result["script"]

    def test_demo_falls_back_to_first_task(self):
        """TC-71: Should fall back to first task when no keyword match."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Functional Test",
            "Perform an unrelated xyz action", "", "", ""
        )
        # Should still generate a valid script using the first task
        assert result["success"] is True
        assert "1." in result["script"]

    def test_demo_unknown_module_still_generates_script(self):
        """TC-72: Unknown module should still generate a basic script."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Unknown - Module", "Functional Test",
            "Test something", "", "", ""
        )
        assert result["success"] is True
        assert "Login to:" in result["script"]
        assert "End of Task." in result["script"]

    def test_demo_regression_test_adds_verification(self):
        """TC-73: Regression test should add specific verification steps."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "Financials - General Ledger", "Regression Test",
            "Verify journals", "", "", ""
        )
        assert "no error messages" in result["script"].lower()

    def test_demo_security_test_adds_role_check(self):
        """TC-74: Security test should add role-based access steps."""
        client = OracleAIClient()
        result = client._generate_demo_response(
            "HCM - Core HR", "Security/Role Test",
            "Check access control", "", "", ""
        )
        assert "access denied" in result["script"].lower() or "role" in result["script"].lower()


# =============================================================================
# 5. Live AI Generation Tests (Mocked)
# =============================================================================

class TestLiveGeneration:
    """Test generate_test_script with mocked Oracle AI API calls."""

    def test_force_demo_bypasses_api(self):
        """TC-75: force_demo=True should use demo mode even with credentials."""
        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "real-key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = "comp"
            MockConfig.ORACLE_AI_MODEL_ID = "model"
            client = OracleAIClient()
            result = client.generate_test_script(
                "Financials - General Ledger", "Functional Test",
                "Create journal", force_demo=True
            )
            assert result["success"] is True
            assert result["model"] == "demo-mode"

    def test_no_endpoint_falls_back_to_demo(self):
        """TC-76: Missing endpoint should fall back to demo mode."""
        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = ""
            MockConfig.ORACLE_AI_API_KEY = "key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = ""
            MockConfig.ORACLE_AI_MODEL_ID = ""
            client = OracleAIClient()
            result = client.generate_test_script(
                "HCM - Core HR", "Functional Test", "Hire employee"
            )
            assert result["success"] is True
            assert result["model"] == "demo-mode"

    def test_no_api_key_falls_back_to_demo(self):
        """TC-77: Missing API key should fall back to demo mode."""
        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = ""
            MockConfig.ORACLE_AI_COMPARTMENT_ID = ""
            MockConfig.ORACLE_AI_MODEL_ID = ""
            client = OracleAIClient()
            result = client.generate_test_script(
                "HCM - Core HR", "Functional Test", "Hire employee"
            )
            assert result["success"] is True
            assert result["model"] == "demo-mode"

    @patch("oracle_ai_client.requests.post")
    def test_successful_api_call(self, mock_post):
        """TC-78: Successful API call should return AI-generated script."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "chatResponse": {
                "choices": [{
                    "message": {
                        "content": [{"type": "TEXT", "text": "1. Login to: URL\n2. End of Task."}]
                    }
                }]
            }
        }
        mock_response.raise_for_status = MagicMock()
        mock_post.return_value = mock_response

        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "real-key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = "comp"
            MockConfig.ORACLE_AI_MODEL_ID = "test-model"
            client = OracleAIClient()
            result = client.generate_test_script(
                "HCM - Core HR", "Functional Test", "Hire employee"
            )
            assert result["success"] is True
            assert "Login to:" in result["script"]
            assert result["model"] == "test-model"

    @patch("oracle_ai_client.requests.post")
    def test_connection_error_handling(self, mock_post):
        """TC-79: Connection error should return descriptive error message."""
        import requests as req
        mock_post.side_effect = req.exceptions.ConnectionError("Connection refused")

        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = "comp"
            MockConfig.ORACLE_AI_MODEL_ID = "model"
            client = OracleAIClient()
            result = client.generate_test_script(
                "HCM - Core HR", "Functional Test", "Hire employee"
            )
            assert result["success"] is False
            assert "Cannot connect" in result["error"]

    @patch("oracle_ai_client.requests.post")
    def test_timeout_error_handling(self, mock_post):
        """TC-80: Timeout error should return timeout message."""
        import requests as req
        mock_post.side_effect = req.exceptions.Timeout("Request timed out")

        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = "comp"
            MockConfig.ORACLE_AI_MODEL_ID = "model"
            client = OracleAIClient()
            result = client.generate_test_script(
                "HCM - Core HR", "Functional Test", "Hire employee"
            )
            assert result["success"] is False
            assert "timed out" in result["error"]

    @patch("oracle_ai_client.requests.post")
    def test_http_error_handling(self, mock_post):
        """TC-81: HTTP error should return status code and message."""
        import requests as req
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_response.text = "Unauthorized"
        mock_post.side_effect = req.exceptions.HTTPError(response=mock_response)

        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "bad-key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = "comp"
            MockConfig.ORACLE_AI_MODEL_ID = "model"
            client = OracleAIClient()
            result = client.generate_test_script(
                "HCM - Core HR", "Functional Test", "Hire employee"
            )
            assert result["success"] is False
            assert "401" in result["error"]

    @patch("oracle_ai_client.requests.post")
    def test_empty_response_handling(self, mock_post):
        """TC-82: Empty AI response should return error."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"chatResponse": {"choices": []}}
        mock_response.raise_for_status = MagicMock()
        mock_post.return_value = mock_response

        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = "comp"
            MockConfig.ORACLE_AI_MODEL_ID = "model"
            client = OracleAIClient()
            result = client.generate_test_script(
                "HCM - Core HR", "Functional Test", "Hire employee"
            )
            assert result["success"] is False
            assert "No response content" in result["error"]


# =============================================================================
# 6. Connection Validation Tests
# =============================================================================

class TestValidateConnection:
    """Test validate_connection method."""

    def test_no_credentials_returns_demo(self):
        """TC-83: No credentials should return demo mode."""
        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = ""
            MockConfig.ORACLE_AI_API_KEY = ""
            MockConfig.ORACLE_AI_COMPARTMENT_ID = ""
            MockConfig.ORACLE_AI_MODEL_ID = ""
            client = OracleAIClient()
            status = client.validate_connection()
            assert status["mode"] == "demo"
            assert status["connected"] is False

    @patch("oracle_ai_client.requests.get")
    def test_successful_connection(self, mock_get):
        """TC-84: Successful connection should return live mode."""
        mock_get.return_value = MagicMock(status_code=200)

        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = ""
            MockConfig.ORACLE_AI_MODEL_ID = ""
            client = OracleAIClient()
            status = client.validate_connection()
            assert status["mode"] == "live"
            assert status["connected"] is True

    @patch("oracle_ai_client.requests.get")
    def test_failed_connection(self, mock_get):
        """TC-85: Connection exception should return error mode."""
        mock_get.side_effect = Exception("Network unreachable")

        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = ""
            MockConfig.ORACLE_AI_MODEL_ID = ""
            client = OracleAIClient()
            status = client.validate_connection()
            assert status["mode"] == "error"
            assert status["connected"] is False

    @patch("oracle_ai_client.requests.get")
    def test_non_200_response(self, mock_get):
        """TC-86: Non-200 response should report connection issue."""
        mock_get.return_value = MagicMock(status_code=503)

        with patch("oracle_ai_client.Config") as MockConfig:
            MockConfig.ORACLE_AI_ENDPOINT = "https://ai.oracle.com"
            MockConfig.ORACLE_AI_API_KEY = "key"
            MockConfig.ORACLE_AI_COMPARTMENT_ID = ""
            MockConfig.ORACLE_AI_MODEL_ID = ""
            client = OracleAIClient()
            status = client.validate_connection()
            assert status["connected"] is False
            assert "503" in status["message"]


# =============================================================================
# 7. FUSION_MODULE_NAVIGATION Data Tests
# =============================================================================

class TestModuleNavigationData:
    """Test the FUSION_MODULE_NAVIGATION data structure."""

    def test_gl_module_exists(self):
        """TC-87: General Ledger module should be in navigation data."""
        assert "Financials - General Ledger" in FUSION_MODULE_NAVIGATION

    def test_ap_module_exists(self):
        """TC-88: Accounts Payable module should be in navigation data."""
        assert "Financials - Accounts Payable" in FUSION_MODULE_NAVIGATION

    def test_hcm_module_exists(self):
        """TC-89: Core HR module should be in navigation data."""
        assert "HCM - Core HR" in FUSION_MODULE_NAVIGATION

    def test_modules_have_nav_group(self):
        """TC-90: All modules should have a nav_group field."""
        for module_name, module_data in FUSION_MODULE_NAVIGATION.items():
            assert "nav_group" in module_data, f"{module_name} missing nav_group"

    def test_modules_have_nav_link(self):
        """TC-91: All modules should have a nav_link field."""
        for module_name, module_data in FUSION_MODULE_NAVIGATION.items():
            assert "nav_link" in module_data, f"{module_name} missing nav_link"

    def test_modules_have_tasks(self):
        """TC-92: All modules should have at least one task."""
        for module_name, module_data in FUSION_MODULE_NAVIGATION.items():
            assert "tasks" in module_data, f"{module_name} missing tasks"
            assert len(module_data["tasks"]) > 0, f"{module_name} has no tasks"

    def test_tasks_have_steps(self):
        """TC-93: All tasks should have at least one step."""
        for module_name, module_data in FUSION_MODULE_NAVIGATION.items():
            for task_name, steps in module_data["tasks"].items():
                assert len(steps) > 0, f"{module_name}/{task_name} has no steps"
                assert isinstance(steps, list), f"{module_name}/{task_name} steps should be a list"

    def test_gl_has_create_journal_task(self):
        """TC-94: GL module should have 'Create Journal' task."""
        gl = FUSION_MODULE_NAVIGATION["Financials - General Ledger"]
        assert "Create Journal" in gl["tasks"]

    def test_ap_has_create_invoice_task(self):
        """TC-95: AP module should have 'Create Invoice' task."""
        ap = FUSION_MODULE_NAVIGATION["Financials - Accounts Payable"]
        assert "Create Invoice" in ap["tasks"]

    def test_hcm_has_hire_employee_task(self):
        """TC-96: HCM module should have 'Hire Employee' task."""
        hcm = FUSION_MODULE_NAVIGATION["HCM - Core HR"]
        assert "Hire Employee" in hcm["tasks"]
