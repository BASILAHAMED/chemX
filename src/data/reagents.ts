import { ReagentDefinition } from "../types";

export const reagents: ReagentDefinition[] = [
  {
    id: "vinegar",
    name: "Vinegar",
    icon: "Ac",
    bottleColor: "#f4b977",
    category: "Acid",
    description: "A safe kitchen acid that reacts with some powders to release gas."
  },
  {
    id: "baking-soda",
    name: "Baking Soda",
    icon: "Bs",
    bottleColor: "#d7ecff",
    category: "Base",
    description: "A soft white powder that fizzes when mixed with acids."
  },
  {
    id: "red-cabbage",
    name: "Red Cabbage Indicator",
    icon: "In",
    bottleColor: "#8f65d6",
    category: "Indicator",
    description: "A natural indicator that changes color with acids and bases."
  },
  {
    id: "soap",
    name: "Soap Solution",
    icon: "So",
    bottleColor: "#7ad9cf",
    category: "Base",
    description: "A slippery liquid that helps trap gas into foam."
  },
  {
    id: "lemon-juice",
    name: "Lemon Juice",
    icon: "Lj",
    bottleColor: "#f8dd69",
    category: "Acid",
    description: "A citrus acid that can make indicators turn pink."
  },
  {
    id: "washing-soda",
    name: "Washing Soda",
    icon: "Ws",
    bottleColor: "#bfd6ff",
    category: "Base",
    description: "A stronger household base with a clear visual reaction."
  },
  {
    id: "food-color",
    name: "Food Coloring",
    icon: "Fc",
    bottleColor: "#ff7c98",
    category: "Color",
    description: "Adds bright color but does not cause a major chemical reaction."
  },
  {
    id: "calcium-water",
    name: "Calcium Water",
    icon: "Cw",
    bottleColor: "#f0f0f0",
    category: "Mineral",
    description: "A cloudy mineral solution that can form a chalky solid."
  },
  {
    id: "salt-water",
    name: "Salt Water",
    icon: "Sw",
    bottleColor: "#a7caff",
    category: "Neutral",
    description: "A neutral solution that mostly acts as a control sample."
  },
  {
    id: "seltzer",
    name: "Seltzer Water",
    icon: "Sz",
    bottleColor: "#9fe9ff",
    category: "Gas",
    description: "Already contains carbon dioxide bubbles."
  }
];

export const reagentMap = Object.fromEntries(
  reagents.map((reagent) => [reagent.id, reagent])
);
