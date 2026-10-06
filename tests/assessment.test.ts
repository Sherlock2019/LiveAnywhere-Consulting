import { describe, expect, it } from "vitest";
import { assessMove, calculateMoveEstimate, type AssessmentInput } from "@/lib/assessment";

const retirementMove: AssessmentInput = {
  origin: "usa",
  destination: "vietnam",
  goals: ["retire"],
  adults: 2,
  children: 0,
  pets: 0,
  monthlyBudget: 4000,
  relocationBudget: 100000,
  timeframe: "3-6-months",
  duration: "permanent",
};

describe("assessment engine", () => {
  it("returns a bounded informational readiness score", () => {
    const result = assessMove(retirementMove);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("surfaces Vietnam retirement alternatives without treating retirement as a visa", () => {
    const result = assessMove(retirementMove);
    expect(result.routes.some((route) => route.id === "vn-retirement")).toBe(true);
    expect(result.routes.some((route) => route.id === "vn-evisa")).toBe(true);
  });

  it("increases the estimate when pets are included", () => {
    const withoutPets = calculateMoveEstimate(retirementMove);
    const withPets = calculateMoveEstimate({ ...retirementMove, pets: 2 });
    expect(withPets).toBeGreaterThan(withoutPets);
  });

  it("matches employment categories for Vietnam to USA work intent", () => {
    const result = assessMove({ ...retirementMove, origin: "vietnam", destination: "usa", goals: ["work"], employment: "Software engineer" });
    expect(result.routes.some((route) => route.routeCode === "H-1B")).toBe(true);
    expect(result.routes.some((route) => route.routeCode === "EB-2 NIW")).toBe(true);
  });
});
