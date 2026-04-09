export type ContainerType = "beaker";

export type AnimationPhase =
  | "idle"
  | "pouring"
  | "mixing"
  | "reacting"
  | "result";

export interface VisualEffects {
  liquidColor: string;
  bubbleLevel: 0 | 1 | 2 | 3;
  foam: boolean;
  glow: boolean;
  swirl: boolean;
  precipitate: boolean;
}

export interface ReagentDefinition {
  id: string;
  name: string;
  icon: string;
  bottleColor: string;
  category: string;
  description: string;
}

export interface ReactionDefinition {
  id: string;
  reagents: string[];
  container: ContainerType;
  resultMessage: string;
  safetyNote: string;
  missionTags: string[];
  visualEffects: VisualEffects;
}

export interface MissionDefinition {
  id: string;
  title: string;
  objective: string;
  instructions: string;
  allowedReagents: string[];
  successReactionId: string;
  hint: string;
  takeaway: string;
}

export interface LabLogEntry {
  id: string;
  message: string;
}

export interface LabSessionState {
  selectedMissionId: string | null;
  currentContainer: ContainerType;
  contents: string[];
  phase: AnimationPhase;
  visibleEffects: VisualEffects;
  logEntries: LabLogEntry[];
  matchedReactionId: string | null;
  resultMessage: string;
  safetyNote: string;
  missionResult: "idle" | "success" | "try-again";
}

export interface ProgressState {
  completedMissionIds: string[];
  lastMissionId: string | null;
}
