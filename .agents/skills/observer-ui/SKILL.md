---
name: observer-ui
description: Designs and implements EDEN's observer-mode interface, responsive HUD, character inspection panels, event logs, world controls, and game-to-UI event bridge.
---

# EDEN Observer UI

## Responsibilities

Build the observer interface.

Use when implementing:

- React UI.
- Game HUD.
- Character panels.
- Event logs.
- Simulation controls.
- Game-to-UI communication.

## Visual Direction

- Cozy pixel-art simulation interface.
- Game canvas is the main focus.
- Dark translucent panels where appropriate.
- Clear visual hierarchy.
- Readable typography.
- Responsive layout.
- Avoid unnecessary panels and visual clutter.

## Main Interface

- Central game canvas.
- Character sidebar.
- World clock.
- Simulation controls.
- Public event log.
- Character inspection.
- Conversation history.

## Data Rules

- Display authoritative sanitized snapshots.
- Public dialogue comes from executed speak events.
- Private thoughts are hidden by default.
- Developer diagnostics must be explicitly labeled.
- Never claim persistence from optimistic client state.

## Architecture

- React does not own the simulation loop.
- Use typed event bridge or snapshots.
- Avoid rerendering the entire dashboard at 60 FPS.
- Clean up subscriptions.
- Support keyboard accessibility.

## Acceptance

Observer can:

- Pause.
- Resume.
- Change simulation speed.
- Select Naufal or Lauren.
- Inspect character status.
- Read public events.

The UI must not degrade game performance.
