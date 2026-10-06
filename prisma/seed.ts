import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole, VisaStatus } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seeding");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  await prisma.country.upsert({ where: { id: "usa" }, update: {}, create: { id: "usa", name: "United States", iso2: "US", flag: "🇺🇸", launch: true } });
  await prisma.country.upsert({ where: { id: "vietnam" }, update: {}, create: { id: "vietnam", name: "Vietnam", iso2: "VN", flag: "🇻🇳", launch: true } });

  const cityRows = [
    ["da-nang", "vietnam", "Da Nang", "da-nang", 16.0544, 108.2022],
    ["ho-chi-minh-city", "vietnam", "Ho Chi Minh City", "ho-chi-minh-city", 10.8231, 106.6297],
    ["hanoi", "vietnam", "Hanoi", "hanoi", 21.0278, 105.8342],
  ] as const;
  for (const [id, countryId, name, slug, latitude, longitude] of cityRows) {
    await prisma.city.upsert({ where: { id }, update: {}, create: { id, countryId, name, slug, latitude, longitude, costOfLiving: { mock: true } } });
  }

  const visaRows = [
    { id: "vn-evisa", country: "vietnam", name: "Vietnam e-Visa", code: "EV", status: VisaStatus.ACTIVE, publicStatus: "available", purposes: ["explore", "retire", "long-stay", "business"], summary: "Useful for exploration and short stays; not work authorization or a long-term residence solution.", source: "https://evisa.gov.vn/?option=MO" },
    { id: "vn-retirement", country: "vietnam", name: "General retirement visa", code: "NO GENERAL CATEGORY", status: VisaStatus.CLOSED, publicStatus: "unavailable", purposes: ["retire"], summary: "No general retirement route is represented in the official-source demo dataset.", source: "https://xuatnhapcanh.gov.vn/" },
    { id: "us-h1b", country: "usa", name: "H-1B specialty occupation", code: "H-1B", status: VisaStatus.REQUIRES_REVIEW, publicStatus: "review", purposes: ["work"], summary: "Employment category for professional screening; no eligibility determination is made.", source: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/all-visa-categories.html" },
  ];
  for (const row of visaRows) {
    await prisma.visaRoute.upsert({
      where: { id: row.id },
      update: {},
      create: {
        id: row.id,
        destinationCountryId: row.country,
        routeName: row.name,
        routeCode: row.code,
        category: "General information",
        purposes: row.purposes,
        originCountries: ["*"],
        status: row.status,
        publicStatus: row.publicStatus,
        summary: row.summary,
        lastVerified: new Date("2026-10-06T00:00:00.000Z"),
        sources: { create: [{ label: "Official source", url: row.source, verifiedAt: new Date("2026-10-06T00:00:00.000Z") }] },
      },
    });
  }

  const serviceRows = [
    ["visa-legal", "Visa & legal", "Immigration & legal"], ["documents", "Documents", "Immigration & legal"], ["housing", "Home", "Housing"], ["jobs", "Job", "Jobs"], ["moving", "Movers", "Moving"], ["healthcare", "Healthcare", "Health"], ["banking", "Banking", "Money"], ["concierge", "Local concierge", "Daily life"],
  ];
  for (const [id, name, category] of serviceRows) await prisma.service.upsert({ where: { id }, update: {}, create: { id, name, category, description: `${name} coordination inside the relocation plan.` } });

  const planRows = [
    ["explore", "Explore", "$199", 199, ["Assessment", "Route overview", "City recommendations"]],
    ["move", "Move", "From $1,499", 1499, ["Document coordination", "Housing assistance", "Relocation manager"]],
    ["complete", "Complete move", "From $3,999", 3999, ["Move coordination", "Arrival setup", "90-day support"]],
    ["concierge", "Concierge", "Custom", null, ["Door-to-door coordination", "Dedicated manager"]],
  ] as const;
  for (const [id, name, priceText, amount, features] of planRows) await prisma.pricingPlan.upsert({ where: { id }, update: {}, create: { id, name, priceText, amount, features: [...features] } });

  const demoUser = await prisma.user.upsert({
    where: { email: process.env.DEMO_USER_EMAIL ?? "demo@liveanywhere.consulting" },
    update: {},
    create: { email: process.env.DEMO_USER_EMAIL ?? "demo@liveanywhere.consulting", name: "Demo customer", role: UserRole.CUSTOMER, profile: { create: { locale: "en", nationality: "United States", currentCity: "San Francisco", currentCountry: "USA" } } },
  });
  const household = await prisma.household.findFirst({ where: { userId: demoUser.id } }) ?? await prisma.household.create({ data: { userId: demoUser.id, label: "Demo household", adults: 2 } });
  const existingCase = await prisma.relocationCase.findFirst({ where: { customerId: demoUser.id, originCountryId: "usa", destinationCountryId: "vietnam" } });
  if (!existingCase) {
    await prisma.relocationCase.create({ data: { customerId: demoUser.id, householdId: household.id, originCountryId: "usa", destinationCountryId: "vietnam", originCity: "San Francisco", destinationCity: "Da Nang", goals: ["retire"], intendedStay: "Permanent / long-term", monthlyBudget: 4000, relocationBudget: 100000, readinessScore: 78, status: "PLANNING", targetMoveDate: new Date("2027-03-15T00:00:00.000Z"), tasks: { create: [{ title: "Review route summary", category: "Immigration", status: "COMPLETE", sortOrder: 1 }, { title: "Confirm passport validity", category: "Documents", status: "IN_PROGRESS", sortOrder: 2 }, { title: "Shortlist Da Nang neighborhoods", category: "Housing", status: "NOT_STARTED", sortOrder: 3 }] } } });
  }
}

main().finally(async () => prisma.$disconnect());
