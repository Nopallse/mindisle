import { describe, it, expect, beforeEach } from 'vitest';
import { WorldClock } from '../src/simulation/clock/WorldClock';
import { GridMap } from '../src/simulation/navigation/GridMap';
import { CollisionSystem } from '../src/simulation/navigation/CollisionSystem';
import { Character } from '../src/simulation/entities/Character';
import { WorldState } from '../src/simulation/world/WorldState';

describe('WorldClock', () => {
  let clock: WorldClock;

  beforeEach(() => {
    clock = new WorldClock(1, 8, 0);
  });

  it('initializes with default day 1, 08:00', () => {
    const time = clock.getTime();
    expect(time.day).toBe(1);
    expect(time.hour).toBe(8);
    expect(time.minute).toBe(0);
    expect(time.isPaused).toBe(false);
  });

  it('advances minutes as delta time accumulates', () => {
    clock.update(500); // 1 sim minute
    expect(clock.getTime().minute).toBe(1);
    clock.update(1000); // 2 more sim minutes
    expect(clock.getTime().minute).toBe(3);
  });

  it('rolls over hour when minutes reach 60', () => {
    clock.update(500 * 60); // 60 minutes
    const time = clock.getTime();
    expect(time.hour).toBe(9);
    expect(time.minute).toBe(0);
  });

  it('does not advance when paused', () => {
    clock.setPaused(true);
    clock.update(5000);
    expect(clock.getTime().minute).toBe(0);
    expect(clock.getTime().isPaused).toBe(true);
  });

  it('scales progression by speed multiplier', () => {
    clock.setSpeed(2); // 2x
    clock.update(500); // at 2x, 500ms should advance 2 sim minutes
    expect(clock.getTime().minute).toBe(2);
  });
});

describe('GridMap & CollisionSystem', () => {
  let map: GridMap;
  let collision: CollisionSystem;

  beforeEach(() => {
    map = new GridMap(30, 20, 32);
    collision = new CollisionSystem(map);
  });

  it('creates a 30x20 orthogonal grid', () => {
    expect(map.width).toBe(30);
    expect(map.height).toBe(20);
  });

  it('enforces non-walkable boundaries (perimeter trees)', () => {
    expect(map.isWalkable(0, 0)).toBe(false);
    expect(map.isWalkable(0, 10)).toBe(false);
    expect(map.isWalkable(29, 10)).toBe(false);
  });

  it('allows walking on grass and paths', () => {
    // Cobblestone path intersection at (10, 10)
    expect(map.isWalkable(10, 10)).toBe(true);
    // Grass meadow
    expect(map.isWalkable(11, 11)).toBe(true);
  });

  it('blocks water tiles in the pond', () => {
    // Pond area (x: 18-24, y: 7-14) except bridge at y: 10
    expect(map.isWalkable(20, 8)).toBe(false);
    expect(map.getTile(20, 8)?.type).toBe('water');
  });

  it('allows crossing the pond via the bridge at y: 10', () => {
    expect(map.isWalkable(20, 10)).toBe(true);
    expect(map.getTile(20, 10)?.type).toBe('bridge');
  });

  it('prevents walking into another character (occupant collision)', () => {
    const occupants = [
      { id: 'lauren' as const, tileX: 10, tileY: 11 },
    ];
    // Naufal trying to walk into (10, 11) where Lauren is
    expect(collision.canMoveTo(10, 11, occupants, 'naufal')).toBe(false);
    // Walking into an empty walkable tile
    expect(collision.canMoveTo(10, 9, occupants, 'naufal')).toBe(true);
  });

  it('rejects out of bounds coordinates', () => {
    expect(collision.canMoveTo(-1, 5)).toBe(false);
    expect(collision.canMoveTo(35, 5)).toBe(false);
    expect(collision.canMoveTo(5, -5)).toBe(false);
    expect(collision.canMoveTo(5, 25)).toBe(false);
  });
});

describe('Character & WorldState', () => {
  it('initializes Naufal and Lauren with distinct identities and positions', () => {
    const world = new WorldState();
    const snapshot = world.getSnapshot();

    expect(snapshot.characters.naufal.name).toBe('Naufal');
    expect(snapshot.characters.naufal.tileX).toBe(10);
    expect(snapshot.characters.naufal.tileY).toBe(10);

    expect(snapshot.characters.lauren.name).toBe('Lauren');
    expect(snapshot.characters.lauren.tileX).toBe(14);
    expect(snapshot.characters.lauren.tileY).toBe(10);
  });

  it('records initial system events for world and characters', () => {
    const world = new WorldState();
    const events = world.getEvents();
    expect(events.length).toBeGreaterThanOrEqual(3);
    expect(events.some((e) => e.message.includes('World simulation initialized'))).toBe(true);
    expect(events.some((e) => e.message.includes('Naufal entered'))).toBe(true);
    expect(events.some((e) => e.message.includes('Lauren entered'))).toBe(true);
  });
});

