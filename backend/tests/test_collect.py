import os
import unittest
from unittest.mock import patch, MagicMock
import pandas as pd

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

try:
    from backend.scripts.collect_data import (
        compute_risk_proxy,
        collect_waterlogging,
        collect_carbon,
        collect_forest,
        collect_species,
        MONITORING_AREAS,
    )
except ModuleNotFoundError:
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
    from scripts.collect_data import (
        compute_risk_proxy,
        collect_waterlogging,
        collect_carbon,
        collect_forest,
        collect_species,
        MONITORING_AREAS,
    )


class TestDataCollector(unittest.TestCase):

    def test_compute_risk_proxy(self):
        # High: high rain, low elevation
        self.assertEqual(compute_risk_proxy(75.0, 4.0), "high")
        # Medium: medium rain
        self.assertEqual(compute_risk_proxy(50.0, 6.5), "medium")
        self.assertEqual(compute_risk_proxy(30.0, 5.0), "medium")
        # Low: low rain, higher elevation
        self.assertEqual(compute_risk_proxy(10.0, 7.0), "low")

    @patch("requests.Session.get")
    def test_collect_waterlogging_mocked(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "daily": {
                "time": ["2026-11-21", "2026-11-22", "2026-11-23"],
                "precipitation_sum": [12.0, 45.0, 80.0]
            }
        }
        mock_get.return_value = mock_resp

        mock_session = MagicMock()
        mock_session.get.return_value = mock_resp

        result = collect_waterlogging(mock_session)
        self.assertTrue(result)

    @patch("requests.Session.get")
    def test_collect_forest_mocked(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = [
            {"page": 1, "pages": 1},
            [
                {"date": "2021", "value": 724200.0},
                {"date": "2020", "value": 721600.0}
            ]
        ]
        mock_get.return_value = mock_resp

        mock_session = MagicMock()
        mock_session.get.return_value = mock_resp

        result = collect_forest(mock_session)
        self.assertTrue(result)

    def test_collect_species_mocked(self):
        mock_session = MagicMock()
        result = collect_species(mock_session)
        self.assertTrue(result)

    def test_collect_carbon_mocked(self):
        mock_session = MagicMock()
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "hourly": {
                "time": ["2026-11-21T00:00"],
                "carbon_monoxide": [410.0],
                "pm2_5": [40.0]
            }
        }
        mock_session.get.return_value = mock_resp
        result = collect_carbon(mock_session)
        self.assertTrue(result)


if __name__ == "__main__":
    unittest.main()
