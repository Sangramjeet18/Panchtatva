'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { NumberField } from '@/components/ui/NumberField';
import { Skeleton } from '@/components/ui/Skeleton';
import speciesCatalog from '@/data/serve/species.json';
import allRegionsData from '@/data/serve/regions.json';
import assessmentsData from '@/data/serve/forest_cover_assessments.json';
import bandsData from '@/data/reforestation_bands.json';
import {
  AreaUnit,
  PlanningMode,
  TreeAge,
  SpeciesCandidate,
  solvePlanningMode,
  calculateAbsorptionRange,
  categorizeSpeciesByRainfall,
  rankDistrictsByDecline,
  RAINFALL_BANDS,
  toHectares,
  fromHectares,
} from '@/lib/reforestation';

export function ReforestationClient() {
  // Planning Mode state
  const [mode, setMode] = useState<PlanningMode>('trees_area');
  const [treesInput, setTreesInput] = useState<number>(500);
  const [areaInput, setAreaInput] = useState<number>(6.5);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('ha');
  const [spacingInput, setSpacingInput] = useState<number>(11.4);

  // Survival & Tree Age state
  const [survivalPercent, setSurvivalPercent] = useState<number>(85);
  const [treeAge, setTreeAge] = useState<TreeAge>('mature');

  // Region filter (All 36 States and UTs)
  const [stateSearch, setStateSearch] = useState<string>('');
  const [selectedStateId, setSelectedStateId] = useState<string>('IN-WB');
  const [isLoadingZones, setIsLoadingZones] = useState<boolean>(false);

  // Rainfall band filter
  const [rainfallBand, setRainfallBand] = useState<string>('all');

  // 1. Solve planning inputs
  const solved = useMemo(() => {
    return solvePlanningMode({
      mode,
      trees: treesInput,
      areaValue: areaInput,
      areaUnit,
      spacingM: spacingInput,
    });
  }, [mode, treesInput, areaInput, areaUnit, spacingInput]);

  // Keep other inputs synchronized when solver updates
  const handleModeChange = (newMode: PlanningMode) => {
    setMode(newMode);
    if (newMode === 'trees_area') {
      setTreesInput(solved.trees);
      setAreaInput(fromHectares(solved.hectares, areaUnit));
    } else if (newMode === 'area_spacing') {
      setAreaInput(fromHectares(solved.hectares, areaUnit));
      setSpacingInput(solved.spacingM);
    } else if (newMode === 'trees_spacing') {
      setTreesInput(solved.trees);
      setSpacingInput(solved.spacingM);
    }
  };

  // 2. Projected absorption range
  const absorption = useMemo(() => {
    return calculateAbsorptionRange(solved.trees, survivalPercent, treeAge);
  }, [solved.trees, survivalPercent, treeAge]);

  // 3. Extract 36 States/UTs from regions.json
  const statesList = useMemo(() => {
    return (allRegionsData as any[])
      .filter((r) => r.level === 'state')
      .map((r) => ({ id: r.id, name: r.name, code: r.code }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return statesList;
    const q = stateSearch.toLowerCase();
    return statesList.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [statesList, stateSearch]);

  const selectedStateName = useMemo(() => {
    const s = statesList.find((st) => st.id === selectedStateId);
    return s ? s.name : selectedStateId;
  }, [statesList, selectedStateId]);

  // Handle state change with brief skeleton loader transition
  const handleStateSelect = (stId: string) => {
    if (stId === selectedStateId) return;
    setIsLoadingZones(true);
    setSelectedStateId(stId);
    setTimeout(() => {
      setIsLoadingZones(false);
    }, 250);
  };

  // 4. Priority planting zones (Ranked districts by decline)
  const priorityDistricts = useMemo(() => {
    const stateDistricts = (assessmentsData as any[]).filter(
      (d) => (d.parent_id === selectedStateId || d.state_id === selectedStateId) && d.level === 'district'
    );
    return rankDistrictsByDecline(stateDistricts);
  }, [selectedStateId]);

  // 5. Species Candidates (19 exact species categorized by rainfall)
  const categorizedSpecies = useMemo(() => {
    const list = (speciesCatalog as unknown as SpeciesCandidate[]) || [];
    return categorizeSpeciesByRainfall(list, rainfallBand);
  }, [rainfallBand]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* 1. Planning Parameters Container */}
      <div
        style={{
          border: '1px solid var(--line)',
          backgroundColor: 'var(--surface)',
          borderRadius: '2px',
          padding: '28px',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <div className="kicker" style={{ color: 'var(--clay)' }}>
            Planning Parameters
          </div>
          <h2 style={{ fontSize: '28px', margin: '4px 0 8px 0', color: 'var(--ink)' }}>
            Reforestation Target Solver
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '15px', margin: 0, maxWidth: '72ch' }}>
            Choose a planning mode to balance tree sapling requirements, land availability, and ground spacing.
          </p>
        </div>

        {/* Flat Segmented Control for Planning Modes */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--muted)',
              marginBottom: '8px',
            }}
          >
            Planning Mode
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {[
              { key: 'trees_area', label: 'Trees and area' },
              { key: 'area_spacing', label: 'Area and spacing' },
              { key: 'trees_spacing', label: 'Trees and spacing' },
            ].map((m) => {
              const active = mode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => handleModeChange(m.key as PlanningMode)}
                  style={{
                    backgroundColor: active ? 'var(--forest)' : 'var(--paper)',
                    color: active ? '#EDE7D9' : 'var(--ink)',
                    border: '1px solid ' + (active ? 'var(--forest)' : 'var(--line)'),
                    borderRadius: '2px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode-specific input fields */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {/* Target tree count */}
          {(mode === 'trees_area' || mode === 'trees_spacing') && (
            <NumberField
              id="rf-trees-input"
              label="Target Tree Count"
              unit="trees"
              value={treesInput}
              min={1}
              onChange={(val) => setTreesInput(val)}
            />
          )}

          {/* Land area input with unit selector inside or adjacent */}
          {(mode === 'trees_area' || mode === 'area_spacing') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="rf-area-input"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--ink)',
                  }}
                >
                  Planting Land Area
                </label>
                {/* Unit selector */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['ha', 'acres', 'sqm'] as AreaUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        const inHa = toHectares(areaInput, areaUnit);
                        setAreaUnit(u);
                        setAreaInput(Math.round(fromHectares(inHa, u) * 10) / 10);
                      }}
                      style={{
                        padding: '2px 6px',
                        fontSize: '11px',
                        border: '1px solid ' + (areaUnit === u ? 'var(--forest)' : 'var(--line)'),
                        backgroundColor: areaUnit === u ? 'var(--forest)' : 'transparent',
                        color: areaUnit === u ? '#EDE7D9' : 'var(--muted)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <NumberField
                id="rf-area-input"
                label=""
                unit={areaUnit}
                value={areaInput}
                min={0.0001}
                onChange={(val) => setAreaInput(val)}
              />
            </div>
          )}

          {/* Spacing / gap input */}
          {(mode === 'area_spacing' || mode === 'trees_spacing') && (
            <NumberField
              id="rf-spacing-input"
              label="Average Spacing"
              unit="metres"
              value={spacingInput}
              min={0.5}
              onChange={(val) => setSpacingInput(val)}
            />
          )}

          {/* Survival selector */}
          <div>
            <label
              htmlFor="rf-survival"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--ink)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Sapling Survival Rate
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[70, 80, 85, 90].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setSurvivalPercent(pct)}
                  style={{
                    flex: 1,
                    height: '42px',
                    border: '1px solid ' + (survivalPercent === pct ? 'var(--forest)' : 'var(--line)'),
                    backgroundColor: survivalPercent === pct ? 'var(--forest)' : 'var(--paper)',
                    color: survivalPercent === pct ? '#EDE7D9' : 'var(--ink)',
                    borderRadius: '2px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Tree age selector */}
          <div>
            <label
              htmlFor="rf-age"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--ink)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Stand Maturity Horizon
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { key: 'year_5', label: 'Yr 5' },
                { key: 'year_10', label: 'Yr 10' },
                { key: 'year_20', label: 'Yr 20' },
                { key: 'mature', label: 'Mature' },
              ].map((ag) => (
                <button
                  key={ag.key}
                  type="button"
                  onClick={() => setTreeAge(ag.key as TreeAge)}
                  style={{
                    flex: 1,
                    height: '42px',
                    border: '1px solid ' + (treeAge === ag.key ? 'var(--forest)' : 'var(--line)'),
                    backgroundColor: treeAge === ag.key ? 'var(--forest)' : 'var(--paper)',
                    color: treeAge === ag.key ? '#EDE7D9' : 'var(--ink)',
                    borderRadius: '2px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {ag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Unusual density warning banner (non-blocking) */}
        {solved.densityWarning && (
          <div
            style={{
              padding: '12px 16px',
              border: '1px solid var(--clay)',
              backgroundColor: 'var(--paper)',
              borderRadius: '2px',
              fontSize: '13px',
              color: 'var(--ink)',
              lineHeight: 1.5,
              marginBottom: '20px',
            }}
          >
            <strong>Note:</strong> {solved.densityWarning}
          </div>
        )}

        {/* Calculated Spacing and Density Verdict Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
              Computed Land Area
            </span>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
              {solved.hectares.toLocaleString()} ha
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
              Planting Density
            </span>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
              {solved.density.toLocaleString()} trees/ha
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
              Average Ground Gap
            </span>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
              {solved.spacingM.toLocaleString()} m
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
                Density Verdict
              </span>
              <span className="tag-badge-assumption">{solved.densityVerdictTag}</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--forest)' }}>
              {solved.densityVerdictLabel}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Projected Annual CO2 Absorption Range & Disclosure */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        <div
          style={{
            border: '1px solid var(--forest)',
            backgroundColor: 'var(--paper)',
            borderRadius: '2px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--forest)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>
              Projected Annual CO2 Absorption Range
            </span>
            <span className="tag-badge-assumption">Assumption</span>
          </div>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '44px',
              fontWeight: 600,
              color: 'var(--forest)',
              lineHeight: 1.1,
              marginBottom: '8px',
            }}
          >
            {absorption.rangeText}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted)' }} className="tabular-nums">
            ({absorption.annualKgMin.toLocaleString()} to {absorption.annualKgMax.toLocaleString()} kg annual CO2 absorption for {absorption.survivingTrees.toLocaleString()} surviving saplings at {survivalPercent}% survival)
          </div>
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '12px', color: 'var(--muted)' }}>
            <strong>Formula:</strong> {absorption.formulaText}
          </div>
        </div>

        <div
          style={{
            border: '1px solid var(--line)',
            backgroundColor: 'var(--surface)',
            borderRadius: '2px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>
              Scientific Disclosure
            </span>
            <span className="tag-badge-assumption">Assumption</span>
          </div>
          <h3 style={{ fontSize: '18px', margin: '4px 0 8px 0', color: 'var(--ink)' }}>
            21 kg CO2/Tree Baseline Assumption
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
            {absorption.provenance} Measured tree-by-tree biometric data requires localized sensor and wood density instrumentation. This figure provides a transparent standard guideline and must never be interpreted as verified physical measurement.
          </p>
        </div>
      </div>

      {/* 3. Priority Planting Zones Section (Ranked by relative decline) */}
      <div
        style={{
          border: '1px solid var(--line)',
          backgroundColor: 'var(--paper)',
          borderRadius: '2px',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div className="kicker" style={{ color: 'var(--clay)' }}>
              Targeting Guidance
            </div>
            <h3 style={{ fontSize: '24px', margin: '4px 0 6px 0', color: 'var(--ink)' }}>
              Districts with the largest forest cover decline
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, maxWidth: '78ch' }}>
              Formula in words: <em>Relative decline = decline in forest cover from 2021 to 2023 (km²) divided by total district forest cover (km²)</em>.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="tag-badge-real">Real Figures</span>
            <span className="tag-badge-proxy">Proxy Ranking</span>
          </div>
        </div>

        {/* All-of-India Region Selector (Type to filter across all 36 States/UTs) */}
        <div style={{ marginBottom: '24px', maxWidth: '480px' }}>
          <label
            htmlFor="state-type-filter"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--ink)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Select State or Union Territory (All 36 States/UTs)
          </label>
          <input
            id="state-type-filter"
            type="text"
            placeholder="Type state name to filter..."
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              padding: '0 10px',
              fontSize: '14px',
              backgroundColor: 'var(--surface)',
              color: 'var(--ink)',
              marginBottom: '8px',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <div
            style={{
              maxHeight: '140px',
              overflowY: 'auto',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              backgroundColor: 'var(--surface)',
            }}
          >
            {filteredStates.map((st) => (
              <div
                key={st.id}
                onClick={() => handleStateSelect(st.id)}
                style={{
                  padding: '6px 10px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  backgroundColor: selectedStateId === st.id ? 'var(--forest)' : 'transparent',
                  color: selectedStateId === st.id ? '#EDE7D9' : 'var(--ink)',
                  fontWeight: selectedStateId === st.id ? 600 : 400,
                }}
              >
                {st.name} ({st.id})
              </div>
            ))}
          </div>
        </div>

        {/* Priority Zones Table with Skeleton Loader & Empty State */}
        {isLoadingZones ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton height={32} />
            <Skeleton height={32} />
            <Skeleton height={32} />
          </div>
        ) : priorityDistricts.length === 0 ? (
          <div
            style={{
              padding: '24px',
              border: '1px dashed var(--line)',
              borderRadius: '2px',
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)', marginBottom: '4px' }}>
              No recorded forest cover decline in {selectedStateName}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Forest Survey of India records for this state register either stable or positive net forest canopy growth between 2021 and 2023.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="hairline-table" style={{ width: '100%', minWidth: '640px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                  <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Rank</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>District</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Forest Cover</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Cover Change (2021 to 2023)</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Relative Decline</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Basis</th>
                </tr>
              </thead>
              <tbody>
                {priorityDistricts.slice(0, 5).map((d, idx) => (
                  <tr key={d.district_id}>
                    <td style={{ fontWeight: 600, color: 'var(--clay)' }}>#{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{d.name}</td>
                    <td className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {d.forest_cover_km2.toLocaleString()} km²
                    </td>
                    <td className="tabular-nums" style={{ color: 'var(--clay)', fontWeight: 600 }}>
                      {d.change_vs_2021_km2.toLocaleString()} km²
                    </td>
                    <td className="tabular-nums" style={{ fontWeight: 600, color: 'var(--clay)' }}>
                      {d.relative_decline_pct}%
                    </td>
                    <td>
                      <span className="tag-badge-proxy">Proxy Rank</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Native Species Candidates Inventory Table (Exactly 19 species) */}
      <div
        style={{
          border: '1px solid var(--line)',
          backgroundColor: 'var(--paper)',
          borderRadius: '2px',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div className="kicker" style={{ color: 'var(--forest)' }}>
              Species Inventory
            </div>
            <h3 style={{ fontSize: '24px', margin: '4px 0 6px 0', color: 'var(--ink)' }}>
              Candidate Species ({categorizedSpecies.matched.length} Matched in Band, {categorizedSpecies.unsourced.length} Range Not Sourced)
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, maxWidth: '78ch' }}>
              The inventory contains exactly 19 native species candidates. Absorption rates are not yet sourced and marked accordingly.
            </p>
          </div>

          {/* Shared Rainfall Band Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="rf-band-filter" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Rainfall Band:
            </label>
            <select
              id="rf-band-filter"
              value={rainfallBand}
              onChange={(e) => setRainfallBand(e.target.value)}
              style={{
                height: '34px',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                backgroundColor: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: '13px',
                padding: '0 8px',
                outline: 'none',
              }}
            >
              {RAINFALL_BANDS.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Sourced Species Table */}
        <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
          <table className="hairline-table" style={{ width: '100%', minWidth: '700px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>ID</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Common Name</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Scientific Name</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Broad Zone Hint</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Rainfall Range</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Absorption Rate</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Ecological Role</th>
              </tr>
            </thead>
            <tbody>
              {categorizedSpecies.matched.map((sp) => (
                <tr key={sp.species_id}>
                  <td style={{ color: 'var(--muted)', fontSize: '12px' }}>#{sp.species_id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{sp.name}</td>
                  <td style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '13px' }}>{sp.scientific_name}</td>
                  <td style={{ fontSize: '13px' }}>
                    {sp.broad_zone_hint} <span className="tag-badge-unverified" style={{ marginLeft: '4px' }}>Unverified</span>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    {sp.min_rain_mm} to {sp.max_rain_mm} mm <span className="tag-badge-assumption" style={{ marginLeft: '4px' }}>Assumption</span>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
                    {sp.absorption_rate_text}
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '280px' }}>{sp.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Range Not Sourced Distinct Group */}
        {categorizedSpecies.unsourced.length > 0 && (
          <div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '16px', margin: 0, color: 'var(--ink)' }}>
                Range not sourced ({categorizedSpecies.unsourced.length} Species)
              </h4>
              <span className="tag-badge-unverified">Unverified</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', maxWidth: '72ch' }}>
              The following native species candidates do not currently have published agro-climatic precipitation intervals recorded in the candidate inventory. They are listed separately to prevent silent exclusion.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="hairline-table" style={{ width: '100%', minWidth: '700px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                    <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>ID</th>
                    <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Common Name</th>
                    <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Scientific Name</th>
                    <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Broad Zone Hint</th>
                    <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Rainfall Range</th>
                    <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Absorption Rate</th>
                    <th style={{ padding: '8px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Ecological Role</th>
                  </tr>
                </thead>
                <tbody>
                  {categorizedSpecies.unsourced.map((sp) => (
                    <tr key={sp.species_id}>
                      <td style={{ color: 'var(--muted)', fontSize: '12px' }}>#{sp.species_id}</td>
                      <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{sp.name}</td>
                      <td style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '13px' }}>{sp.scientific_name}</td>
                      <td style={{ fontSize: '13px' }}>
                        {sp.broad_zone_hint} <span className="tag-badge-unverified" style={{ marginLeft: '4px' }}>Unverified</span>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
                        Range not sourced
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
                        {sp.absorption_rate_text}
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '280px' }}>{sp.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
