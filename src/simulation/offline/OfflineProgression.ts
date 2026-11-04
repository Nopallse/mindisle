import { Character } from '../entities/Character';
import { WorldClock } from '../clock/WorldClock';
import { NeedsSystem } from '../needs/NeedsSystem';
import { WeatherSystem } from '../weather/WeatherSystem';

export interface OfflineProgressionResult {
  elapsedSimulationMinutes: number;
  startClock: { day: number; hour: number; minute: number };
  endClock: { day: number; hour: number; minute: number };
  weather: string;
  characterUpdates: Array<{
    id: string;
    energyDelta: number;
    finalEnergy: number;
    comfortDelta: number;
    finalComfort: number;
  }>;
}

export class OfflineProgression {
  public static advanceOffline(
    clock: WorldClock,
    characters: Character[],
    elapsedRealSeconds: number
  ): OfflineProgressionResult {
    const start = { ...clock.getTime() };
    const simMinutes = Math.floor(elapsedRealSeconds / 2); // 2 real seconds = 1 sim minute at 1x

    // Advance clock mathematically
    for (let i = 0; i < simMinutes; i++) {
      clock.advanceMinutes(1);
    }

    const end = { ...clock.getTime() };
    const weather = WeatherSystem.getWeatherForTime(end.day, end.hour);
    const updates: OfflineProgressionResult['characterUpdates'] = [];

    for (const char of characters) {
      const isNearCampfire = Math.hypot(char.tileX - 12, char.tileY - 10) <= 2;
      const initialEnergy = char.attributes.energy;
      const initialComfort = (char.attributes as any).comfort ?? 80;

      const updated = NeedsSystem.updateNeeds(
        {
          energy: initialEnergy,
          curiosity: char.attributes.curiosity,
          comfort: initialComfort,
          sociability: char.attributes.sociability,
        },
        simMinutes,
        {
          isNearCampfire,
          isResting: isNearCampfire,
          isWalking: false,
          isRaining: weather.current === 'rainy',
          recentlySpoke: false,
        }
      );

      char.attributes.energy = Math.round(updated.energy);
      char.attributes.curiosity = Math.round(updated.curiosity);
      char.attributes.sociability = Math.round(updated.sociability);
      (char.attributes as any).comfort = Math.round(updated.comfort);

      updates.push({
        id: char.id,
        energyDelta: Math.round(updated.energy - initialEnergy),
        finalEnergy: char.attributes.energy,
        comfortDelta: Math.round(updated.comfort - initialComfort),
        finalComfort: (char.attributes as any).comfort,
      });
    }

    return {
      elapsedSimulationMinutes: simMinutes,
      startClock: { day: start.day, hour: start.hour, minute: start.minute },
      endClock: { day: end.day, hour: end.hour, minute: end.minute },
      weather: weather.current,
      characterUpdates: updates,
    };
  }
}
