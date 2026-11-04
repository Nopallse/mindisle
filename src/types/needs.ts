export interface CharacterNeeds {
  energy: number; // 0 (exhausted) - 100 (fully rested)
  curiosity: number; // 0 (bored) - 100 (actively engaged)
  comfort: number; // 0 (miserable/wet) - 100 (cozy/warm)
  sociability: number; // 0 (lonely) - 100 (socially fulfilled)
}

export type WeatherType = 'sunny' | 'rainy' | 'misty' | 'cloudy';

export interface WeatherState {
  current: WeatherType;
  temperatureCelsius: number;
  windSpeedKmh: number;
  rainIntensity: number; // 0.0 to 1.0
}

export interface MotivationGoal {
  id: string;
  category: 'rest' | 'explore' | 'socialize' | 'shelter' | 'craft';
  description: string;
  targetLandmark?: string;
  targetTile?: { x: number; y: number };
  priority: number; // 1 to 10
}
