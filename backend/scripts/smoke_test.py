#!/usr/bin/env python3
"""
EcoSense Smoke Test Suite
Validates all production criteria against a running EcoSense backend:
1. /health is ok
2. 36 states and 750 districts are returned
3. District forest cover sum equals 715342.61 km2 within 0.01
4. One state's district list loads (IN-WB)
5. Carbon calculator endpoint works (/carbon/calc)
6. Reforestation planner works with 500 trees on 6.5 hectares (/reforestation/plan)
7. Waterlogging index endpoint returns data (/waterlogging/index)
8. Every response has meta.data_status
9. CORS header matches the allowed origin
"""

import sys
import argparse
import requests

def run_smoke_tests(base_url: str, allowed_origin: str = "http://localhost:3000") -> bool:
    base_url = base_url.rstrip("/")
    print(f"=== EcoSense Smoke Test Suite ===")
    print(f"Target Base URL: {base_url}")
    print(f"Testing Origin : {allowed_origin}\n")

    passed = 0
    total = 9
    session = requests.Session()
    headers = {"Origin": allowed_origin}

    # 1. Health check
    try:
        r = session.get(f"{base_url}/health", headers=headers, timeout=10)
        data = r.json()
        if r.status_code == 200 and data.get("status") == "ok":
            print(f"PASS [1/9]: /health returned status ok (version: {data.get('version', 'N/A')})")
            passed += 1
        else:
            print(f"FAIL [1/9]: /health returned code {r.status_code}, body: {r.text}")
    except Exception as e:
        print(f"FAIL [1/9]: /health connection error: {e}")

    # 2. 36 states and 750 districts returned
    states_data = None
    districts_data = None
    try:
        r_states = session.get(f"{base_url}/forest/states", headers=headers, timeout=10)
        r_dist = session.get(f"{base_url}/forest/districts?size=1000", headers=headers, timeout=10)
        if r_states.status_code == 200 and r_dist.status_code == 200:
            states_json = r_states.json()
            dist_json = r_dist.json()
            states_count = len(states_json.get("data", []))
            dist_total = dist_json.get("data", {}).get("total", 0)
            dist_items = dist_json.get("data", {}).get("items", [])
            states_data = states_json
            districts_data = dist_json

            if states_count == 36 and (dist_total == 750 or len(dist_items) == 750):
                print(f"PASS [2/9]: Forest coverage returned exactly {states_count} states and 750 districts")
                passed += 1
            else:
                print(f"FAIL [2/9]: Expected 36 states and 750 districts; got {states_count} states, {dist_total} districts")
        else:
            print(f"FAIL [2/9]: Forest endpoints returned status codes {r_states.status_code}, {r_dist.status_code}")
    except Exception as e:
        print(f"FAIL [2/9]: Forest state/district error: {e}")

    # 3. District forest cover sum equals 715342.61 km2 within 0.01
    try:
        if districts_data:
            items = districts_data.get("data", {}).get("items", [])
            total_km2_sum = sum(float(d.get("total_km2", 0)) for d in items)
            diff = abs(total_km2_sum - 715342.61)
            if diff <= 0.01:
                print(f"PASS [3/9]: District forest cover sum equals {total_km2_sum:.2f} km2 (diff from target: {diff:.4f} <= 0.01)")
                passed += 1
            else:
                print(f"FAIL [3/9]: District forest cover sum is {total_km2_sum:.2f} km2 (expected 715342.61 km2, diff: {diff:.4f})")
        else:
            print(f"FAIL [3/9]: Cannot compute district sum (districts data unavailable)")
    except Exception as e:
        print(f"FAIL [3/9]: District sum calculation error: {e}")

    # 4. One state's district list loads (IN-WB)
    try:
        r_wb = session.get(f"{base_url}/forest/districts?state=IN-WB&size=100", headers=headers, timeout=10)
        if r_wb.status_code == 200:
            wb_json = r_wb.json()
            wb_items = wb_json.get("data", {}).get("items", [])
            if len(wb_items) > 0:
                print(f"PASS [4/9]: State district filter (IN-WB) successfully loaded {len(wb_items)} districts")
                passed += 1
            else:
                print(f"FAIL [4/9]: IN-WB returned 0 districts")
        else:
            print(f"FAIL [4/9]: IN-WB district query returned status code {r_wb.status_code}")
    except Exception as e:
        print(f"FAIL [4/9]: State district query error: {e}")

    # 5. Carbon calculator endpoint works
    calc_data = None
    try:
        payload = {
            "electricity_kwh_monthly": 150.0,
            "car_km_weekly": 40.0,
            "bus_km_weekly": 20.0,
            "metro_km_weekly": 15.0,
            "flights_yearly": 1,
            "diet_type": "vegetarian"
        }
        r_calc = session.post(f"{base_url}/carbon/calc", json=payload, headers=headers, timeout=10)
        if r_calc.status_code == 200:
            calc_json = r_calc.json()
            calc_data = calc_json
            total_kg = calc_json.get("data", {}).get("total_kg_per_year", 0)
            if total_kg > 0:
                print(f"PASS [5/9]: /carbon/calc computed footprint of {total_kg} kg CO2/year")
                passed += 1
            else:
                print(f"FAIL [5/9]: /carbon/calc returned 0 kg total")
        else:
            print(f"FAIL [5/9]: /carbon/calc returned status code {r_calc.status_code}, body: {r_calc.text}")
    except Exception as e:
        print(f"FAIL [5/9]: /carbon/calc error: {e}")

    # 6. Reforestation planner works with 500 trees on 6.5 hectares
    plan_data = None
    try:
        payload = {"target_trees": 500, "hectares": 6.5, "rainfall_mm": 1200}
        r_plan = session.post(f"{base_url}/reforestation/plan", json=payload, headers=headers, timeout=10)
        if r_plan.status_code == 200:
            plan_json = r_plan.json()
            plan_data = plan_json
            trees = plan_json.get("data", {}).get("target_trees")
            annual_co2 = plan_json.get("data", {}).get("annual_co2_kg")
            if trees == 500 and annual_co2 is not None and annual_co2 > 0:
                print(f"PASS [6/9]: /reforestation/plan calculated 500 trees on 6.5 ha => {annual_co2} kg CO2/year")
                passed += 1
            else:
                print(f"FAIL [6/9]: Unexpected plan output: {plan_json.get('data')}")
        else:
            print(f"FAIL [6/9]: /reforestation/plan returned status code {r_plan.status_code}, body: {r_plan.text}")
    except Exception as e:
        print(f"FAIL [6/9]: /reforestation/plan error: {e}")

    # 7. Waterlogging index endpoint returns data
    water_data = None
    try:
        r_water = session.get(f"{base_url}/waterlogging/index", headers=headers, timeout=10)
        if r_water.status_code == 200:
            water_json = r_water.json()
            water_data = water_json
            areas = water_json.get("data", [])
            if len(areas) >= 8:
                print(f"PASS [7/9]: /waterlogging/index returned {len(areas)} monitored areas with screening indices")
                passed += 1
            else:
                print(f"FAIL [7/9]: /waterlogging/index returned {len(areas)} areas (expected >= 8)")
        else:
            print(f"FAIL [7/9]: /waterlogging/index returned status code {r_water.status_code}")
    except Exception as e:
        print(f"FAIL [7/9]: /waterlogging/index error: {e}")

    # 8. Every response has meta.data_status
    try:
        responses_to_check = [
            ("states", states_data),
            ("districts", districts_data),
            ("carbon_calc", calc_data),
            ("reforestation_plan", plan_data),
            ("waterlogging_index", water_data),
        ]
        missing_meta = []
        for name, resp in responses_to_check:
            if not resp or "meta" not in resp or not resp["meta"].get("data_status"):
                missing_meta.append(name)

        if not missing_meta:
            print("PASS [8/9]: Every endpoint returned valid meta.data_status (Real/Modelled/Proxy/Assumption)")
            passed += 1
        else:
            print(f"FAIL [8/9]: Missing meta.data_status on endpoints: {missing_meta}")
    except Exception as e:
        print(f"FAIL [8/9]: meta.data_status check error: {e}")

    # 9. CORS header matches the allowed origin
    try:
        r_cors = session.options(
            f"{base_url}/health",
            headers={
                "Origin": allowed_origin,
                "Access-Control-Request-Method": "GET"
            },
            timeout=10
        )
        allow_origin = r_cors.headers.get("access-control-allow-origin")
        if allow_origin == allowed_origin:
            print(f"PASS [9/9]: CORS access-control-allow-origin header exactly matched '{allowed_origin}'")
            passed += 1
        else:
            # Also test on a GET response
            r_get = session.get(f"{base_url}/health", headers={"Origin": allowed_origin}, timeout=10)
            get_origin = r_get.headers.get("access-control-allow-origin")
            if get_origin == allowed_origin:
                print(f"PASS [9/9]: CORS access-control-allow-origin header matched '{allowed_origin}' on GET")
                passed += 1
            else:
                print(f"FAIL [9/9]: CORS header was '{allow_origin}' on OPTIONS and '{get_origin}' on GET (expected '{allowed_origin}')")
    except Exception as e:
        print(f"FAIL [9/9]: CORS header check error: {e}")

    print(f"\nSmoke Test Results: {passed}/{total} Passed.")
    return passed == total


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="EcoSense Deployment Smoke Test")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000", help="Base URL of backend service")
    parser.add_argument("--origin", default="http://localhost:3000", help="Origin header for CORS check")
    args = parser.parse_args()

    success = run_smoke_tests(base_url=args.base_url, allowed_origin=args.origin)
    sys.exit(0 if success else 1)
