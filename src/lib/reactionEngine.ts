import { reactions } from "../data/reactions";
import { LabSessionState, ReactionDefinition, VisualEffects } from "../types";

export const DEFAULT_EFFECTS: VisualEffects = {
  liquidColor: "linear-gradient(180deg, #7cc8ff 0%, #4f8cff 100%)",
  bubbleLevel: 0,
  foam: false,
  glow: false,
  swirl: false,
  precipitate: false
};

export const NEUTRAL_RESULT = {
  matchedReactionId: null,
  resultMessage: "No major visible reaction happened. Scientists would record this as a useful observation too.",
  safetyNote: "When a mixture stays calm, compare it with stronger reactions to learn what changed.",
  visibleEffects: {
    liquidColor: "#7fc5ff",
    bubbleLevel: 0,
    foam: false,
    glow: false,
    swirl: true,
    precipitate: false
  } as VisualEffects
};

export function normalizeReagents(reagentsToNormalize: string[]) {
  return [...reagentsToNormalize].sort();
}

export function findReaction(reagentsToMatch: string[]): ReactionDefinition | null {
  const normalized = normalizeReagents(reagentsToMatch);

  return (
    reactions.find((reaction) => {
      const candidate = normalizeReagents(reaction.reagents);
      return candidate.length === normalized.length && candidate.every((id, index) => id === normalized[index]);
    }) ?? null
  );
}

export function resolveReactionOutcome(reagentsToMatch: string[]) {
  const reaction = findReaction(reagentsToMatch);

  if (!reaction) {
    return NEUTRAL_RESULT;
  }

  return {
    matchedReactionId: reaction.id,
    resultMessage: reaction.resultMessage,
    safetyNote: reaction.safetyNote,
    visibleEffects: reaction.visualEffects
  };
}

export function createInitialLabSession(selectedMissionId: string | null): LabSessionState {
  return {
    selectedMissionId,
    currentContainer: "beaker",
    contents: [],
    phase: "idle",
    visibleEffects: DEFAULT_EFFECTS,
    logEntries: [],
    matchedReactionId: null,
    resultMessage: "Choose a reagent to begin the experiment.",
    safetyNote: "Work with one small step at a time and observe carefully.",
    missionResult: "idle"
  };
}
