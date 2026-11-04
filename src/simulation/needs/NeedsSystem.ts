import { CharacterNeeds, MotivationGoal } from '../../types/needs';
import { SimulatedEmotion } from '../../types/ai';

export interface NeedsUpdateContext {
  isNearCampfire: boolean;
  isResting: boolean;
  isWalking: boolean;
  isRaining: boolean;
  recentlySpoke: boolean;
}

export class NeedsSystem {
  // Decay rates per simulation minute
  public static readonly DECAY_ENERGY_BASE = 0.05;
  public static readonly DECAY_ENERGY_WALKING = 0.15;
  public static readonly RESTORE_ENERGY_RESTING = 0.40;

  public static readonly DECAY_CURIOSITY_BASE = 0.04;
  public static readonly RESTORE_CURIOSITY_EXPLORING = 0.35;

  public static readonly DECAY_COMFORT_BASE = 0.03;
  public static readonly DECAY_COMFORT_RAIN = 0.12;
  public static readonly RESTORE_COMFORT_CAMPFIRE = 0.30;

  public static readonly DECAY_SOCIABILITY_BASE = 0.03;
  public static readonly RESTORE_SOCIABILITY_TALK = 0.40;

  public static updateNeeds(
    needs: CharacterNeeds,
    deltaMinutes: number,
    ctx: NeedsUpdateContext
  ): CharacterNeeds {
    // 1. Energy
    let energyDelta = -NeedsSystem.DECAY_ENERGY_BASE * deltaMinutes;
    if (ctx.isWalking) {
      energyDelta = -NeedsSystem.DECAY_ENERGY_WALKING * deltaMinutes;
    } else if (ctx.isResting) {
      energyDelta = NeedsSystem.RESTORE_ENERGY_RESTING * deltaMinutes;
    }

    // 2. Curiosity
    let curiosityDelta = -NeedsSystem.DECAY_CURIOSITY_BASE * deltaMinutes;
    if (ctx.isWalking) {
      curiosityDelta = NeedsSystem.RESTORE_CURIOSITY_EXPLORING * deltaMinutes;
    }

    // 3. Comfort
    let comfortDelta = -NeedsSystem.DECAY_COMFORT_BASE * deltaMinutes;
    if (ctx.isRaining && !ctx.isResting) {
      comfortDelta = -NeedsSystem.DECAY_COMFORT_RAIN * deltaMinutes;
    }
    if (ctx.isNearCampfire) {
      comfortDelta += NeedsSystem.RESTORE_COMFORT_CAMPFIRE * deltaMinutes;
    }

    // 4. Sociability
    let sociabilityDelta = -NeedsSystem.DECAY_SOCIABILITY_BASE * deltaMinutes;
    if (ctx.recentlySpoke) {
      sociabilityDelta = NeedsSystem.RESTORE_SOCIABILITY_TALK * deltaMinutes;
    }

    return {
      energy: Math.max(0, Math.min(100, needs.energy + energyDelta)),
      curiosity: Math.max(0, Math.min(100, needs.curiosity + curiosityDelta)),
      comfort: Math.max(0, Math.min(100, needs.comfort + comfortDelta)),
      sociability: Math.max(0, Math.min(100, needs.sociability + sociabilityDelta)),
    };
  }

  public static appraiseMotivations(needs: CharacterNeeds): MotivationGoal[] {
    const goals: MotivationGoal[] = [];

    if (needs.energy < 30) {
      goals.push({
        id: 'goal-rest',
        category: 'rest',
        description: 'Feeling exhausted. Need to find a warm place near campfire to rest.',
        targetLandmark: 'Campfire',
        targetTile: { x: 12, y: 10 },
        priority: 9,
      });
    }

    if (needs.comfort < 35) {
      goals.push({
        id: 'goal-comfort',
        category: 'shelter',
        description: 'Feeling cold or uncomfortable. Seeking campfire warmth or sheltered bench.',
        targetLandmark: 'Campfire',
        targetTile: { x: 12, y: 10 },
        priority: 8,
      });
    }

    if (needs.sociability < 35) {
      goals.push({
        id: 'goal-social',
        category: 'socialize',
        description: 'Craving companionship. Seeking out my island companion for a conversation.',
        priority: 7,
      });
    }

    if (needs.curiosity < 35) {
      goals.push({
        id: 'goal-explore',
        category: 'explore',
        description: 'Bored of sitting still. Want to explore the pier and garden.',
        targetLandmark: 'Wooden Pier',
        targetTile: { x: 17, y: 14 },
        priority: 6,
      });
    }

    goals.sort((a, b) => b.priority - a.priority);
    return goals;
  }

  public static computeEmotionalState(needs: CharacterNeeds): SimulatedEmotion {
    const avg = (needs.energy + needs.curiosity + needs.comfort + needs.sociability) / 4;

    if (needs.energy < 25) {
      return { valence: -0.4, arousal: 0.1, label: 'exhausted' };
    }
    if (needs.comfort < 30) {
      return { valence: -0.3, arousal: 0.4, label: 'uncomfortable' };
    }
    if (needs.sociability < 30) {
      return { valence: -0.2, arousal: 0.2, label: 'lonely' };
    }
    if (avg >= 75) {
      return { valence: 0.8, arousal: 0.5, label: 'joyful' };
    }
    if (avg >= 50) {
      return { valence: 0.4, arousal: 0.3, label: 'content' };
    }

    return { valence: 0.0, arousal: 0.3, label: 'neutral' };
  }
}
