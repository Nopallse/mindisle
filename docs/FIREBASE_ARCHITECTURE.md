# Mindisle — Firebase Cloud Architecture

## 1. Architectural Strategy

Mindisle replaces traditional relational databases (PostgreSQL/Prisma) with a fully managed cloud architecture built on **Google Firebase**:
- **Google Cloud Firestore**: Realtime NoSQL document database managing world state, character mental models, object instances, provenance, and logs.
- **Firebase Storage**: Object storage bucket housing binary pixel-art PNGs, animated spritesheets, and audio clips.
- **Firebase Admin SDK**: Node.js server-side SDK executed exclusively within Next.js Server Actions and API routes with privileged service account credentials.

```mermaid
graph TD
    subgraph "Client Browser"
        PhaserGame[Phaser 3 Engine]
        ObserverDashboard[Next.js Observer UI]
        FirebaseClientSDK[Firebase Client SDK (Read-Only)]
    end

    subgraph "Server Boundary (Next.js Node.js Environment)"
        NextServer[Next.js Server Actions / API Routes]
        FirebaseAdminSDK[Firebase Admin SDK (Privileged)]
        GeminiClient[Google Gen AI Client]
        SimCoordinator[Authoritative Simulation Loop]
    end

    subgraph "Google Cloud Infrastructure"
        FirestoreDB[(Cloud Firestore)]
        StorageBucket[(Cloud Storage for Firebase)]
        GeminiAPI[Google Gemini API]
    end

    ObserverDashboard --> FirebaseClientSDK
    FirebaseClientSDK -->|Public Subscriptions| FirestoreDB
    PhaserGame -->|Download Assets| StorageBucket

    ObserverDashboard -->|User Commands| NextServer
    NextServer --> FirebaseAdminSDK
    NextServer --> GeminiClient
    SimCoordinator --> FirebaseAdminSDK

    FirebaseAdminSDK -->|Privileged Reads & Writes| FirestoreDB
    FirebaseAdminSDK -->|Upload Pixel Assets| StorageBucket
    GeminiClient --> GeminiAPI
```

---

## 2. Collection Hierarchy & Query Patterns

```text
worlds/{worldId}/
  ├── metadata
  ├── state/current
  ├── characters/{characterId}
  │   ├── memories/{memoryId}
  │   ├── knowledge/{knowledgeId}
  │   └── goals/{goalId}
  ├── objects/{objectId}
  ├── assetDefinitions/{assetId}
  ├── creationProjects/{projectId}
  ├── resources/{resourceId}
  ├── provenance/{provenanceId}
  └── events/{eventId}
```

### Key Query Patterns

| Use Case | Query Implementation | Index Requirements |
| :--- | :--- | :--- |
| **World State Sync** | `doc('worlds/{worldId}/state/current').get()` | Primary document key |
| **Character State** | `collection('worlds/{worldId}/characters').get()` | Default collection index |
| **Private Memories** | `collection('.../characters/naufal/memories').orderBy('createdAt', 'desc').limit(10)` | Single field index on `createdAt` |
| **Active Projects** | `collection('.../creationProjects').where('status', 'in', ['planning', 'in_progress'])` | Composite: `status` + `createdAt` |
| **World Event Stream** | `collection('.../events').orderBy('createdAt', 'desc').limit(50)` | Single field index on `createdAt` |
| **Object Provenance** | `doc('worlds/{worldId}/provenance/{provenanceId}').get()` | Primary document key |

---

## 3. Transactions & Concurrency

To ensure atomicity during construction and material consumption, the server uses Firestore transactions:

```typescript
import { getAdminFirestore } from '@/firebase/admin';

export async function completeConstructionTransaction(
  worldId: string,
  projectId: string,
  objectId: string,
  objectDoc: Record<string, unknown>,
  provenanceDoc: Record<string, unknown>
): Promise<void> {
  const db = getAdminFirestore();
  const projectRef = db.doc(`worlds/${worldId}/creationProjects/${projectId}`);
  const objectRef = db.doc(`worlds/${worldId}/objects/${objectId}`);
  const provenanceRef = db.doc(`worlds/${worldId}/provenance/${objectDoc.provenanceId}`);

  await db.runTransaction(async (transaction) => {
    const projectSnap = await transaction.get(projectRef);
    if (!projectSnap.exists || projectSnap.data()?.status !== 'in_progress') {
      throw new Error('Project is not in a valid state for completion');
    }

    // 1. Mark project completed
    transaction.update(projectRef, { status: 'completed', completedAt: Date.now() });
    // 2. Instantiate physical object
    transaction.set(objectRef, objectDoc);
    // 3. Write immutable provenance log
    transaction.set(provenanceRef, provenanceDoc);
  });
}
```

---

## 4. Security Rules & Privacy Boundaries

Firebase Security Rules enforce that:
1. **Unauthenticated Public Clients**: May read `worlds/{worldId}/state`, `worlds/{worldId}/objects`, `worlds/{worldId}/events`, and public character cards.
2. **Private Mental Subcollections**: Direct client reads to `characters/{characterId}/memories` and `characters/{characterId}/knowledge` are blocked unless authenticated with matching character credentials or server admin tokens.
3. **Write Protection**: All writes to `objects`, `state`, `creationProjects`, and `provenance` are strictly restricted to the server-side Firebase Admin SDK. Web clients cannot write arbitrary documents directly.

