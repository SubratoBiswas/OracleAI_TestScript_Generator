from flask import Flask, request, jsonify
from flask_cors import CORS
from oracle_ai_client import OracleAIClient
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

ai_client = OracleAIClient()

# Oracle Fusion modules available for test script generation
FUSION_MODULES = [
    "Financials - General Ledger",
    "Financials - Accounts Payable",
    "Financials - Accounts Receivable",
    "Financials - Fixed Assets",
    "Financials - Cash Management",
    "Procurement - Purchasing",
    "Procurement - Supplier Portal",
    "Procurement - Sourcing",
    "HCM - Core HR",
    "HCM - Payroll",
    "HCM - Talent Management",
    "HCM - Recruitment",
    "HCM - Benefits",
    "HCM - Absence Management",
    "SCM - Inventory Management",
    "SCM - Order Management",
    "SCM - Manufacturing",
    "SCM - Logistics",
    "PPM - Project Management",
    "PPM - Project Costing",
    "CX - Sales",
    "CX - Service",
    "ERP - Tax",
    "ERP - Intercompany",
]

TEST_TYPES = [
    "Functional Test",
    "Integration Test",
    "Regression Test",
    "End-to-End Test",
    "User Acceptance Test (UAT)",
    "Data Migration Test",
    "Security/Role Test",
    "Performance Test",
    "Negative Test",
    "Boundary Value Test",
]


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "OracleAI TestScript Generator"})


@app.route("/api/connection-status", methods=["GET"])
def connection_status():
    status = ai_client.validate_connection()
    return jsonify(status)


@app.route("/api/modules", methods=["GET"])
def get_modules():
    return jsonify({"modules": FUSION_MODULES})


@app.route("/api/test-types", methods=["GET"])
def get_test_types():
    return jsonify({"testTypes": TEST_TYPES})


@app.route("/api/generate", methods=["POST"])
def generate_test_script():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Request body is required."}), 400

    module = data.get("module", "").strip()
    test_type = data.get("testType", "").strip()
    description = data.get("description", "").strip()
    additional_context = data.get("additionalContext", "").strip()
    env_url = data.get("envUrl", "").strip()
    username = data.get("username", "").strip()

    if not module:
        return jsonify({"success": False, "error": "Module is required."}), 400
    if not test_type:
        return jsonify({"success": False, "error": "Test type is required."}), 400
    if not description:
        return jsonify({"success": False, "error": "Test description is required."}), 400

    result = ai_client.generate_test_script(
        module, test_type, description, additional_context, env_url, username
    )
    status_code = 200 if result.get("success") else 500
    return jsonify(result), status_code


if __name__ == "__main__":
    port = int(Config.ORACLE_AI_ENDPOINT and "5000" or "5000")
    print("=" * 60)
    print("  Oracle AI TestScript Generator - Backend")
    print("=" * 60)
    status = ai_client.validate_connection()
    print(f"  Oracle AI Status: {status['message']}")
    print(f"  Mode: {status['mode']}")
    print(f"  Server: http://localhost:5000")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
