"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, Bot, Building2, Check, Globe2, Headphones, PlaneTakeoff, ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { countries, cities, countryById } from "@/data/countries";
import { goals, journeySteps, pricing, services, statItems } from "@/data/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { defaultMoveSearch, RelocationSearch, type MoveSearchState } from "@/components/relocation-search";
import { SectionHeading } from "@/components/section-heading";
import { VisaExplorer } from "@/components/visa-explorer";
import { BudgetCalculator } from "@/components/budget-calculator";
import { DashboardPreview } from "@/components/dashboard-preview";

const RouteMap = dynamic(() => import("@/components/route-map"), { ssr: false, loading: () => <div className="map-loading">Preparing your route map…</div> });
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function HomePage() {
  const router = useRouter();
  const [move, setMove] = useState<MoveSearchState>(defaultMoveSearch);
  const origin = countryById(move.originCountry);
  const destination = countryById(move.destinationCountry);

  const buildMove = () => {
    localStorage.setItem("ran-move", JSON.stringify(move));
    const params = new URLSearchParams({ origin: move.originCountry, destination: move.destinationCountry, goal: move.goal, people: String(move.adults + move.children), monthlyBudget: String(move.monthlyBudget), relocationBudget: String(move.relocationBudget), timeframe: move.moveDate, duration: move.duration });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__grid">
          <motion.div className="home-hero__copy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Badge variant="possible"><Globe2 /> USA ↔ Vietnam launch routes</Badge>
            <h1>Where do you want your <span>next life</span> to begin?</h1>
            <p className="home-hero__tagline">Move. Work. Live. Retire. Anywhere.</p>
            <p>Tell us where you are, where you want to go and what you want your new life to look like. We’ll build the bridge from visa strategy to your new front door.</p>
            <div className="home-hero__proof"><span><ShieldCheck /> Professional review built in</span><span><UserRoundCheck /> One relocation manager</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}>
            <RelocationSearch value={move} onChange={setMove} onBuild={buildMove} condensed />
          </motion.div>
        </div>
      </section>

      <section className="section route-planner-section">
        <div className="container">
          <div className="route-planner-heading"><div><p className="eyebrow">Your relocation bridge</p><h2>{origin.shortName} to {destination.shortName}</h2><p>{goals.find((goal) => goal.id === move.goal)?.label} · {move.adults + move.children} people · {move.duration.replaceAll("-", " ")} · {money.format(move.monthlyBudget)}/month</p></div><Badge variant="review">Map responds to your search</Badge></div>
          <RouteMap originId={move.originCountry} destinationId={move.destinationCountry} onCountryClick={(id) => id !== move.originCountry && setMove({ ...move, destinationCountry: id })} />
          <div className="quick-result">
            <div><span className="eyebrow">Quick result</span><h3>Here’s what moving from {origin.shortName} to {destination.shortName} could involve.</h3></div>
            <div className="quick-result__metrics"><span><strong>{move.destinationCountry === "vietnam" ? "5" : "8"}</strong> route categories</span><span><strong>{money.format(move.destinationCountry === "vietnam" ? 18400 : 32800)}</strong> estimated cash to move</span><span><strong>{move.destinationCountry === "vietnam" ? "Da Nang" : "Professional review"}</strong> recommended starting point</span><Button onClick={buildMove}>See my complete plan</Button></div>
          </div>
        </div>
      </section>

      <section className="section section--tight"><div className="container"><div className="stat-bar">{statItems.map(([value, label, note]) => <div key={label}><strong>{value}</strong><span>{label}</span><small>{note}</small></div>)}</div></div></section>

      <section className="section section--alt" id="goals"><div className="container"><SectionHeading eyebrow="Start with your life" title="Why are you moving?" description="Choose a goal you understand. We translate it into a relocation plan and potential route categories." /><div className="goal-grid">{goals.slice(0, 7).map((goal) => <button key={goal.id} className={move.goal === goal.id ? "is-selected" : ""} onClick={() => setMove({ ...move, goal: goal.id })}><span>{goal.icon}</span><strong>{goal.label}</strong><small>{goal.id === "retire" ? "Lifestyle, healthcare and long-stay planning" : goal.id === "work" ? "Jobs, sponsorship and arrival support" : "A move plan shaped around this goal"}</small></button>)}</div></div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="From visa to your new front door" title="One company for your whole move" description="Every service connects to the same plan, budget and relocation manager." /><div className="service-grid">{services.map((service) => <Link key={service.id} href={`/services/${service.id}`} className="service-card"><span><service.icon /></span><h3>{service.name}</h3><p>{service.note}</p></Link>)}</div></div></section>

      <section className="section section--alt"><div className="container"><SectionHeading eyebrow="Your relocation journey" title="Dream → assess → visa → prepare → move → settle → live" description="A clear sequence turns a complicated international move into manageable decisions." /><ol className="journey-rail">{journeySteps.map(([number, title, description]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></li>)}</ol></div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Popular moves" title="Start with a route we know" description="USA ↔ Vietnam is fully modeled for the launch demo. Other routes are clearly marked as general information." /><div className="move-card-grid"><Link href="/move/usa/vietnam" className="move-card move-card--live"><span>🇺🇸 <ArrowRightLeft /> 🇻🇳</span><h3>USA → Vietnam</h3><p>Retire · Work · Invest · Family</p><Badge variant="available">Launch route</Badge></Link><Link href="/move/vietnam/usa" className="move-card move-card--live"><span>🇻🇳 <ArrowRightLeft /> 🇺🇸</span><h3>Vietnam → USA</h3><p>Work · Family · Study · Invest</p><Badge variant="available">Launch route</Badge></Link><Link href="/move/usa/thailand" className="move-card"><span>🇺🇸 <ArrowRightLeft /> 🇹🇭</span><h3>USA → Thailand</h3><p>Retire · Remote work · Lifestyle</p><Badge>Coming soon</Badge></Link></div></div></section>

      <section className="section section--alt"><div className="container"><SectionHeading eyebrow="Destination explorer" title="Where could your life go?" description="Compare lifestyle fit first. Immigration recommendations stay separate and professionally reviewed." /><div className="destination-grid">{cities.slice(0, 3).map((city) => <Link href={`/destinations/vietnam/${city.id}`} className="destination-card" key={city.id}><div className="destination-card__image"><Image src={city.image} alt={`${city.name}, Vietnam`} fill sizes="(max-width: 800px) 90vw, 33vw" /></div><div className="destination-card__body"><div><Badge variant="review">Mock estimate</Badge><span>{money.format(city.monthlyBudget[0])}–{money.format(city.monthlyBudget[1])}/mo</span></div><h3>{city.name}</h3><p>{city.tagline}</p><ul>{city.highlights.slice(0, 3).map((highlight) => <li key={highlight}><Check /> {highlight}</li>)}</ul></div></Link>)}</div><div className="country-strip">{countries.map((country) => <Link key={country.id} href={`/destinations/${country.id}`}><span>{country.flag}</span><strong>{country.name}</strong><small>{country.launch ? "Detailed launch guide" : country.note}</small></Link>)}</div></div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Visa & immigration explorer" title="Potential pathways, explained in plain language" description="We show source dates, route status and where a qualified professional must make the call." /><VisaExplorer compact /></div></section>

      <section className="section section--alt"><div className="container"><SectionHeading eyebrow="Smart budget" title="Know what the move could require" description="Adjust the inputs to build a realistic first planning range." /><BudgetCalculator /></div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="One move dashboard" title="Every task, document and decision in one place" description="The demo dashboard shows how a customer and relocation manager stay aligned." /><DashboardPreview /><div className="center-action"><Button asChild variant="secondary"><Link href="/dashboard">Open demo dashboard</Link></Button></div></div></section>

      <section className="section section--alt"><div className="container"><SectionHeading eyebrow="Human + AI" title="Technology organizes the move. People handle the important decisions." /><div className="support-model"><article><span><Bot /></span><h3>RANI assistant</h3><p>Turns your plan into clear questions, missing documents and next actions.</p><Badge variant="possible">General information</Badge></article><article><span><Headphones /></span><h3>Relocation manager</h3><p>Your single point of contact across partners, timeline and arrival.</p><Badge variant="premium">Human support</Badge></article><article><span><ShieldCheck /></span><h3>Licensed professionals</h3><p>Independent qualified specialists confirm legal, tax and regulated advice.</p><Badge variant="review">Professional review</Badge></article></div></div></section>

      <section className="section"><div className="container"><SectionHeading eyebrow="Pricing" title="Choose how much coordination you need" description="Illustrative launch pricing. Final scopes and third-party fees are confirmed before engagement." /><div className="pricing-grid">{pricing.map((tier) => <article key={tier.name} className={tier.featured ? "is-featured" : ""}>{tier.featured ? <Badge variant="premium">Most complete</Badge> : null}<h3>{tier.name}</h3><strong>{tier.price}</strong><p>{tier.lead}</p><ul>{tier.features.map((feature) => <li key={feature}><Check /> {feature}</li>)}</ul><Button asChild variant={tier.featured ? "gold" : "secondary"}><Link href={`/contact?plan=${tier.name.toLowerCase().replaceAll(" ", "-")}`}>Choose {tier.name}</Link></Button></article>)}</div><p className="ran-life"><Sparkles /> <strong>RAN Life · $99/month example</strong><span>Ongoing reminders, administration help, healthcare navigation and local concierge.</span></p></div></section>

      <section className="corporate-band"><div className="container"><div><Badge variant="premium"><Building2 /> Corporate relocation</Badge><h2>Move one employee—or a whole team—with one accountable program.</h2><p>Immigration coordination, housing, schools, moving, destination orientation, compliance handoffs and consolidated reporting.</p><Button asChild variant="gold"><Link href="/corporate">Relocate my team</Link></Button></div><div className="corporate-numbers"><span><strong>1</strong>employee</span><span><strong>10</strong>employees</span><span><strong>100+</strong>employees</span></div></div></section>

      <section className="final-cta"><div className="container"><div><p className="eyebrow">Your next life starts with two places</p><h2>Where do you want your next life to begin?</h2><p>Pick an origin. Pick a destination. We’ll build the bridge between them.</p></div><div className="final-route"><span>{origin.flag} {origin.shortName}</span><PlaneTakeoff /><span>{destination.flag} {destination.shortName}</span><Button onClick={buildMove} variant="gold">Start my move</Button></div></div></section>
    </>
  );
}
