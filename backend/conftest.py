"""Pytest configuration and shared fixtures for backend tests."""

import pytest
from unittest.mock import patch
from app import app as flask_app


@pytest.fixture
def app():
    """Create Flask application for testing."""
    flask_app.config["TESTING"] = True
    return flask_app


@pytest.fixture
def client(app):
    """Create Flask test client."""
    return app.test_client()


@pytest.fixture
def mock_env_live():
    """Mock environment variables for live Oracle AI configuration."""
    with patch.dict("os.environ", {
        "ORACLE_AI_ENDPOINT": "https://ai.test.oraclecloud.com",
        "ORACLE_AI_API_KEY": "test-api-key-12345",
        "ORACLE_AI_COMPARTMENT_ID": "ocid1.compartment.oc1..test",
        "ORACLE_AI_MODEL_ID": "cohere.command-r-plus",
    }):
        yield
