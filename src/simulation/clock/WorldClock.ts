import { WorldTime } from '../../types/world';

export type ClockTickListener = (time: WorldTime) => void;
export type HourChangeListener = (hour: number, day: number) => void;

export class WorldClock {
  private day: number = 1;
  private hour: number = 8; // Start at 08:00 AM
  private minute: number = 0;
  private isPaused: boolean = false;
  private speed: number = 1; // 1x, 2x, 5x
  
  // Real ms per simulation minute at 1x speed (e.g. 500ms = 1 sim minute)
  private baseMsPerSimMinute: number = 500;
  private accumulatedMs: number = 0;

  private tickListeners: Set<ClockTickListener> = new Set();
  private hourListeners: Set<HourChangeListener> = new Set();

  constructor(initialDay = 1, initialHour = 8, initialMinute = 0) {
    this.day = initialDay;
    this.hour = initialHour;
    this.minute = initialMinute;
  }

  public update(deltaMs: number): void {
    if (this.isPaused) return;

    this.accumulatedMs += deltaMs * this.speed;
    const msThreshold = this.baseMsPerSimMinute;

    while (this.accumulatedMs >= msThreshold) {
      this.accumulatedMs -= msThreshold;
      this.advanceMinute();
    }
  }

  private advanceMinute(): void {
    this.minute += 1;
    if (this.minute >= 60) {
      this.minute = 0;
      this.hour += 1;
      if (this.hour >= 24) {
        this.hour = 0;
        this.day += 1;
      }
      this.notifyHourChange();
    }
    this.notifyTick();
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
    this.notifyTick();
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    this.notifyTick();
    return this.isPaused;
  }

  public setSpeed(speed: number): void {
    if (speed > 0) {
      this.speed = speed;
      this.notifyTick();
    }
  }

  public setTime(hour: number, minute: number = 0): void {
    this.hour = Math.max(0, Math.min(23, Math.floor(hour)));
    this.minute = Math.max(0, Math.min(59, Math.floor(minute)));
    this.notifyHourChange();
    this.notifyTick();
  }

  public getTime(): WorldTime {
    return {
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      isPaused: this.isPaused,
      speed: this.speed,
    };
  }

  public getFormattedTime(): string {
    const hh = String(this.hour).padStart(2, '0');
    const mm = String(this.minute).padStart(2, '0');
    return `Day ${this.day}, ${hh}:${mm}`;
  }

  public onTick(listener: ClockTickListener): () => void {
    this.tickListeners.add(listener);
    return () => this.tickListeners.delete(listener);
  }

  public onHourChange(listener: HourChangeListener): () => void {
    this.hourListeners.add(listener);
    return () => this.hourListeners.delete(listener);
  }

  private notifyTick(): void {
    const time = this.getTime();
    for (const listener of this.tickListeners) {
      listener(time);
    }
  }

  private notifyHourChange(): void {
    for (const listener of this.hourListeners) {
      listener(this.hour, this.day);
    }
  }
}

