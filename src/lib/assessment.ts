import { routesFor, type VisaRoute } from "@/data/visa-routes";

export type AssessmentInput = {
  origin: string;
  destination: string;
  goals: string[];
  adults: number;
  children: number;
  pets: number;
  monthlyBudget: number;
  relocationBudget: number;
  timeframe: string;
  duration: string;
  savingsBand?: string;
  employment?: string;
  education?: string;
  familyTies?: boolean;
};

export type AssessmentResult = {
  score: number;
  dimensions: {
    immigration: number;
    financial: number;
    housing: number;
    employment: number;
    documentation: number;
    moving: number;
  };
  estimatedCashToMove: number;
  estimatedMonthlyLife: number;
  routes: VisaRoute[];
  nextAction: string;
};

export function calculateMoveEstimate(input: AssessmentInput) {
  const household = input.adults + input.children;
  const destinationFactor = input.destination === "usa" ? 1.65 : 1;
  const flights = Math.max(1, household) * 850 * destinationFactor;
  const setup = (input.destination === "vietnam" ? 5200 : 9800) * destinationFactor;
  const housingBuffer = input.monthlyBudget * 2.5;
  const petCost = input.pets * 1400;
  return Math.round((flights + setup + housingBuffer + petCost) / 100) * 100;
}

export function assessMove(input: AssessmentInput): AssessmentResult {
  const routes = routesFor(input.origin, input.destination, input.goals);
  const estimatedCashToMove = calculateMoveEstimate(input);
  const financial = Math.max(35, Math.min(95, Math.round((input.relocationBudget / Math.max(estimatedCashToMove, 1)) * 72)));
  const immigration = routes.some((route) => route.publicStatus === "available") ? 72 : routes.length ? 58 : 35;
  const employment = input.goals.includes("work") ? (input.employment ? 68 : 46) : 74;
  const housing = input.monthlyBudget >= (input.destination === "vietnam" ? 1800 : 3500) ? 84 : 58;
  const documentation = input.familyTies ? 72 : 61;
  const moving = input.timeframe === "asap" ? 54 : 79;
  const score = Math.round((immigration + financial + employment + housing + documentation + moving) / 6);

  return {
    score,
    dimensions: { immigration, financial, housing, employment, documentation, moving },
    estimatedCashToMove,
    estimatedMonthlyLife: Math.round(input.monthlyBudget * 0.9 / 100) * 100,
    routes,
    nextAction: routes.length
      ? "Book a professional relocation assessment to validate the route and document sequence."
      : "Request a professional route review before making immigration or financial decisions.",
  };
}
