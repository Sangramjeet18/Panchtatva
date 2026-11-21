import os
import sys
import unittest

backend_dir = os.path.dirname(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.routers.regions import get_regions
    from app.routers.forest import get_forest_states, get_forest_districts, get_forest_national
    from app.routers.carbon import get_factors, get_countries, get_air_quality, calculate_footprint, CarbonCalcRequest
    from app.routers.reforestation import get_species, create_plan, ReforestationPlanRequest
    from app.routers.waterlogging import get_monitoring_areas, get_index
except ImportError:
    from backend.app.routers.regions import get_regions
    from backend.app.routers.forest import get_forest_states, get_forest_districts, get_forest_national
    from backend.app.routers.carbon import get_factors, get_countries, get_air_quality, calculate_footprint, CarbonCalcRequest
    from backend.app.routers.reforestation import get_species, create_plan, ReforestationPlanRequest
    from backend.app.routers.waterlogging import get_monitoring_areas, get_index


class TestEcoSenseAPI(unittest.TestCase):

    def test_regions(self):
        resp = get_regions()
        self.assertIn("data", resp)
        self.assertIn("meta", resp)
        self.assertEqual(resp["meta"]["data_status"], "real")

    def test_forest_states(self):
        resp = get_forest_states()
        self.assertIn("data", resp)
        self.assertEqual(len(resp["data"]), 36)
        self.assertEqual(resp["meta"]["data_status"], "real")

    def test_forest_districts(self):
        resp = get_forest_districts()
        self.assertIn("data", resp)
        self.assertIn("items", resp["data"])

    def test_forest_national(self):
        resp = get_forest_national()
        self.assertIn("historical", resp["data"])
        self.assertIn("forecast", resp["data"])
        self.assertIn("mae", resp["data"])
        self.assertGreater(len(resp["data"]["forecast"]), 0)

    def test_carbon_factors(self):
        resp = get_factors()
        self.assertEqual(resp["meta"]["data_status"], "assumption")

    def test_carbon_countries(self):
        resp = get_countries()
        self.assertIn("data", resp)
        self.assertEqual(resp["meta"]["data_status"], "real")

    def test_carbon_air(self):
        resp = get_air_quality()
        self.assertIn("data", resp)
        self.assertEqual(resp["meta"]["data_status"], "modelled")

    def test_carbon_calc(self):
        req = CarbonCalcRequest(
            electricity_kwh_monthly=200,
            car_km_weekly=50,
            bus_km_weekly=30,
            metro_km_weekly=20,
            flights_yearly=2,
            diet_type="vegetarian"
        )
        resp = calculate_footprint(req)
        data = resp["data"]
        self.assertGreater(data["total_kg_per_year"], 0)
        self.assertGreater(data["trees_needed"], 0)
        self.assertEqual(data["tree_absorption_rate_kg"], 21.0)
        self.assertEqual(data["tree_absorption_status"], "assumption")

    def test_reforestation_species(self):
        resp = get_species()
        self.assertEqual(len(resp["data"]), 19)
        self.assertEqual(resp["meta"]["data_status"], "assumption")

    def test_reforestation_plan(self):
        req = ReforestationPlanRequest(target_trees=500, rainfall_mm=1200)
        resp = create_plan(req)
        data = resp["data"]
        self.assertEqual(data["target_trees"], 500)
        self.assertEqual(data["annual_co2_kg"], 500 * 21.0)
        self.assertEqual(data["standard_absorption_status"], "assumption")

    def test_waterlogging_areas(self):
        resp = get_monitoring_areas()
        self.assertEqual(len(resp["data"]), 8)
        self.assertEqual(resp["meta"]["data_status"], "real")

    def test_waterlogging_index(self):
        resp = get_index(rain=50)
        self.assertEqual(len(resp["data"]), 8)
        self.assertEqual(resp["meta"]["data_status"], "proxy")
        for item in resp["data"]:
            self.assertIn(item["risk_proxy"], ["low", "medium", "high"])


if __name__ == "__main__":
    unittest.main()
