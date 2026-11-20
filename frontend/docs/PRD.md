# EcoSense Product Requirements Document (PRD)

## 1. Summary
EcoSense is a website that predicts and tracks four environmental issues in India: deforestation, reforestation, carbon footprint and waterlogging. Each module takes public or simulated data, runs a simple model, and shows the result as a chart, map or number a normal person can act on.

## 2. Problem
Forest loss, rising emissions and urban flooding are reported late, in scattered reports and spreadsheets. Students, local authorities and NGOs cannot see trends early or connect one issue to another.

## 3. Users
- Student or citizen: wants to know their own footprint and what to do about it.
- NGO or forest officer: wants to see which regions lose forest and where to replant.
- City planner: wants to know which wards risk waterlogging after heavy rain.
- Teacher or examiner: wants a clear, explainable method.

## 4. Goals
1. One site, four modules, one consistent design.
2. Every module has a working demo with real inputs and real outputs.
3. Every prediction states its method, data source and limits.
4. Modules link to each other (footprint leads to trees, trees lead to planting zones).

## 5. Non-goals
Live satellite processing, user accounts with payments, mobile app, social media mining (future scope).

## 6. Modules and requirements

### M1 Deforestation Tracker
- Choose a state (start with West Bengal, Assam, Odisha, Kerala).
- Show yearly forest loss as a line chart and a 10 year forecast with a shaded range.
- Show a risk map by district (Low, Medium, High).
- Acceptance: forecast and risk change when the state changes; method note visible.

### M2 Reforestation Planner
- Input: hectares or number of trees, region, rainfall band.
- Output: CO2 absorbed per year, species suggestions, priority zones taken from M1 high risk districts.
- Acceptance: the figure matches the formula trees x absorption rate; species list depends on region.

### M3 Carbon Footprint Tracker
- Calculator: electricity, travel, flights, diet, giving tonnes CO2 per year with a breakdown.
- Live panel: sensor style readings (simulated unless hardware exists) refreshed every few seconds, threshold alert, next hour forecast.
- Acceptance: result updates on input; simulated data is labelled "simulated".

### M4 Waterlogging Predictor
- Choose a city and ward (start with Kolkata).
- Inputs: forecast rainfall from Open-Meteo, elevation, drainage score, past flood count.
- Output: risk level per ward for the next 3 days on a map, plus a short list of high risk wards.
- Acceptance: risk rises when rainfall input rises.

## 7. Pages
Home, About and Method, Deforestation, Reforestation, Carbon, Waterlogging, Data Sources, Terms, Privacy.

## 8. Content rules
- Home and About explain in plain words what EcoSense does and for whom.
- No invented statistics, quotes, testimonials or user counts. Sample data is always labelled.
- Photos: deforestation image on M1, seedling image on M2, two industrial images on M3, flooded street image on M4.

## 9. Success measures
All four demos work offline from seed data; Lighthouse accessibility 90 or above; each module explainable in two minutes during a viva.

## 10. Risks
Data gaps (mitigate with seed CSVs), model overclaiming (show error and limits), scope (build pieces in order, cut M3 live panel first).
