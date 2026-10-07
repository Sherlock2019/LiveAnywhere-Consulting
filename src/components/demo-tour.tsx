"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const STEP_MS = 8000;
const TICK_MS = 100;

const demoResults = new URLSearchParams({ origin: "usa", destination: "vietnam", goal: "retire", people: "2", monthlyBudget: "4000", relocationBudget: "100000", timeframe: "2027-03-15", duration: "permanent", assessed: "true" });

export const demoSteps = [
  { href: "/", title: "Start with a route", description: "Search a move by origin, destination, goal and budget from the home page." },
  { href: "/plan", title: "Relocation assessment", description: "A nine-step wizard captures household, goals, money, work, lifestyle and timeline." },
  { href: `/results?${demoResults.toString()}`, title: "Personal relocation plan", description: "Readiness score, possible routes, city what-ifs and a move timeline for USA → Vietnam." },
  { href: "/destinations", title: "Destinations", description: "Compare countries and cities by lifestyle and illustrative monthly budget." },
  { href: "/visas", title: "Visa explorer", description: "Source-dated route categories with public status and official links." },
  { href: "/services", title: "Services", description: "Relocation services that attach to a single move plan." },
  { href: "/housing", title: "Housing marketplace", description: "Filter illustrative homes by city, price, bedrooms and pets." },
  { href: "/jobs", title: "Job marketplace", description: "Mock roles with sponsorship signals and work-mode filters." },
  { href: "/partners", title: "Professional network", description: "Local specialists connected to the move plan. Demo partners are fictional." },
  { href: "/pricing", title: "Pricing", description: "Packages from first assessment through full relocation management." },
  { href: "/corporate", title: "For business", description: "Employee relocation programs for corporate teams." },
  { href: "/dashboard", title: "Customer dashboard", description: "Every task, document and message for the demo household in one place." },
  { href: "/admin", title: "Admin", description: "Source dates and review states keep time-sensitive information accountable." },
];

export function useDemoTour() {
  const router = useRouter();
  const [step, setStep] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);

  const go = useCallback((index: number) => {
    elapsedRef.current = 0;
    setElapsed(0);
    setStep(index);
    router.push(demoSteps[index].href);
  }, [router]);

  const start = useCallback(() => { setPlaying(true); go(0); }, [go]);
  const stop = useCallback(() => { setPlaying(false); setStep(null); }, []);
  const finished = step === demoSteps.length - 1 && elapsed >= STEP_MS;
  const toggle = () => (finished ? start() : setPlaying((value) => !value));

  useEffect(() => {
    if (step === null || !playing) return;
    const id = setInterval(() => {
      elapsedRef.current += TICK_MS;
      if (elapsedRef.current < STEP_MS) return setElapsed(elapsedRef.current);
      if (step < demoSteps.length - 1) return go(step + 1);
      setElapsed(STEP_MS);
      setPlaying(false);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [step, playing, go]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") stop(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, stop]);

  return { step, playing, finished, progress: Math.min(1, elapsed / STEP_MS), start, stop, go, toggle };
}

export function DemoTourBar({ tour }: { tour: ReturnType<typeof useDemoTour> }) {
  if (tour.step === null) return null;
  const index = tour.step;
  const current = demoSteps[index];

  return (
    <aside className="demo-tour" aria-label="Guided demo">
      <div className="demo-tour__progress" aria-hidden="true">
        {demoSteps.map((item, position) => <span key={item.href}><i style={{ width: `${position < index ? 100 : position === index ? tour.progress * 100 : 0}%` }} /></span>)}
      </div>
      <div className="demo-tour__body">
        <div className="demo-tour__copy" aria-live="polite">
          <small>Demo · {index + 1} of {demoSteps.length}</small>
          <strong>{current.title}</strong>
          <p>{current.description}</p>
        </div>
        <div className="demo-tour__controls">
          <button onClick={() => tour.go(index - 1)} disabled={index === 0} aria-label="Previous step"><ChevronLeft /></button>
          <button onClick={tour.toggle} aria-label={tour.finished ? "Restart demo" : tour.playing ? "Pause demo" : "Resume demo"}>{tour.finished ? <RotateCcw /> : tour.playing ? <Pause /> : <Play />}</button>
          <button onClick={() => tour.go(index + 1)} disabled={index === demoSteps.length - 1} aria-label="Next step"><ChevronRight /></button>
          <button onClick={tour.stop} aria-label="Exit demo"><X /></button>
        </div>
      </div>
    </aside>
  );
}
