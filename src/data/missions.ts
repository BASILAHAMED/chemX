import { MissionDefinition } from "../types";

export const missions: MissionDefinition[] = [
  {
    id: "mission-fizz",
    title: "Fizz Finder",
    objective: "Create a reaction that produces lots of bubbles.",
    instructions: "Pick two reagents that release a gas when mixed.",
    allowedReagents: ["vinegar", "baking-soda", "salt-water", "food-color"],
    successReactionId: "acid-base-fizz",
    hint: "One reagent is a kitchen acid and the other is a powder used in baking.",
    takeaway: "Gas bubbles can be a sign that a new substance is forming."
  },
  {
    id: "mission-acid-color",
    title: "Acid Color Clue",
    objective: "Use the indicator to show an acidic color change.",
    instructions: "Mix the indicator with a safe household acid.",
    allowedReagents: ["red-cabbage", "lemon-juice", "vinegar", "salt-water"],
    successReactionId: "indicator-acid",
    hint: "A citrus liquid is a strong clue.",
    takeaway: "Indicators help us compare acidic and basic liquids using color."
  },
  {
    id: "mission-base-color",
    title: "Base Detector",
    objective: "Turn the indicator blue-green with a base.",
    instructions: "Choose the reagent that acts like a base.",
    allowedReagents: ["red-cabbage", "washing-soda", "salt-water", "soap"],
    successReactionId: "indicator-base",
    hint: "The best choice is a cleaning powder rather than a soap.",
    takeaway: "Bases can make some indicators shift toward cooler colors."
  },
  {
    id: "mission-foam",
    title: "Foam Watch",
    objective: "Produce a foamy top layer in the beaker.",
    instructions: "Find the pair that traps the motion into suds.",
    allowedReagents: ["soap", "vinegar", "baking-soda", "salt-water"],
    successReactionId: "foamy-eruption",
    hint: "One reagent helps catch bubbles instead of letting them pop quickly.",
    takeaway: "Some materials change how a reaction looks by trapping gas or changing texture."
  },
  {
    id: "mission-cloud",
    title: "Cloudy Change",
    objective: "Make the liquid look cloudy because a solid appears.",
    instructions: "Choose the mineral solution and the fizzy water.",
    allowedReagents: ["calcium-water", "seltzer", "salt-water", "food-color"],
    successReactionId: "chalky-cloud",
    hint: "One liquid already contains dissolved carbon dioxide.",
    takeaway: "A cloudy mixture can mean a new solid formed inside the liquid."
  },
  {
    id: "mission-control",
    title: "Control Sample",
    objective: "Find a colorful mix that is not a major chemical reaction.",
    instructions: "Create a visible change without fizz, glow, or foam.",
    allowedReagents: ["food-color", "salt-water", "vinegar", "baking-soda"],
    successReactionId: "color-blend",
    hint: "Try dyeing a neutral liquid instead of forcing a reaction.",
    takeaway: "Scientists compare chemical changes with simpler physical changes."
  }
];
