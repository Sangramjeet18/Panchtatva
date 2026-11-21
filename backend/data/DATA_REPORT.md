# EcoSense Data Provenance and Limitations Report

This report outlines the boundary conditions, analytical limits, and provenance of datasets integrated into the EcoSense platform.

## 1. National Forest Series (World Bank / FAO)
- **Source**: World Bank Development Indicators (`AG.LND.FRST.K2` and `AG.LND.FRST.ZS`), FAO Global Forest Resources Assessment.
- **Coverage**: Annual national figures for India from 1990 to 2022.
- **Status**: Real.
- **Limits**: Reflects broad FAO definition of forest area (land spanning more than 0.5 hectares with trees higher than 5 meters and a canopy cover of more than 10 percent). Does not differentiate between primary old-growth forest and industrial commercial monoculture plantations.
- **Modeling**: Forecast uses ordinary least-squares regression with 3-year held-out cross validation. Forecast is clamped strictly at zero.

## 2. Forest Cover Assessments (Forest Survey of India)
- **Source**: Forest Survey of India (FSI) biennial assessments.
- **Status**: Real (official government survey).
- **Limits**: Measures biennial canopy cover in square kilometers, not yearly tree cover loss. Canopy categories include Very Dense Forest (>70% canopy density), Moderately Dense Forest (40% to 70%), and Open Forest (10% to 40%). Because assessment methodologies and satellite sensor resolutions have evolved across report cycles, direct subtraction between distant assessments reflects both real ground change and cartographic reclassifications.
- **Prohibition**: Never call FSI cover changes "deforestation" and never fit linear regression curves to biennial state or district intervals.

## 3. Waterlogging Screening Index
- **Source**: Open-Meteo precipitation forecasts and municipal elevation topography across 8 monitoring areas in Kolkata.
- **Status**: Proxy.
- **Limits**: Computed via an empirical threshold formula combining 3-day accumulated rainfall (mm) and ground elevation (meters above sea level). It serves as a rapid screening index rather than a detailed hydrodynamic pipe network simulation. It does not account for pump operating schedules, local tidal locks on the Hooghly River, or micro-level street drain blockages.
- **Prohibition**: No machine learning model is trained on this proxy, and no accuracy, precision, or recall scores are claimed.

## 4. Atmospheric CO2 and Air Quality
- **Source**: Open-Meteo Air Quality API / Copernicus Atmosphere Monitoring Service (CAMS).
- **Status**: Modelled.
- **Limits**: Atmospheric CO2 concentrations are regional atmospheric chemistry model outputs assimilating satellite radiances, not hyper-local surface sensor measurements.

## 5. Emission Factors and Species Sequestration
- **Source**: Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector; IPCC Guidelines for National Greenhouse Gas Inventories; Indian Council of Forestry Research and Education (ICFRE).
- **Status**: Assumption.
- **Limits**: The baseline absorption rate of 21 kg CO2 per mature tree per year represents an all-species agro-climatic average across Indian conditions. Actual sequestration depends on species maturity, soil nitrogen, spacing, and mortality rates.
