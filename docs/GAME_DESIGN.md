# Mindisle — Living World Game Design Document

## 1. High Concept

**Mindisle** is a persistent, autonomous living world simulation presented as a rich true top-down 2D pixel-art game.

Mindisle is not a scripted story or a traditional game with reactive NPCs. It is a simulated ecosystem inhabited by autonomous AI characters—starting with **Naufal** and **Lauren**.

The characters possess independent minds, distinct personalities, emergent needs, goals, emotional appraisal, memories, relationships, and **creative imagination**. They can invent, design, craft, construct, and modify their world over time, learning from their experiments, successes, and failures.

The player acts as an observer, watching history, culture, and architecture emerge from autonomous decisions.

## 2. Core Game Design Pillars

### Pillar 1: Unlimited Imagination, Logical Execution
> Characters can imagine and propose anything without being restricted to fixed menus, but they cannot magically materialize anything.

Every creation follows a strict causal progression:
$$\text{Need} \rightarrow \text{Observation} \rightarrow \text{Inspiration} \rightarrow \text{Plan} \rightarrow \text{Knowledge \& Tools} \rightarrow \text{Labor Steps} \rightarrow \text{Physical Object} \rightarrow \text{Memory}$$

### Pillar 2: Open-Ended Creativity (Mindisle Creative Engine)
Characters can invent novel tools, furniture, decorations, buildings, and contraptions. Proposals are translated into validated pixel-art data structures and instantiated as real interactive objects.

### Pillar 3: Grounded Provenance & Memory
Every object carries an immutable history of who built it, why, from which materials, and what inspired it. Characters remember their creations and learn from mistakes.

### Pillar 4: Epistemic Independence & Privacy
Naufal and Lauren have separate minds. They do not share a hivemind or read each other's private thoughts. Knowledge transfers only through in-world perception, observation, conversation, or physical artifacts.

### Pillar 5: True Top-Down Orthogonal Visual Direction
The world is viewed from directly above in an orthogonal 2D grid (Stardew Valley / retro RPG aesthetic). No isometric angles, no side-view perspectives, and no 3D distortion.

## 3. Initial Inhabitants

### Naufal
- **Visual**: Ruffled charcoal slate hair, white linen shirt with cobalt adventurer vest, leather belt with canteen, sturdy boots.
- **Personality Archetype**: Pragmatic Explorer & Tinkerer.
- **Behavioral Tendencies**: High curiosity, adventurous exploration, trial-and-error physical experimentation, direct and earnest communication.
- **Core Motivations**: Understanding physical mechanics, crafting functional tools and sturdy shelters, surveying uncharted areas.

### Lauren
- **Visual**: Auburn hair with a white daisy clip, forest green pinafore dress over cream blouse, leather field satchel, emerald boots.
- **Personality Archetype**: Thoughtful Botanist & Storyteller.
- **Behavioral Tendencies**: Deep environmental observation, reflective contemplation, aesthetic appreciation of flora, gentle and empathetic communication.
- **Core Motivations**: Studying plant life and water biomes, crafting comfortable resting spaces, creating expressive decorations, writing observations.

## 4. World Environment

The initial world is a cozy living island (30×20 tiles, 960×640 px):
- **Central Crossroads**: Interlocking cobblestone paths with moss in crevices.
- **Northern Well & Glade**: Ancient stone water well, signpost, lantern post, and ancient sun shrine.
- **Southern Campfire Gathering**: Stone firepit with warm ambient embers, canvas adventurer tent, lantern, and log benches.
- **Western Meadow & Garden**: Lush clover grass, flowering shrubs, wooden fences, and fertile vegetable garden beds.
- **Eastern Vista Pond**: Shimmering water lilies with lotus blossoms, timber bridge, fishing pier, and shoreline bench.

## 5. Action Vocabulary

### Basic Autonomous Actions
- `IDLE`: Resting, breathing, observing surroundings.
- `MOVE`: Pathfinding to a target walkable tile avoiding obstacles.
- `INSPECT`: Examining an adjacent entity, landmark, or object provenance.
- `SPEAK`: Uttering public dialogue audible within hearing range (4 tiles).
- `GATHER`: Harvesting raw materials (wood from fallen branches, stone, herbs).

### Creative & Construction Actions
- `INVENT_IDEA`: Developing a new creative concept driven by an active motivation.
- `DESIGN_SPEC`: Structuring an idea into a formal `ObjectSpecification`.
- `START_PROJECT`: Initializing a multi-step construction project.
- `CONSTRUCT_STEP`: Expending labor and tools on an active project.
- `MODIFY_OBJECT`: Repairing, painting, or altering an existing object.
