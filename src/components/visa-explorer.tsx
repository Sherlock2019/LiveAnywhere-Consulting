"use client";

import Link from "next/link";
import { ExternalLink, Filter, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { visaRoutes } from "@/data/visa-routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusVariant = { available: "available", possible: "possible", review: "review", proposed: "proposed", unavailable: "default" } as const;

export function VisaExplorer({ compact = false, destination = "vietnam" }: { compact?: boolean; destination?: string }) {
  const [goal, setGoal] = useState("all");
  const items = useMemo(() => visaRoutes.filter((route) => route.destinationCountry === destination && (goal === "all" || route.purposes.includes(goal))), [destination, goal]);
  const displayed = compact ? items.slice(0, 4) : items;

  return (
    <div className="visa-explorer">
      <div className="visa-filter">
        <span><Filter /> Filter by goal</span>
        {["all", "retire", "work", "invest", "family", "study"].map((item) => <button key={item} className={goal === item ? "is-active" : ""} onClick={() => setGoal(item)}>{item === "all" ? "All routes" : item}</button>)}
      </div>
      <div className="visa-grid">
        {displayed.length ? displayed.map((route) => (
          <article className="visa-card" key={route.id}>
            <div className="visa-card__top"><Badge variant={statusVariant[route.publicStatus]}>{route.publicStatus === "unavailable" ? "Not currently available" : route.publicStatus}</Badge><span>{route.routeCode}</span></div>
            <h3>{route.routeName}</h3>
            <p>{route.summary}</p>
            <dl><div><dt>Typical duration</dt><dd>{route.typicalDuration}</dd></div><div><dt>Work authorization</dt><dd>{route.workAllowed === true ? "Route dependent" : route.workAllowed === false ? "No" : "Review required"}</dd></div></dl>
            <div className="visa-card__source"><ShieldCheck /><span>Last verified {route.lastVerified}<a href={route.officialSources[0].url} target="_blank" rel="noreferrer">Official source <ExternalLink /></a></span></div>
            <Button asChild variant="secondary" size="sm"><Link href={`/visas/${route.destinationCountry}/${route.id}`}>View details</Link></Button>
          </article>
        )) : <div className="empty-state"><h3>No route cards match this filter.</h3><p>Try another goal or request a professional review.</p></div>}
      </div>
      {compact ? <Button asChild variant="secondary"><Link href="/visas">Open the visa explorer</Link></Button> : null}
      <p className="legal-note">This explorer organizes general information. It does not determine eligibility or provide legal advice.</p>
    </div>
  );
}
