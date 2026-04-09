import { ReactionDefinition } from "../types";

const beaker = "beaker" as const;

export const reactions: ReactionDefinition[] = [
  {
    id: "acid-base-fizz",
    reagents: ["vinegar", "baking-soda"],
    container: beaker,
    resultMessage: "The acid and base react to form carbon dioxide gas, so the beaker fizzes quickly.",
    safetyNote: "Use small amounts and keep the beaker open so the gas can escape safely.",
    missionTags: ["gas", "acid-base"],
    visualEffects: { liquidColor: "#fff0c9", bubbleLevel: 3, foam: true, glow: false, swirl: true, precipitate: false }
  },
  {
    id: "indicator-acid",
    reagents: ["red-cabbage", "lemon-juice"],
    container: beaker,
    resultMessage: "The indicator turns pink because lemon juice is acidic.",
    safetyNote: "Indicators are for observing color changes, not for tasting.",
    missionTags: ["indicator", "acid"],
    visualEffects: { liquidColor: "#ff62a5", bubbleLevel: 0, foam: false, glow: true, swirl: true, precipitate: false }
  },
  {
    id: "indicator-base",
    reagents: ["red-cabbage", "washing-soda"],
    container: beaker,
    resultMessage: "The indicator shifts toward blue-green because washing soda is basic.",
    safetyNote: "Avoid touching stronger bases directly and rinse if any spills.",
    missionTags: ["indicator", "base"],
    visualEffects: { liquidColor: "#27b8a1", bubbleLevel: 0, foam: false, glow: true, swirl: true, precipitate: false }
  },
  {
    id: "foamy-eruption",
    reagents: ["soap", "vinegar"],
    container: beaker,
    resultMessage: "The soap traps gas and motion into a lively foamy layer.",
    safetyNote: "Keep the setup on a tray because foam can spill over the rim.",
    missionTags: ["foam"],
    visualEffects: { liquidColor: "#93e5dc", bubbleLevel: 2, foam: true, glow: false, swirl: true, precipitate: false }
  },
  {
    id: "chalky-cloud",
    reagents: ["calcium-water", "seltzer"],
    container: beaker,
    resultMessage: "Carbon dioxide in the seltzer forms a chalky solid, making the liquid cloudy.",
    safetyNote: "Cloudiness means a new solid formed, so observe before shaking.",
    missionTags: ["precipitate", "gas"],
    visualEffects: { liquidColor: "#dfe7ea", bubbleLevel: 1, foam: false, glow: false, swirl: true, precipitate: true }
  },
  {
    id: "bright-acid-indicator",
    reagents: ["red-cabbage", "vinegar"],
    container: beaker,
    resultMessage: "The indicator becomes magenta, showing that vinegar is acidic too.",
    safetyNote: "Color indicators help us compare acids without needing a smell test.",
    missionTags: ["indicator", "acid"],
    visualEffects: { liquidColor: "#d84ba0", bubbleLevel: 0, foam: false, glow: true, swirl: true, precipitate: false }
  },
  {
    id: "gentle-bubbles",
    reagents: ["baking-soda", "lemon-juice"],
    container: beaker,
    resultMessage: "A smaller acid-base reaction releases gentle bubbles.",
    safetyNote: "Even gentle reactions should be mixed in an open container.",
    missionTags: ["gas", "acid-base"],
    visualEffects: { liquidColor: "#f9efb8", bubbleLevel: 2, foam: false, glow: false, swirl: true, precipitate: false }
  },
  {
    id: "sudsy-fizz",
    reagents: ["baking-soda", "soap"],
    container: beaker,
    resultMessage: "The mixture stirs up suds, but it needs an acid for a stronger fizz.",
    safetyNote: "This is more of a physical change, so compare it with a true acid-base reaction.",
    missionTags: ["foam"],
    visualEffects: { liquidColor: "#d6f6f0", bubbleLevel: 1, foam: true, glow: false, swirl: false, precipitate: false }
  },
  {
    id: "color-blend",
    reagents: ["food-color", "salt-water"],
    container: beaker,
    resultMessage: "The dye spreads through the water, creating a bright but mostly physical change.",
    safetyNote: "Not every colorful change is a chemical reaction.",
    missionTags: ["control"],
    visualEffects: { liquidColor: "#ff7c98", bubbleLevel: 0, foam: false, glow: false, swirl: true, precipitate: false }
  },
  {
    id: "base-with-seltzer",
    reagents: ["washing-soda", "seltzer"],
    container: beaker,
    resultMessage: "The dissolved gas reacts and the bubbling fades as the base changes the solution.",
    safetyNote: "Watch how bubble speed changes over time to spot the reaction.",
    missionTags: ["gas", "base"],
    visualEffects: { liquidColor: "#bfe7d9", bubbleLevel: 1, foam: false, glow: false, swirl: true, precipitate: false }
  }
];
