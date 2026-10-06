import type { Metadata } from "next";
import { Suspense } from "react";
import { AssessmentWizard } from "@/components/assessment-wizard";
import { ResultsPage } from "@/components/results-page";
import { DashboardPage } from "@/components/dashboard-page";
import {
  AboutPage,
  AdminPage,
  ContactPage,
  CorporatePage,
  DestinationPage,
  DestinationsPage,
  HousingMarketplace,
  IntentPage,
  JobsMarketplace,
  MoveRoutePage,
  NotFoundContent,
  PartnersPage,
  PricingPage,
  SeoIntentPage,
  ServicesPage,
  SignInPage,
  VisasPage,
  PageHero,
} from "@/components/content-pages";

type PageProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.map((part) => part.replaceAll("-", " ")).join(" · ");
  return { title: title.replace(/\b\w/g, (letter) => letter.toUpperCase()), description: "Relocate Anywhere Network move planning by LiveAnywhere Consulting." };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const [root, second, third] = slug;

  if (root === "plan") return <section className="section section--alt"><div className="container"><AssessmentWizard /></div></section>;
  if (root === "results") return <Suspense fallback={<div className="page-loading">Building your personal relocation plan…</div>}><ResultsPage /></Suspense>;
  if (root === "destinations" && !second) return <DestinationsPage />;
  if (root === "destinations" && second) return <DestinationPage countryId={second} cityId={third} />;
  if (root === "destination" && second) return <DestinationPage countryId={second} cityId={third} />;
  if (root === "visas") return <VisasPage countryId={second} visaId={third} />;
  if (root === "visa" && second) return <VisasPage visaId={second} />;
  if (root === "services") return <ServicesPage serviceId={second} />;
  if (["retire", "work", "invest", "family", "study", "business"].includes(root)) return <IntentPage type={root} />;
  if (root === "housing") return <><PageHero eyebrow="Housing marketplace" title="Find a home that fits the move—not just the map." description="Filter illustrative homes by city, price, bedrooms and pets, then add a shortlist to your move plan." /><section className="section"><div className="container"><HousingMarketplace /></div></section></>;
  if (root === "jobs") return <><PageHero eyebrow="Job marketplace" title="Find work in your new country." description="Explore mock roles, sponsorship signals and job-assistance workflows without implying an employment or visa outcome." /><section className="section"><div className="container"><JobsMarketplace /></div></section></>;
  if (root === "partners") return <PartnersPage />;
  if (root === "pricing") return <PricingPage />;
  if (root === "corporate") return <CorporatePage />;
  if (root === "about") return <AboutPage />;
  if (root === "contact") return <ContactPage />;
  if (root === "dashboard") return <DashboardPage />;
  if (root === "admin") return <AdminPage />;
  if (root === "sign-in") return <SignInPage />;
  if (root === "move" && second && third) return <MoveRoutePage originId={second} destinationId={third} />;
  if (["move-to-vietnam", "move-to-usa", "retire-in-vietnam", "work-in-vietnam", "invest-in-vietnam", "vietnam-visa-for-americans", "usa-visa-for-vietnamese"].includes(root)) return <SeoIntentPage slug={root} />;
  return <NotFoundContent />;
}
