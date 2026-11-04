# EDEN — AI Living World

A persistent top-down pixel-art simulation inhabited by autonomous Gemini-powered AI characters.

## Quick Start

1. Open this folder as a workspace in Google Antigravity.
2. Read START_HERE.md.
3. Read .agents/AGENTS.md.
4. Configure .env.local when Gemini integration is implemented.
5. Follow the roadmap phase by phase.

## Core Concept

EDEN is a virtual world inhabited by autonomous simulated agents.

The first inhabitants are Naufal and Lauren.

They have:

- Independent personalities.
- Independent memories.
- Individual goals.
- Simulated emotions.
- Needs and activities.
- Autonomous decision-making.
- Social interactions.

The player initially acts as an observer.

## Technology

- Next.js
- React
- TypeScript
- Phaser 3
- Google Gemini API
- Neon PostgreSQL
- Prisma
- Tailwind CSS

## Development Philosophy

Build a small functioning world first.

Do not implement fake AI behavior.

Do not implement scripted conversations pretending to be autonomous.

The simulation engine owns world state.

Gemini proposes decisions.

The engine validates and executes those decisions.

## Agent System

Workspace instructions:
.agents/AGENTS.md

Specialist skills:
.agents/skills/

Development workflows:
.agents/workflows/

## Important

This repository contains an agent instruction kit, not a prebuilt game.

Antigravity should implement the application incrementally.

Never commit real environment secrets.
