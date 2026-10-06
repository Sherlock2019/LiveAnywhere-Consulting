"use client";

import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, Check, Filter, Heart, MapPin, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { jobs, properties } from "@/data/marketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function HousingMarketplace() {
  const [city, setCity] = useState("All cities");
  const [maxRent, setMaxRent] = useState(2000);
  const [beds, setBeds] = useState(1);
  const [pets, setPets] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const matches = useMemo(() => properties.filter((property) => (city === "All cities" || property.city === city) && property.rent <= maxRent && property.beds >= beds && (!pets || property.pets)), [city, maxRent, beds, pets]);

  return <div className="market-layout"><aside className="market-filters"><p className="eyebrow"><Filter /> Housing filters</p><label><span>City</span><select value={city} onChange={(event) => setCity(event.target.value)}>{["All cities", "Da Nang", "Ho Chi Minh City", "Hanoi"].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Maximum monthly rent <strong>{money.format(maxRent)}</strong></span><input type="range" min="700" max="4000" step="100" value={maxRent} onChange={(event) => setMaxRent(Number(event.target.value))} /></label><label><span>Minimum bedrooms</span><select value={beds} onChange={(event) => setBeds(Number(event.target.value))}><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></label><label className="check-field"><input type="checkbox" checked={pets} onChange={(event) => setPets(event.target.checked)} /><span>Pets allowed</span></label><Badge variant="review">Mock listings</Badge></aside><div><div className="market-results-head"><div><h2>{matches.length} homes match</h2><p>Illustrative listings for product demonstration only.</p></div><span><MapPin /> Vietnam launch cities</span></div>{matches.length ? <div className="listing-grid">{matches.map((property) => <article key={property.id} className="property-card"><div className="property-card__image"><Image src={property.image} alt="Illustrative city view" fill sizes="(max-width: 800px) 90vw, 33vw" /><Badge variant="review">Mock listing</Badge><button onClick={() => setSaved((items) => items.includes(property.id) ? items.filter((id) => id !== property.id) : [...items, property.id])} aria-label={saved.includes(property.id) ? "Remove saved property" : "Save property"} className={saved.includes(property.id) ? "is-saved" : ""}><Heart /></button></div><div className="property-card__body"><div><strong>{money.format(property.rent)}/mo</strong><span>{property.beds} bed · {property.type}</span></div><h3>{property.title}</h3><p><MapPin /> {property.neighborhood}, {property.city}</p><ul><li>{property.furnished ? "Furnished" : "Unfurnished"}</li><li>{property.pets ? "Pets considered" : "No pets listed"}</li></ul><Button variant="secondary" onClick={() => setSaved((items) => items.includes(property.id) ? items : [...items, property.id])}>{saved.includes(property.id) ? <><Check /> Added to my move</> : "Add to my move"}</Button></div></article>)}</div> : <div className="empty-state"><Search /><h3>No homes match these filters.</h3><p>Raise the rent range or broaden your city selection.</p></div>}</div></div>;
}

export function JobsMarketplace() {
  const [city, setCity] = useState("All cities");
  const [remote, setRemote] = useState("Any");
  const [sponsorship, setSponsorship] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const matches = useMemo(() => jobs.filter((job) => (city === "All cities" || job.city === city) && (remote === "Any" || job.remote === remote) && (!sponsorship || ["Yes", "Possible"].includes(job.sponsorship))), [city, remote, sponsorship]);

  return <div className="market-layout"><aside className="market-filters"><p className="eyebrow"><Filter /> Job filters</p><label><span>City</span><select value={city} onChange={(event) => setCity(event.target.value)}>{["All cities", "Ho Chi Minh City", "Da Nang", "Hanoi", "Remote"].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Work style</span><select value={remote} onChange={(event) => setRemote(event.target.value)}><option>Any</option><option>On-site</option><option>Hybrid</option><option>Remote</option></select></label><label className="check-field"><input type="checkbox" checked={sponsorship} onChange={(event) => setSponsorship(event.target.checked)} /><span>Show sponsorship possibilities</span></label><Badge variant="review">Mock jobs</Badge></aside><div><div className="market-results-head"><div><h2>{matches.length} roles match</h2><p>No employment or visa outcome is guaranteed.</p></div><span><BriefcaseBusiness /> Vietnam opportunities</span></div>{matches.length ? <div className="job-list">{matches.map((job) => <article key={job.id}><div className="job-logo">{job.company.slice(0, 2).toUpperCase()}</div><div><Badge variant="review">Mock job</Badge><h3>{job.title}</h3><p>{job.company} · {job.city} · {job.remote}</p><strong>{job.salary}</strong></div><div className="job-sponsor"><span>Visa sponsorship</span><Badge variant={job.sponsorship === "Possible" ? "possible" : "default"}>{job.sponsorship}</Badge><Button size="sm" variant="secondary" onClick={() => setSaved((items) => items.includes(job.id) ? items : [...items, job.id])}>{saved.includes(job.id) ? <><Check /> Added</> : "Add to move plan"}</Button></div></article>)}</div> : <div className="empty-state"><Search /><h3>No roles match these filters.</h3><p>Broaden the location or work-style filter.</p></div>}<div className="job-help"><ShieldCheck /><div><h3>Need job and visa coordination?</h3><p>We can organize CV localization, job search and professional route review as separate tracks.</p></div><Button asChild><Link href="/contact?topic=job-assistance">Get job assistance</Link></Button></div></div></div>;
}
