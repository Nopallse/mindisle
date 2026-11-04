import { describe, it, expect, beforeEach } from 'vitest';
import { NeedsSystem } from '../src/simulation/needs/NeedsSystem';
import { WeatherSystem } from '../src/simulation/weather/WeatherSystem';
import { OfflineProgression } from '../src/simulation/offline/OfflineProgression';
import { WorldClock } from '../src/simulation/clock/WorldClock';
import { Character } from '../src/simulation/entities/Character';
import { CharacterNeeds } from '../src/types/needs';

describe('Phase 5 — Autonomous Living World & Offline Progression', () => {
  let initialNeeds: CharacterNeeds;

  beforeEach(() => {
    initialNeeds = {
      energy: 80,
      curiosity: 70,
      comfort: 80,
      sociability: 75,
    };
  });

  describe('1. Dynamic Needs System & Contextual Modifiers', () => {
    it('decays energy and curiosity slowly during idle daytime', () => {
      const updated = NeedsSystem.updateNeeds(initialNeeds, 30, {
        isNearCampfire: false,
        isResting: false,
        isWalking: false,
        isRaining: false,
        recentlySpoke: false,
      });

      expect(updated.energy).toBeLessThan(initialNeeds.energy);
      expect(updated.curiosity).toBeLessThan(initialNeeds.curiosity);
      expect(updated.comfort).toBeLessThan(initialNeeds.comfort);
    });

    it('restores energy and comfort when resting near a warm campfire', () => {
      const wearyNeeds: CharacterNeeds = {
        energy: 25,
        curiosity: 50,
        comfort: 30,
        sociability: 60,
      };

      const updated = NeedsSystem.updateNeeds(wearyNeeds, 20, {
        isNearCampfire: true,
        isResting: true,
        isWalking: false,
        isRaining: false,
        recentlySpoke: false,
      });

      expect(updated.energy).toBeGreaterThan(wearyNeeds.energy);
      expect(updated.comfort).toBeGreaterThan(wearyNeeds.comfort);
    });

    it('accelerates comfort loss when caught in rain', () => {
      const clearUpdate = NeedsSystem.updateNeeds(initialNeeds, 30, {
        isNearCampfire: false,
        isResting: false,
        isWalking: false,
        isRaining: false,
        recentlySpoke: false,
      });

      const rainUpdate = NeedsSystem.updateNeeds(initialNeeds, 30, {
        isNearCampfire: false,
        isResting: false,
        isWalking: false,
        isRaining: true,
        recentlySpoke: false,
      });

      expect(rainUpdate.comfort).toBeLessThan(clearUpdate.comfort);
    });
  });

  describe('2. Motivation Appraisal & Emotional State', () => {
    it('appraises low energy as high-priority resting goal', () => {
      const exhaustedNeeds: CharacterNeeds = {
        energy: 20,
        curiosity: 60,
        comfort: 60,
        sociability: 60,
      };

      const goals = NeedsSystem.appraiseMotivations(exhaustedNeeds);
      expect(goals.length).toBeGreaterThan(0);
      expect(goals[0].category).toBe('rest');
      expect(goals[0].priority).toBe(9);
      expect(goals[0].targetLandmark).toBe('Campfire');
    });

    it('appraises low sociability as a desire to seek conversation', () => {
      const lonelyNeeds: CharacterNeeds = {
        energy: 70,
        curiosity: 60,
        comfort: 70,
        sociability: 25,
      };

      const goals = NeedsSystem.appraiseMotivations(lonelyNeeds);
      expect(goals.some((g) => g.category === 'socialize')).toBe(true);
    });

    it('computes emotional appraisal based on overall need status', () => {
      const highNeeds: CharacterNeeds = { energy: 90, curiosity: 85, comfort: 90, sociability: 85 };
      const lowNeeds: CharacterNeeds = { energy: 15, curiosity: 40, comfort: 20, sociability: 30 };

      const positiveEmotion = NeedsSystem.computeEmotionalState(highNeeds);
      const negativeEmotion = NeedsSystem.computeEmotionalState(lowNeeds);

      expect(positiveEmotion.valence).toBeGreaterThan(0.5);
      expect(positiveEmotion.label).toBe('joyful');

      expect(negativeEmotion.valence).toBeLessThan(0.0);
      expect(negativeEmotion.label).toBe('exhausted');
    });
  });

  describe('3. Dynamic Weather Schedule', () => {
    it('returns predictable weather matching daily cycle', () => {
      const day1Noon = WeatherSystem.getWeatherForTime(1, 12);
      expect(day1Noon.current).toBe('sunny');
      expect(day1Noon.rainIntensity).toBe(0.0);

      const day2Rain = WeatherSystem.getWeatherForTime(2, 11);
      expect(day2Rain.current).toBe('rainy');
      expect(day2Rain.rainIntensity).toBeGreaterThan(0.3);

      const day3Mist = WeatherSystem.getWeatherForTime(3, 6);
      expect(day3Mist.current).toBe('misty');
    });
  });

  describe('4. Deterministic Offline Progression', () => {
    it('advances world clock and updates character needs mathematically', () => {
      const clock = new WorldClock(1, 8, 0);
      const naufal = new Character('naufal', 'Naufal', '#3b82f6', 12, 10, 32, {
        energy: 40,
        curiosity: 70,
        sociability: 60,
        comfort: 50,
      });

      // Advance offline by 120 real seconds (which equals 60 simulation minutes = 1 hour)
      const result = OfflineProgression.advanceOffline(clock, [naufal], 120);

      expect(result.elapsedSimulationMinutes).toBe(60);
      expect(result.startClock.hour).toBe(8);
      expect(result.endClock.hour).toBe(9);
      expect(result.characterUpdates.length).toBe(1);

      // Naufal is at (12, 10) which is directly next to Campfire (12, 10), so energy and comfort restore
      expect(naufal.attributes.energy).toBeGreaterThan(40);
      expect(naufal.attributes.comfort).toBeGreaterThan(50);
    });
  });
});
