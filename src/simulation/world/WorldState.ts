import { CharacterId, CharacterSnapshot } from '../../types/character';
import { WorldEvent, WorldEventType } from '../../types/events';
import { WorldSnapshot } from '../../types/world';
import { WorldClock } from '../clock/WorldClock';
import { Character } from '../entities/Character';
import { EventBus } from '../events/EventBus';
import { CollisionSystem } from '../navigation/CollisionSystem';
import { GridMap } from '../navigation/GridMap';
import { AgentOrchestrator } from '../../ai/orchestrator/AgentOrchestrator';

export class WorldState {
  private static instance: WorldState;

  public readonly gridMap: GridMap;
  public readonly collisionSystem: CollisionSystem;
  public readonly clock: WorldClock;
  public readonly eventBus: EventBus;
  public readonly agentOrchestrator: AgentOrchestrator;

  public readonly characters: Map<CharacterId, Character> = new Map();
  private eventHistory: WorldEvent[] = [];
  private eventCounter = 0;

  private isRunning: boolean = false;
  private lastUpdateTimestamp: number = 0;

  constructor() {
    this.gridMap = new GridMap(30, 20, 32);
    this.collisionSystem = new CollisionSystem(this.gridMap);
    this.clock = new WorldClock(1, 8, 0);
    this.eventBus = EventBus.getInstance();
    this.agentOrchestrator = AgentOrchestrator.getInstance();

    this.initializeCharacters();
    this.initializeEvents();
  }

  public static getInstance(): WorldState {
    if (!WorldState.instance) {
      WorldState.instance = new WorldState();
    }
    return WorldState.instance;
  }

  private initializeCharacters(): void {
    // 1. Naufal: Male, Blue vest/shirt (tile: 10, 10)
    const naufal = new Character('naufal', 'Naufal', '#3b82f6', 10, 10, 32, {
      energy: 95,
      curiosity: 90,
      sociability: 85,
    });

    // 2. Lauren: Female, Olive/Green tunic (tile: 14, 10)
    const lauren = new Character('lauren', 'Lauren', '#10b981', 14, 10, 32, {
      energy: 90,
      curiosity: 88,
      sociability: 82,
    });

    this.characters.set('naufal', naufal);
    this.characters.set('lauren', lauren);
  }

  private initializeEvents(): void {
    this.addEvent('SYSTEM', 'World simulation initialized.');
    this.addEvent('SYSTEM', 'Naufal entered the world at tile (10, 10).', 'naufal');
    this.addEvent('SYSTEM', 'Lauren entered the world at tile (14, 10).', 'lauren');

    // Subscribe to clock hour change
    this.clock.onHourChange((hour, day) => {
      const hh = String(hour).padStart(2, '0');
      this.addEvent('TIME', `Day ${day} clock advanced to ${hh}:00.`);
    });
  }

  public update(deltaMs: number): void {
    // 1. Update clock
    this.clock.update(deltaMs);

    // If clock is paused, character autonomous actions also pause
    if (this.clock.getTime().isPaused) {
      return;
    }

    // Adjusted simulation delta based on speed multiplier
    const simDelta = deltaMs * this.clock.getTime().speed;

    // 2. Update characters
    const allChars = Array.from(this.characters.values());
    for (const char of allChars) {
      const result = char.update(simDelta, this.collisionSystem, allChars);
      if (result.moved && result.prevTile) {
        this.addEvent(
          'MOVEMENT',
          `${char.name} moved to tile (${char.tileX}, ${char.tileY}).`,
          char.id
        );
      }
    }

    // 3. Update agent deliberation and decision cycles
    this.agentOrchestrator.update(simDelta, this);

    // 4. Emit simulation tick update
    this.eventBus.emit('worldTick', this.getSnapshot());
  }

  public addEvent(type: WorldEventType, message: string, characterId?: CharacterId): WorldEvent {
    this.eventCounter += 1;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const event: WorldEvent = {
      id: `evt-${this.eventCounter}-${Date.now()}`,
      timestamp: `${hh}:${mm}:${ss}`,
      worldTime: this.clock.getFormattedTime(),
      type,
      message,
      characterId,
    };

    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 100) {
      this.eventHistory.pop();
    }

    this.eventBus.emit('worldEvent', event);
    return event;
  }

  public getEvents(): WorldEvent[] {
    return [...this.eventHistory];
  }

  public getCharacter(id: CharacterId): Character | undefined {
    return this.characters.get(id);
  }

  public getSnapshot(): WorldSnapshot {
    const charSnapshots: Record<CharacterId, CharacterSnapshot> = {} as Record<
      CharacterId,
      CharacterSnapshot
    >;
    for (const [id, char] of this.characters.entries()) {
      charSnapshots[id] = char.getSnapshot();
    }

    return {
      time: this.clock.getTime(),
      characters: charSnapshots,
      mapWidth: this.gridMap.width,
      mapHeight: this.gridMap.height,
      tileSize: this.gridMap.tileSize,
    };
  }
}

