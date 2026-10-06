"use client";

import { Minus, Plus, Repeat2 } from "lucide-react";
import { countries, cities } from "@/data/countries";
import { goals } from "@/data/content";
import { Button } from "@/components/ui/button";

export type MoveSearchState = {
  originCountry: string;
  originCity: string;
  nationalities: string;
  destinationCountry: string;
  destinationCity: string;
  adults: number;
  children: number;
  pets: number;
  goal: string;
  moveDate: string;
  duration: string;
  monthlyBudget: number;
  relocationBudget: number;
};

export const defaultMoveSearch: MoveSearchState = {
  originCountry: "usa",
  originCity: "San Francisco",
  nationalities: "United States",
  destinationCountry: "vietnam",
  destinationCity: "da-nang",
  adults: 2,
  children: 0,
  pets: 0,
  goal: "retire",
  moveDate: "3-6-months",
  duration: "permanent",
  monthlyBudget: 4000,
  relocationBudget: 100000,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function RelocationSearch({ value, onChange, onBuild, condensed = false }: {
  value: MoveSearchState;
  onChange: (next: MoveSearchState) => void;
  onBuild: () => void;
  condensed?: boolean;
}) {
  const update = <K extends keyof MoveSearchState>(key: K, next: MoveSearchState[K]) => onChange({ ...value, [key]: next });
  const swap = () => onChange({
    ...value,
    originCountry: value.destinationCountry,
    destinationCountry: value.originCountry,
    originCity: value.destinationCountry === "vietnam" ? "Da Nang" : "Ho Chi Minh City",
    destinationCity: value.originCountry === "vietnam" ? "da-nang" : "help-me-choose",
    goal: value.destinationCountry === "vietnam" ? "work" : "retire",
  });
  const destinationCities = cities.filter((city) => city.countryId === value.destinationCountry);

  return (
    <div className={`relocation-search ${condensed ? "relocation-search--condensed" : ""}`}>
      <div className="relocation-search__head">
        <div><span className="eyebrow">Plan your move</span><h2>Build your route</h2></div>
        <span className="search-duration">About 30 seconds</span>
      </div>
      <div className="route-fields">
        <label className="route-field">
          <span>From</span>
          <select value={value.originCountry} onChange={(event) => update("originCountry", event.target.value)} aria-label="Origin country">
            {countries.map((country) => <option key={country.id} value={country.id}>{country.flag} {country.name}</option>)}
          </select>
          <input value={value.originCity} onChange={(event) => update("originCity", event.target.value)} aria-label="Current city" placeholder="Current city" />
        </label>
        <button className="swap-button" onClick={swap} type="button" aria-label="Swap origin and destination"><Repeat2 /></button>
        <label className="route-field">
          <span>To</span>
          <select value={value.destinationCountry} onChange={(event) => update("destinationCountry", event.target.value)} aria-label="Destination country">
            {countries.map((country) => <option key={country.id} value={country.id}>{country.flag} {country.name}</option>)}
          </select>
          <select value={value.destinationCity} onChange={(event) => update("destinationCity", event.target.value)} aria-label="Destination city">
            <option value="help-me-choose">Help me choose a city</option>
            {destinationCities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
        </label>
      </div>
      <div className="search-grid">
        <fieldset className="people-control">
          <legend>People</legend>
          <div>
            <button type="button" onClick={() => update("adults", Math.max(1, value.adults - 1))} aria-label="Remove adult"><Minus /></button>
            <span><strong>{value.adults}</strong> {value.adults === 1 ? "adult" : "adults"}</span>
            <button type="button" onClick={() => update("adults", Math.min(8, value.adults + 1))} aria-label="Add adult"><Plus /></button>
          </div>
        </fieldset>
        <label><span>When</span><select value={value.moveDate} onChange={(event) => update("moveDate", event.target.value)}><option value="asap">ASAP</option><option value="0-3-months">0–3 months</option><option value="3-6-months">3–6 months</option><option value="6-12-months">6–12 months</option><option value="1-2-years">1–2 years</option><option value="researching">Just researching</option></select></label>
        <label><span>Stay</span><select value={value.duration} onChange={(event) => update("duration", event.target.value)}><option value="under-90-days">Under 90 days</option><option value="3-6-months">3–6 months</option><option value="6-12-months">6–12 months</option><option value="1-3-years">1–3 years</option><option value="permanent">Permanent / long-term</option><option value="unsure">Not sure</option></select></label>
      </div>
      <fieldset className="goal-picker">
        <legend>Why are you moving?</legend>
        <div>
          {goals.slice(0, condensed ? 7 : goals.length).map((goal) => (
            <button key={goal.id} type="button" className={value.goal === goal.id ? "is-selected" : ""} onClick={() => update("goal", goal.id)} aria-pressed={value.goal === goal.id}>
              <span aria-hidden="true">{goal.icon}</span>{goal.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="budget-grid">
        <label>
          <span>Monthly living budget <strong>{formatCurrency(value.monthlyBudget)}</strong></span>
          <input type="range" min="1000" max="12000" step="250" value={value.monthlyBudget} onChange={(event) => update("monthlyBudget", Number(event.target.value))} />
        </label>
        <label>
          <span>Move / investment budget <strong>{formatCurrency(value.relocationBudget)}</strong></span>
          <input type="range" min="5000" max="1000000" step="5000" value={value.relocationBudget} onChange={(event) => update("relocationBudget", Number(event.target.value))} />
        </label>
      </div>
      <Button onClick={onBuild} size="lg" className="build-move-button">Build my move</Button>
      <p className="search-disclaimer">Informational planning only. Immigration matches require professional review.</p>
    </div>
  );
}
