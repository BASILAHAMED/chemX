import { describe, expect, it } from "vitest";
import { createInitialLabSession, findReaction, normalizeReagents, resolveReactionOutcome } from "./reactionEngine";

describe("reaction engine", () => {
  it("matches a valid reaction regardless of reagent order", () => {
    expect(normalizeReagents(["vinegar", "baking-soda"])).toEqual(["baking-soda", "vinegar"]);
    expect(findReaction(["baking-soda", "vinegar"])?.id).toBe("acid-base-fizz");
  });

  it("returns a neutral result when no reaction matches", () => {
    const outcome = resolveReactionOutcome(["food-color", "vinegar"]);
    expect(outcome.matchedReactionId).toBeNull();
    expect(outcome.resultMessage).toMatch(/No major visible reaction/);
  });

  it("treats repeated reagents as a different unmatched mixture", () => {
    const outcome = resolveReactionOutcome(["vinegar", "vinegar"]);
    expect(outcome.matchedReactionId).toBeNull();
  });

  it("creates a clean lab session when reset", () => {
    expect(createInitialLabSession("mission-fizz")).toMatchObject({
      selectedMissionId: "mission-fizz",
      contents: [],
      phase: "idle",
      matchedReactionId: null,
      missionResult: "idle"
    });
  });
});
