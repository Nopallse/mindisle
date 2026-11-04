import { WorldEvent } from '../../types/events';

type EventListener<T> = (payload: T) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<EventListener<unknown>>> = new Map();

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public emit<T>(event: string, payload: T): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(payload);
      }
    }
  }

  public on<T>(event: string, listener: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const handlers = this.listeners.get(event)!;
    handlers.add(listener as EventListener<unknown>);

    return () => {
      handlers.delete(listener as EventListener<unknown>);
    };
  }

  public clear(): void {
    this.listeners.clear();
  }
}

