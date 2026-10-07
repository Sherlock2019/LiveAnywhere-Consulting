"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Play, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { DemoTourBar, useDemoTour } from "@/components/demo-tour";
import { RaniAssistant } from "@/components/rani";
import { Button } from "@/components/ui/button";

const primaryNav = [
  ["Plan my move", "/plan"],
  ["Destinations", "/destinations"],
  ["Visas", "/visas"],
  ["Services", "/services"],
  ["Housing", "/housing"],
  ["Jobs", "/jobs"],
  ["For business", "/corporate"],
  ["Pricing", "/pricing"],
];

const footerGroups = [
  { title: "Plan", links: [["Plan my move", "/plan"], ["Destinations", "/destinations"], ["Visa explorer", "/visas"], ["Compare options", "/destinations#compare"]] },
  { title: "Services", links: [["All services", "/services"], ["Housing", "/housing"], ["Jobs", "/jobs"], ["Partners", "/partners"]] },
  { title: "Life goals", links: [["Retire", "/retire"], ["Work", "/work"], ["Invest", "/invest"], ["Family", "/family"], ["Study", "/study"]] },
  { title: "Company", links: [["About", "/about"], ["Corporate", "/corporate"], ["Contact", "/contact"], ["Demo dashboard", "/dashboard"]] },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const tour = useDemoTour();

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {primaryNav.map(([label, href]) => (
              <Link key={href} className={pathname === href ? "is-active" : ""} href={href}>{label}</Link>
            ))}
          </nav>
          <div className="site-header__actions">
            <Button variant="secondary" size="sm" className="run-demo" onClick={() => { setMobileOpen(false); tour.start(); }}><Play /> Run demo</Button>
            <Button asChild variant="gold" size="sm" className="start-move"><Link href="/plan">Start my move</Link></Button>
            <button className="mobile-menu-button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="mobile-nav" aria-label={mobileOpen ? "Close menu" : "Open menu"}>
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav className={`mobile-nav ${mobileOpen ? "is-open" : ""}`} id="mobile-nav" aria-label="Mobile navigation">
          {primaryNav.map(([label, href]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</Link>)}
          <Button asChild variant="gold"><Link href="/plan" onClick={() => setMobileOpen(false)}>Start my move</Link></Button>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div className="site-footer__brand">
            <BrandMark />
            <p>Move. Work. Live. Retire. Anywhere.</p>
            <p className="site-footer__operator">A relocation platform by LiveAnywhere Consulting.</p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title} className="site-footer__col">
              <h2>{group.title}</h2>
              {group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </div>
          ))}
        </div>
        <div className="container site-footer__legal">
          <p>Relocate Anywhere Network provides relocation, technology, administrative and coordination services. Immigration and legal information is general information, not legal advice. Licensed independent professionals provide legal advice or representation where required. Laws and policies change frequently and eligibility depends on individual circumstances.</p>
          <p>© {new Date().getFullYear()} LiveAnywhere Consulting · English · Tiếng Việt (coming next)</p>
        </div>
      </footer>
      <DemoTourBar tour={tour} />
      <RaniAssistant />
      <div className="mobile-bottom-cta"><Button asChild variant="gold"><Link href="/plan">Start my move</Link></Button></div>
    </>
  );
}
