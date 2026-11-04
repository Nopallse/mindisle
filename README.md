# Mindisle — Autonomous AI Living World

A persistent true top-down 2D pixel-art simulation inhabited by autonomous AI characters powered by Google Gemini, governed by the **Causality Engine**, and endowed with the **Mindisle Creative Engine**.

## Core Concept

Mindisle is not a conventional game with AI NPCs. It is a persistent simulated living world inhabited by autonomous AI agents, starting with **Naufal** and **Lauren**.

Each character possesses:
- Independent reasoning and distinct personalities.
- Needs, desires, motivations, and goals.
- Memories and accumulated experiences.
- Knowledge that develops over time (distinguishing known facts, beliefs, and suspicions).
- Relationships with other characters.
- Creative imagination (ability to invent, design, and construct new things).
- Ability to learn from success, experimentation, and failure.

The player acts as an observer watching life and culture unfold in real time.

## Core Philosophy: Unlimited Imagination, Logical Execution

> **Characters may imagine anything, but they cannot automatically materialize anything.**

Every creation and meaningful world change must have a logical explanation:
1. Need / Motivation $\rightarrow$
2. Environmental Observation $\rightarrow$
3. Inspiration & Idea Formation $\rightarrow$
4. Project Planning $\rightarrow$
5. Material, Knowledge & Tool Verification $\rightarrow$
6. Step-by-Step Construction Actions $\rightarrow$
7. Simulation Engine Validation $\rightarrow$
8. Visual Asset Generation (Pixel Art Is Actual Data) $\rightarrow$
9. Firebase Persistence (Firestore & Storage) $\rightarrow$
10. Grounded Memory Formation & Shared World Integration.

Gemini never directly dictates that an object exists; Gemini proposes intentions and design specifications. The authoritative deterministic simulation engine validates and executes them.

## Technology Stack

- **Frontend & Game Engine**: Next.js App Router, React 19, TypeScript, Phaser 3 (true top-down orthogonal pixel-art).
- **Styling & UI**: Tailwind CSS, Lucide icons, responsive Observer Dashboard.
- **AI Reasoning**: Google Gemini API via official `@google/genai` SDK (server-side only, Zod validation).
- **Backend & Database**: Firebase Firestore (world state, metadata, compact pixel matrices) & Firebase Storage (binary PNG/WebP files, sprite sheets).
- **Testing & Quality**: Vitest scenario tests, TypeScript strict checks, ESLint.

## Directory Structure

```text
mindisle/
├── .agents/
│   ├── AGENTS.md                  # Comprehensive workspace instructions
│   ├── skills/                    # 18 specialist agent skills
│   └── workflows/                 # 12 engineering & testing workflows
├── docs/
│   ├── ARCHITECTURE.md            # Technical system architecture
│   ├── GAME_DESIGN.md             # Core design, characters & simulation rules
│   ├── AI_PROTOCOL.md             # Gemini prompt protocols & Zod schemas
│   ├── DATA_MODEL.md              # Firebase Firestore & Storage schema
│   ├── CAUSALITY_SYSTEM.md        # Causality Engine specifications
│   ├── CREATIVE_ENGINE.md         # Open-ended invention & design pipeline
│   ├── FIREBASE_ARCHITECTURE.md   # Cloud database & storage architecture
│   ├── ASSET_SYSTEM.md            # Pixel art data structures & versioning
│   ├── KNOWLEDGE_SYSTEM.md        # Belief graphs & learning mechanisms
│   ├── WORLD_PROVENANCE.md        # Creation history & audit logs
│   ├── ROADMAP.md                 # Project implementation phases
│   └── PHASE_ACCEPTANCE.md        # Acceptance criteria per phase
├── src/
│   ├── app/                       # Next.js App Router
│   ├── components/                # Observer dashboard HUD & panels
│   ├── game/                      # Phaser scenes, canvas bridge, pixel assets
│   ├── simulation/                # Clock, collision, navigation, Causality Engine
│   └── types/                     # Shared domain types
```

## Quick Start

1. Open this folder as a workspace in Antigravity.
2. Read `.agents/AGENTS.md` and `docs/ROADMAP.md`.
3. Copy `.env.example` to `.env.local` and configure your `GEMINI_API_KEY` and Firebase credentials.
4. Install dependencies: `npm install`
5. Run the dev server: `npm run dev`
6. Run verification checks: `npm test && npm run typecheck && npm run lint`
