import { CharacterId } from '../types/character';
import { WorldState } from '../simulation/world/WorldState';
import { WorldEvent } from '../types/events';
import { WorldSnapshot } from '../types/world';

export type CameraAction =
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'RESET_ZOOM' }
  | { type: 'FOCUS_CHARACTER'; characterId: CharacterId };

type CameraActionListener = (action: CameraAction) => void;

export class GameBridge {
  private static instance: GameBridge;
  private cameraListeners: Set<CameraActionListener> = new Set();
  private selectedCharacterId: CharacterId | null = 'naufal';
  private selectionListeners: Set<(id: CharacterId | null) => void> = new Set();

  public static getInstance(): GameBridge {
    if (!GameBridge.instance) {
      GameBridge.instance = new GameBridge();
    }
    return GameBridge.instance;
  }

  // Camera controls
  public onCameraAction(listener: CameraActionListener): () => void {
    this.cameraListeners.add(listener);
    return () => this.cameraListeners.delete(listener);
  }

  public zoomIn(): void {
    this.dispatchCameraAction({ type: 'ZOOM_IN' });
  }

  public zoomOut(): void {
    this.dispatchCameraAction({ type: 'ZOOM_OUT' });
  }

  public resetZoom(): void {
    this.dispatchCameraAction({ type: 'RESET_ZOOM' });
  }

  public focusCharacter(characterId: CharacterId): void {
    this.setSelectedCharacter(characterId);
    this.dispatchCameraAction({ type: 'FOCUS_CHARACTER', characterId });
  }

  private dispatchCameraAction(action: CameraAction): void {
    for (const listener of this.cameraListeners) {
      listener(action);
    }
  }

  // Character selection
  public setSelectedCharacter(id: CharacterId | null): void {
    this.selectedCharacterId = id;
    for (const listener of this.selectionListeners) {
      listener(id);
    }
  }

  public getSelectedCharacter(): CharacterId | null {
    return this.selectedCharacterId;
  }

  public onSelectionChange(listener: (id: CharacterId | null) => void): () => void {
    this.selectionListeners.add(listener);
    return () => this.selectionListeners.delete(listener);
  }

  // Simulation controls forwarding to authoritative WorldState
  public togglePause(): boolean {
    const world = WorldState.getInstance();
    const paused = world.clock.togglePause();
    world.addEvent('SYSTEM', paused ? 'Simulation paused by observer.' : 'Simulation resumed.');
    return paused;
  }

  public setSpeed(speed: number): void {
    const world = WorldState.getInstance();
    world.clock.setSpeed(speed);
    world.addEvent('SYSTEM', `Simulation speed set to ${speed}x.`);
  }

  public setWorldTime(hour: number, minute: number = 0): void {
    const world = WorldState.getInstance();
    world.clock.setTime(hour, minute);
    world.addEvent('TIME', `Observer changed world time to ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}.`);
  }

  public getSnapshot(): WorldSnapshot {
    return WorldState.getInstance().getSnapshot();
  }

  public getEvents(): WorldEvent[] {
    return WorldState.getInstance().getEvents();
  }
}

