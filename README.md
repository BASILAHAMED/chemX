# chemX

chemX is an interactive chemistry practice web application designed for school students to explore basic reactions in a safe virtual lab. It combines guided learning missions with visual simulation effects such as color changes, bubbling, foam, and a browser-based 3D lab scene.

## Overview

The project is built as a frontend-only learning experience for middle-school and early high-school chemistry practice. Students can open missions, select reagents, mix them in a virtual beaker, and observe the outcome through rule-based reaction logic and animated feedback.

This repository currently focuses on:

- Guided chemistry practice missions
- Rule-based reaction matching instead of a full chemistry engine
- Visual feedback for fizzing, glow, foam, precipitate, and liquid color changes
- A 3D lab view built with React Three Fiber
- Local progress saving with `localStorage`

## Features

- Mission-based learning flow with hints and takeaways
- Curated reagent and reaction catalog for classroom-friendly chemistry concepts
- Virtual lab bench with selectable reagents
- 3D beaker scene with camera controls and animated reaction states
- Neutral feedback for unsupported combinations so students can still learn from observation
- Local persistence for completed missions and last-opened mission
- Unit and UI tests with Vitest and Testing Library

## Tech Stack

- React 19
- TypeScript
- Vite
- Vitest
- React Testing Library
- Three.js
- React Three Fiber
- Drei

## Project Structure

```text
src/
  components/
    LabScene3D.tsx
  data/
    missions.ts
    reactions.ts
    reagents.ts
  lib/
    reactionEngine.ts
  test/
    setup.ts
  App.tsx
  main.tsx
  styles.css
  types.ts
```

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### Installation

```bash
npm install
```

### Run The App

```bash
npm run dev
```

Then open the local URL shown by Vite in your browser.

### Build For Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

Run the automated test suite:

```bash
npm test
```

The test coverage currently includes:

- Reaction matching behavior
- Neutral outcome handling
- Lab reset behavior
- Mission completion flow
- Local progress persistence

## How The Simulation Works

chemX does not attempt full scientific fluid simulation. Instead, it uses a structured reaction catalog and deterministic visual states to create an educational, believable experience.

Each reaction definition includes:

- Reagent combination
- Container type
- Result message
- Safety note
- Mission tags
- Visual effect settings

The reaction engine resolves the selected reagents and maps them to a visual outcome shown in the lab scene.

## Current Limitations

- The chemistry logic is curated and rule-based, not exhaustive
- The 3D scene is optimized for browser compatibility, not advanced scientific realism
- Progress is stored only in the current browser
- No authentication, backend, or classroom dashboard yet

## Roadmap Ideas

- More reagents and missions
- Better 3D lab assets and tools
- Drag-and-pour interactions
- Sound effects for bubbling and pouring
- Difficulty levels by student grade
- Teacher mode or classroom progress tracking
- Mobile-specific interaction improvements

## Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - type-check and create a production build
- `npm run preview` - preview the production build locally
- `npm test` - run the test suite once
- `npm run test:watch` - run tests in watch mode

## Contributing

Contributions are welcome if you want to improve the chemistry content, interaction design, 3D visuals, or educational flow. If you plan to expand the simulation model, keep the chemistry rules separate from the rendering layer so the app stays maintainable.

## License

No license has been added yet. If you plan to make the repository public for reuse, consider adding one such as MIT.
