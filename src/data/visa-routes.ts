export type VisaStatus = "ACTIVE" | "TEMPORARY" | "PROPOSED" | "SUSPENDED" | "CLOSED" | "REQUIRES_REVIEW";

export type VisaRoute = {
  id: string;
  originCountries: string[];
  destinationCountry: string;
  routeName: string;
  routeCode: string;
  category: string;
  purposes: string[];
  nationalityRestrictions: string[];
  investmentMinimum: number | null;
  sponsorRequired: boolean | null;
  employerRequired: boolean | null;
  familyEligible: boolean | null;
  workAllowed: boolean | null;
  studyAllowed: boolean | null;
  typicalDuration: string;
  permanentResidencePossible: boolean | null;
  governmentFees: string;
  estimatedProcessingTime: string;
  officialSources: { label: string; url: string }[];
  lastVerified: string;
  status: VisaStatus;
  publicStatus: "available" | "possible" | "review" | "proposed" | "unavailable";
  summary: string;
  disclaimer: string;
};

const informationalDisclaimer =
  "General information only. Requirements change and depend on individual facts; a licensed professional must confirm eligibility.";

export const visaRoutes: VisaRoute[] = [
  {
    id: "vn-evisa",
    originCountries: ["*"],
    destinationCountry: "vietnam",
    routeName: "Vietnam e-Visa",
    routeCode: "EV",
    category: "Exploration / short stay",
    purposes: ["explore", "retire", "long-stay", "business"],
    nationalityRestrictions: ["Eligibility depends on passport and admissibility"],
    investmentMinimum: null,
    sponsorRequired: false,
    employerRequired: false,
    familyEligible: null,
    workAllowed: false,
    studyAllowed: false,
    typicalDuration: "Up to 90 days; single or multiple entry",
    permanentResidencePossible: false,
    governmentFees: "Official portal currently lists US$25 single-entry / US$50 multiple-entry",
    estimatedProcessingTime: "Check the official portal before travel",
    officialSources: [{ label: "Vietnam Immigration Department e-Visa portal", url: "https://evisa.gov.vn/?option=MO" }],
    lastVerified: "2026-10-06",
    status: "ACTIVE",
    publicStatus: "available",
    summary: "Useful for an exploratory visit; it is not work authorization or a long-term residence solution.",
    disclaimer: informationalDisclaimer,
  },
  {
    id: "vn-investor-review",
    originCountries: ["*"],
    destinationCountry: "vietnam",
    routeName: "Investor / business route review",
    routeCode: "DT-REVIEW",
    category: "Business and investment",
    purposes: ["invest", "business"],
    nationalityRestrictions: [],
    investmentMinimum: null,
    sponsorRequired: null,
    employerRequired: false,
    familyEligible: null,
    workAllowed: null,
    studyAllowed: null,
    typicalDuration: "Depends on the lawful route and project facts",
    permanentResidencePossible: null,
    governmentFees: "Professional review required",
    estimatedProcessingTime: "Case dependent",
    officialSources: [{ label: "Vietnam Immigration Department", url: "https://xuatnhapcanh.gov.vn/" }],
    lastVerified: "2026-10-06",
    status: "REQUIRES_REVIEW",
    publicStatus: "possible",
    summary: "A potential category when real business or investment activity is planned; no match is assumed from budget alone.",
    disclaimer: informationalDisclaimer,
  },
  {
    id: "vn-work-review",
    originCountries: ["*"],
    destinationCountry: "vietnam",
    routeName: "Vietnam work route",
    routeCode: "LD / WP REVIEW",
    category: "Employment",
    purposes: ["work", "remote-work"],
    nationalityRestrictions: [],
    investmentMinimum: null,
    sponsorRequired: true,
    employerRequired: true,
    familyEligible: null,
    workAllowed: true,
    studyAllowed: null,
    typicalDuration: "Depends on employer, role and permit",
    permanentResidencePossible: null,
    governmentFees: "Professional review required",
    estimatedProcessingTime: "Case dependent",
    officialSources: [{ label: "Vietnam Immigration Department", url: "https://xuatnhapcanh.gov.vn/" }],
    lastVerified: "2026-10-06",
    status: "REQUIRES_REVIEW",
    publicStatus: "review",
    summary: "Usually requires an eligible role, employer support and separate work authorization review.",
    disclaimer: informationalDisclaimer,
  },
  {
    id: "vn-family-origin-review",
    originCountries: ["*"],
    destinationCountry: "vietnam",
    routeName: "Family / Vietnamese-origin review",
    routeCode: "FAMILY REVIEW",
    category: "Family",
    purposes: ["family", "retire", "long-stay"],
    nationalityRestrictions: [],
    investmentMinimum: null,
    sponsorRequired: null,
    employerRequired: false,
    familyEligible: true,
    workAllowed: null,
    studyAllowed: null,
    typicalDuration: "Depends on family relationship and documentation",
    permanentResidencePossible: null,
    governmentFees: "Professional review required",
    estimatedProcessingTime: "Case dependent",
    officialSources: [{ label: "Vietnam Immigration Department", url: "https://xuatnhapcanh.gov.vn/" }],
    lastVerified: "2026-10-06",
    status: "REQUIRES_REVIEW",
    publicStatus: "possible",
    summary: "Family ties or Vietnamese origin may change the available pathway and document requirements.",
    disclaimer: informationalDisclaimer,
  },
  {
    id: "vn-retirement",
    originCountries: ["*"],
    destinationCountry: "vietnam",
    routeName: "General retirement visa",
    routeCode: "NO GENERAL CATEGORY",
    category: "Retirement",
    purposes: ["retire"],
    nationalityRestrictions: [],
    investmentMinimum: null,
    sponsorRequired: null,
    employerRequired: null,
    familyEligible: null,
    workAllowed: null,
    studyAllowed: null,
    typicalDuration: "Not currently represented as a general route in this demo dataset",
    permanentResidencePossible: null,
    governmentFees: "Not applicable",
    estimatedProcessingTime: "Professional route assessment recommended",
    officialSources: [{ label: "Vietnam Immigration Department", url: "https://xuatnhapcanh.gov.vn/" }],
    lastVerified: "2026-10-06",
    status: "CLOSED",
    publicStatus: "unavailable",
    summary: "Vietnam does not currently publish a general retirement-visa category in the official sources reviewed for this demo. Alternative lawful routes require assessment.",
    disclaimer: informationalDisclaimer,
  },
  {
    id: "vn-golden-visa",
    originCountries: ["*"],
    destinationCountry: "vietnam",
    routeName: "Vietnam Golden Visa",
    routeCode: "PROPOSED",
    category: "Monitoring",
    purposes: ["invest", "retire", "long-stay"],
    nationalityRestrictions: [],
    investmentMinimum: null,
    sponsorRequired: null,
    employerRequired: null,
    familyEligible: null,
    workAllowed: null,
    studyAllowed: null,
    typicalDuration: "Not application-ready",
    permanentResidencePossible: null,
    governmentFees: "Not available",
    estimatedProcessingTime: "Not available",
    officialSources: [{ label: "Vietnam Immigration Department", url: "https://xuatnhapcanh.gov.vn/" }],
    lastVerified: "2026-10-06",
    status: "PROPOSED",
    publicStatus: "proposed",
    summary: "Monitoring only. This is not treated as an active program and no application is offered.",
    disclaimer: informationalDisclaimer,
  },
  ...[
    ["us-h1b", "H-1B specialty occupation", "H-1B", "Employment", ["work"], true],
    ["us-l1", "L-1 intracompany transfer", "L-1", "Employment", ["work", "business"], true],
    ["us-o1", "O-1 extraordinary ability", "O-1", "Employment", ["work"], true],
    ["us-eb2-niw", "EB-2 National Interest Waiver review", "EB-2 NIW", "Employment-based immigration", ["work"], false],
    ["us-eb5", "EB-5 immigrant investor review", "EB-5", "Investment", ["invest", "business"], false],
    ["us-family", "Family / partner pathway review", "K-1 / CR-1 / IR-1 / preference", "Family", ["family"], false],
    ["us-f1", "F-1 student route", "F-1", "Study", ["study"], true],
    ["us-visitor", "B-1/B-2 visitor route", "B-1/B-2", "Visit", ["explore"], false],
  ].map(([id, routeName, routeCode, category, purposes, employerRequired]) => ({
    id: id as string,
    originCountries: ["vietnam"],
    destinationCountry: "usa",
    routeName: routeName as string,
    routeCode: routeCode as string,
    category: category as string,
    purposes: purposes as string[],
    nationalityRestrictions: [],
    investmentMinimum: null,
    sponsorRequired: null,
    employerRequired: employerRequired as boolean,
    familyEligible: (category as string) === "Family" ? true : null,
    workAllowed: (category as string).includes("Employment") ? true : null,
    studyAllowed: (category as string) === "Study" ? true : null,
    typicalDuration: "Category and case dependent",
    permanentResidencePossible: (category as string).includes("immigration") || (id as string).includes("eb5") || (id as string).includes("family") ? true : null,
    governmentFees: "See official sources for current fees",
    estimatedProcessingTime: "Varies by category, petition, post and visa availability",
    officialSources: [
      { label: "U.S. Department of State visa categories", url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/all-visa-categories.html" },
      { label: "USCIS", url: "https://www.uscis.gov/working-in-the-united-states" }
    ],
    lastVerified: "2026-10-06",
    status: "REQUIRES_REVIEW" as VisaStatus,
    publicStatus: "review" as const,
    summary: "A route category for professional screening; the demo does not determine eligibility.",
    disclaimer: informationalDisclaimer,
  })),
];

export function routesFor(origin: string, destination: string, goals: string[] = []) {
  return visaRoutes.filter((route) => {
    const originMatch = route.originCountries.includes("*") || route.originCountries.includes(origin);
    const destinationMatch = route.destinationCountry === destination;
    const goalMatch = !goals.length || route.purposes.some((purpose) => goals.includes(purpose));
    return originMatch && destinationMatch && goalMatch;
  });
}
