---
name: neon-prisma-data
description: Designs and implements EDEN's Neon PostgreSQL and Prisma schema, migrations, repositories, persistence, indexes, and transactional world state.
---

# Neon + Prisma Data Engineering

## Responsibilities

Manage EDEN persistence.

Use when implementing:
- Neon PostgreSQL.
- Prisma models.
- Migrations.
- Repositories.
- Memory persistence.
- World state.

## Rules

- Inspect existing schema before changes.
- Use Prisma migrations.
- Never destructively reset existing databases.
- Separate stable character profile from mutable state.
- Enforce character memory ownership.
- Add indexes for common queries.
- Use transactions for atomic updates.
- Store timestamps in UTC.
- Keep database access server-side.
- Never store API keys in the database.

## Neon Guidance

Verify pooled and direct connection requirements for the selected Prisma version.

Use DATABASE_URL and DIRECT_URL according to current official Prisma and Neon documentation.

Do not invent connection parameters.

## pgvector

Do not assume extension availability.

Verify:
- Neon support.
- Extension activation.
- Prisma compatibility.
- Migration approach.

Implement ordinary SQL retrieval as a fallback.

## Acceptance

- Migrations apply safely.
- Repositories are tested.
- Memory ownership is enforced.
- Important state/event writes are atomic.

