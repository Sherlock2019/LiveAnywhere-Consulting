"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarDays, Check, CircleDollarSign, ClipboardCheck, FileText, HeartPulse, Home, Landmark, MapPin, Plane, Save, ShipWheel, Stethoscope, WalletCards } from "lucide-react";
import { assessMove, type AssessmentInput } from "@/lib/assessment";
import { cities, countryById } from "@/data/countries";
import { goals } from "@/data/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const RouteMap = dynamic(() => import("@/components/route-map"), { ssr: false, loading: () => <div className="map-loading">Building your route…</div> });
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const statusVariant = { available: "available", possible: "possible", review: "review", proposed: "proposed", unavailable: "default" } as const;

const timelineSeed = [
  ["Immigration plan", FileText], ["Legal documents", ClipboardCheck], ["Find home", Home], ["Prepare move", ShipWheel], ["Fly", Plane], ["Arrival setup", MapPin], ["Healthcare", Stethoscope], ["Banking", Landmark], ["Settled", Check],
] as const;

export function ResultsPage() {
  const params = useSearchParams();
  const input: AssessmentInput = useMemo(() => ({
    origin: params.get("origin") ?? "usa",
    destination: params.get("destination") ?? "vietnam",
    goals: [params.get("goal") ?? "retire"],
    adults: Math.max(1, Number(params.get("people") ?? 2)),
    children: 0,
    pets: 0,
    monthlyBudget: Number(params.get("monthlyBudget") ?? 4000),
    relocationBudget: Number(params.get("relocationBudget") ?? 100000),
    timeframe: params.get("timeframe") ?? "3-6-months",
    duration: params.get("duration") ?? "permanent",
    employment: params.get("goal") === "work" ? "Professional" : undefined,
  }), [params]);
  const result = useMemo(() => assessMove(input), [input]);
  const [cityId, setCityId] = useState(input.destination === "vietnam" ? "da-nang" : "help-me-choose");
  const [completed, setCompleted] = useState([0, 1, 2]);
  const [saved, setSaved] = useState(false);
  const origin = countryById(input.origin);
  const destination = countryById(input.destination);
  const goal = goals.find((item) => item.id === input.goals[0]);
  const progress = Math.round((completed.length / timelineSeed.length) * 100);
  const routeCities = input.destination === "vietnam" ? cities.filter((city) => city.countryId === "vietnam") : [];

  const save = () => {
    localStorage.setItem("ran-saved-result", JSON.stringify({ input, cityId, savedAt: new Date().toISOString() }));
    setSaved(true);
  };

  return (
    <div className="results-page">
      <section className="result-hero">
        <div className="container">
          <div className="result-ticket">
            <div className="result-ticket__main">
              <p className="eyebrow">Your personal relocation plan</p>
              <div className="result-ticket__route"><span><b>{origin.flag}</b><small>From</small><strong>{origin.shortName}</strong></span><div><Plane /><i /></div><span><b>{destination.flag}</b><small>To</small><strong>{destination.shortName}</strong></span></div>
              <div className="result-ticket__facts"><span><small>People</small><strong>{input.adults + input.children}</strong></span><span><small>Goal</small><strong>{goal?.label}</strong></span><span><small>Move</small><strong>{input.timeframe.replaceAll("-", " ")}</strong></span><span><small>Life budget</small><strong>{money.format(input.monthlyBudget)}/mo</strong></span></div>
            </div>
            <aside className="readiness-score"><span>Relocation readiness</span><strong>{result.score}<small>/100</small></strong><Progress value={result.score} /><p>Informational planning score—not a legal eligibility score.</p></aside>
          </div>
        </div>
      </section>

      <section className="section section--tight"><div className="container"><div className="result-actions"><div><Badge variant="possible">AI-generated summary</Badge><p>This plan combines your answers with mock cost data and source-linked route categories.</p></div><div><Button variant="secondary" onClick={save}><Save /> {saved ? "Move saved" : "Save my move"}</Button><Button asChild><Link href="/contact?topic=assessment">Book relocation assessment</Link></Button></div></div></div></section>

      <section className="section section--alt"><div className="container result-map-grid"><div><p className="eyebrow">Your route</p><h2>From here to settled</h2><p className="lead-copy">Your plan connects immigration, documents, housing, logistics, arrival and everyday life in one sequence.</p><div className="result-summary-grid"><div><CircleDollarSign /><span>Estimated cash to move<strong>{money.format(result.estimatedCashToMove)}</strong></span></div><div><WalletCards /><span>Estimated monthly life<strong>{money.format(result.estimatedMonthlyLife)}</strong></span></div><div><CalendarDays /><span>Next action<strong>Professional route review</strong></span></div></div></div><RouteMap originId={input.origin} destinationId={input.destination} compact /></div></section>

      <section className="section"><div className="container result-columns"><div><p className="eyebrow">Possible immigration routes</p><h2>What the information you provided may point toward</h2><div className="result-routes">{result.routes.map((route) => <article key={route.id}><div><Badge variant={statusVariant[route.publicStatus]}>{route.publicStatus === "unavailable" ? "Not currently available" : route.publicStatus}</Badge><span>{route.routeCode}</span></div><h3>{route.routeName}</h3><p>{route.summary}</p><small>Last verified {route.lastVerified} · <a href={route.officialSources[0].url} target="_blank" rel="noreferrer">Official source</a></small></article>)}</div></div><aside className="next-action-card"><span><HeartPulse /></span><p className="eyebrow">Recommended next action</p><h3>Validate the lawful pathway before you commit money.</h3><p>{result.nextAction}</p><Button asChild variant="gold"><Link href="/contact?topic=professional-review">Request professional review</Link></Button></aside></div></section>

      {routeCities.length ? <section className="section section--alt"><div className="container"><div className="what-if-head"><div><p className="eyebrow">What if?</p><h2>Choose a different Vietnam base</h2><p>Changing the city updates lifestyle and budget guidance. It does not change immigration eligibility.</p></div><label><span>Try another city</span><select value={cityId} onChange={(event) => setCityId(event.target.value)}>{routeCities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></label></div><div className="city-comparison">{routeCities.slice(0, 3).map((city) => <button key={city.id} onClick={() => setCityId(city.id)} className={cityId === city.id ? "is-selected" : ""}><span>{cityId === city.id ? <Check /> : <MapPin />}</span><h3>{city.name}</h3><p>{city.tagline}</p><strong>{money.format(city.monthlyBudget[0])}–{money.format(city.monthlyBudget[1])}/month</strong></button>)}</div></div></section> : null}

      <section className="section"><div className="container"><div className="timeline-heading"><div><p className="eyebrow">Your move timeline</p><h2>{progress}% ready</h2><p>Tap a stage to mark it complete and see the plan respond.</p></div><Progress value={progress} /></div><ol className="move-timeline">{timelineSeed.map(([label, Icon], index) => { const done = completed.includes(index); return <li key={label}><button onClick={() => setCompleted(done ? completed.filter((item) => item !== index) : [...completed, index])} aria-pressed={done} className={done ? "is-done" : ""}><span>{done ? <Check /> : <Icon />}</span><strong>{label}</strong><small>{done ? "Ready" : index === completed.length ? "Next" : "Planned"}</small></button></li>; })}</ol></div></section>

      <section className="section section--alt"><div className="container"><p className="eyebrow">Readiness breakdown</p><h2>Where the plan is strong—and where it needs work</h2><div className="readiness-grid">{Object.entries(result.dimensions).map(([label, value]) => <Progress key={label} value={value} label={label[0].toUpperCase() + label.slice(1)} />)}</div></div></section>
    </div>
  );
}
