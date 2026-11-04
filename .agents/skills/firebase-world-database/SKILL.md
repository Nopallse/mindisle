---
name: firebase-world-database
description: Designs and implements Mindisle's primary persistent cloud database on Google Cloud Firebase Firestore, document schemas, subcollections, transactions, atomic world writes, pagination, and data isolation.
---

# Firebase World Database

Responsible for persistent world state, character data, object instances, creation projects, and event records in Firebase Firestore.

Replaces the legacy Neon PostgreSQL / Prisma stack.

## Schema Architecture

```text
worlds/{worldId}
  ├── metadata                        # Name, seed, dimensions, creator, creation timestamp
  ├── state/current                   # Day, hour, minute, active weather, simulation speed
  ├── characters/{characterId}        # Naufal, Lauren profile, position, facing, needs, stats
  │   ├── memories/{memoryId}         # Episodic, semantic, reflective memories (character private)
  │   ├── knowledge/{knowledgeId}     # Discovered recipes, material facts, beliefs
  │   └── goals/{goalId}              # Active, queued, completed motivations
  ├── objects/{objectId}              # Physical instances in the world (x, y, assetDefinitionId, provenance)
  ├── assetDefinitions/{assetId}      # Object specifications, dimensions, collision, pixel metadata
  ├── creationProjects/{projectId}    # Ongoing & historical crafts, required materials, builders, status
  ├── resources/{resourceId}          # Harvestable world resource nodes (trees, stone deposits, clay)
  ├── events/{eventId}                # Chronological public and system simulation event log
  └── relationships/{relationId}      # Directed relationship metrics from character A to B
```

## Architectural Rules

1. **Document Size Limits (< 1 MB)**: Never store large binary images, full spritesheets, or gigantic unbounded arrays in Firestore documents. Store metadata, compact matrices, or Storage URLs.
2. **Subcollection Isolation**: Private data (character memories, personal knowledge) must reside in character subcollections to prevent accidental cross-character leakage.
3. **Atomic State Mutations**: Use Firestore `runTransaction()` for critical multi-document updates (e.g., deducting inventory resources while completing an object instance).
4. **Pagination for Large Streams**: `events` and `memories` collections must use `.orderBy('createdAt', 'desc').limit(pageSize)` and `.startAfter(cursor)` pagination.
5. **Server-Side Security**: Administrative writes, simulation updates, and private data mutations run server-side using the Firebase Admin SDK. Web clients access sanitized public reads.

## Dependencies

- Coordinates with: `firebase-asset-persistence`, `causality-engine`, `world-provenance`, `memory-systems`, `security-and-secrets`.

