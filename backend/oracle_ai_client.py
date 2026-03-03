import json
import requests
from config import Config


class OracleAIClient:
    """Client for communicating with Oracle AI Assist API."""

    def __init__(self):
        self.endpoint = Config.ORACLE_AI_ENDPOINT
        self.api_key = Config.ORACLE_AI_API_KEY
        self.compartment_id = Config.ORACLE_AI_COMPARTMENT_ID
        self.model_id = Config.ORACLE_AI_MODEL_ID

    def _get_headers(self):
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

    def _build_prompt(self, module, test_type, description, additional_context):
        """Build a structured prompt for Oracle Fusion test script generation."""
        prompt = f"""You are an expert Oracle Fusion Cloud test automation engineer.
Generate a detailed, executable test script for the following Oracle Fusion module.

**Module:** {module}
**Test Type:** {test_type}
**Test Description:** {description}
"""
        if additional_context:
            prompt += f"\n**Additional Context:** {additional_context}\n"

        prompt += """
Please generate the test script with the following structure:
1. **Test Case ID** and **Title**
2. **Preconditions** required before execution
3. **Step-by-step test instructions** with:
   - Navigation path in Oracle Fusion
   - Actions to perform (click, enter data, select, etc.)
   - Expected results for each step
   - Data inputs where applicable
4. **Postconditions / Cleanup** steps
5. **Validation checkpoints** to confirm success

Format the output as a structured, ready-to-execute test script.
"""
        return prompt

    def generate_test_script(self, module, test_type, description, additional_context=""):
        """Generate a test script using Oracle AI Assist."""
        prompt = self._build_prompt(module, test_type, description, additional_context)

        if not self.endpoint or not self.api_key:
            return self._generate_demo_response(module, test_type, description)

        payload = {
            "compartmentId": self.compartment_id,
            "servingMode": {
                "servingType": "ON_DEMAND",
                "modelId": self.model_id,
            },
            "chatRequest": {
                "apiFormat": "GENERIC",
                "messages": [
                    {
                        "role": "USER",
                        "content": [{"type": "TEXT", "text": prompt}],
                    }
                ],
                "maxTokens": 4096,
                "temperature": 0.3,
            },
        }

        try:
            response = requests.post(
                f"{self.endpoint}/20231130/actions/chat",
                headers=self._get_headers(),
                json=payload,
                timeout=60,
            )
            response.raise_for_status()
            result = response.json()

            chat_response = result.get("chatResponse", {})
            choices = chat_response.get("choices", [])
            if choices:
                message = choices[0].get("message", {})
                content = message.get("content", [])
                if content:
                    return {
                        "success": True,
                        "script": content[0].get("text", ""),
                        "model": self.model_id,
                    }

            return {"success": False, "error": "No response content from Oracle AI."}

        except requests.exceptions.ConnectionError:
            return {"success": False, "error": "Cannot connect to Oracle AI endpoint. Check your configuration."}
        except requests.exceptions.Timeout:
            return {"success": False, "error": "Request to Oracle AI timed out. Please try again."}
        except requests.exceptions.HTTPError as e:
            return {"success": False, "error": f"Oracle AI API error: {e.response.status_code} - {e.response.text}"}
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {str(e)}"}

    def _generate_demo_response(self, module, test_type, description):
        """Generate a demo response when Oracle AI credentials are not configured."""
        script = f"""# ============================================================
# Oracle Fusion Test Script (Demo Mode)
# ============================================================
# Module:      {module}
# Test Type:   {test_type}
# Description: {description}
# Generated:   AI-Assisted Test Script
# ============================================================

## Test Case ID: TC_{module.upper().replace(' ', '_')}_{test_type.upper().replace(' ', '_')}_001

### Title
{description}

### Preconditions
1. User has valid Oracle Fusion Cloud credentials
2. User has the required security role for {module}
3. Test environment is available and accessible
4. Test data has been prepared per the data requirements below

### Test Data Requirements
| Field              | Value                          |
|--------------------|--------------------------------|
| Business Unit      | US1 Business Unit              |
| Module             | {module}                       |
| Test Environment   | UAT                            |

### Test Steps

**Step 1: Login to Oracle Fusion**
- Navigation: Open Oracle Fusion Cloud URL
- Action: Enter username and password, click Sign In
- Expected Result: Home dashboard is displayed

**Step 2: Navigate to {module}**
- Navigation: Navigator > {module}
- Action: Click on the {module} module link
- Expected Result: {module} landing page is displayed

**Step 3: Perform {test_type}**
- Navigation: {module} > {test_type}
- Action: {description}
- Expected Result: The operation completes successfully

**Step 4: Validate Results**
- Navigation: Review the outcome
- Action: Verify all data fields are correctly saved
- Expected Result: All validations pass, data is consistent

**Step 5: Capture Evidence**
- Action: Take screenshots of the completed transaction
- Expected Result: Evidence is saved for documentation

### Postconditions
1. Log out of Oracle Fusion Cloud
2. Document the test results
3. Report any defects found during testing

### Validation Checkpoints
- [ ] All mandatory fields are populated correctly
- [ ] Transaction status shows as completed/approved
- [ ] Audit trail records are created
- [ ] No error messages are displayed
- [ ] Data integrity is maintained across related modules

---
**Note:** This is a demo-generated script. Configure Oracle AI Assist
credentials in the .env file for AI-powered test script generation.
"""
        return {
            "success": True,
            "script": script,
            "model": "demo-mode",
            "note": "Demo mode active. Set ORACLE_AI_ENDPOINT and ORACLE_AI_API_KEY in .env for live AI generation.",
        }

    def validate_connection(self):
        """Check if Oracle AI Assist is reachable."""
        if not self.endpoint or not self.api_key:
            return {
                "connected": False,
                "mode": "demo",
                "message": "Oracle AI credentials not configured. Running in demo mode.",
            }

        try:
            response = requests.get(
                f"{self.endpoint}/20231130/models",
                headers=self._get_headers(),
                timeout=10,
            )
            return {
                "connected": response.status_code == 200,
                "mode": "live",
                "message": "Connected to Oracle AI Assist." if response.status_code == 200
                else f"Connection issue: HTTP {response.status_code}",
            }
        except Exception as e:
            return {
                "connected": False,
                "mode": "error",
                "message": f"Connection failed: {str(e)}",
            }
