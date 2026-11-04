import { WeatherState, WeatherType } from '../../types/needs';

export class WeatherSystem {
  public static getWeatherForTime(day: number, hour: number): WeatherState {
    // Deterministic mathematical weather schedule
    const cycleDay = ((day - 1) % 3) + 1; // 3-day deterministic weather cycle

    let current: WeatherType = 'sunny';
    let temp = 22;
    let wind = 8;
    let rain = 0.0;

    if (cycleDay === 1) {
      if (hour >= 17 && hour < 20) {
        current = 'sunny'; // Golden sunset
        temp = 20;
      } else if (hour >= 20 || hour < 6) {
        current = 'sunny'; // Clear starry night
        temp = 16;
      } else {
        current = 'sunny';
        temp = 24;
      }
    } else if (cycleDay === 2) {
      if (hour >= 9 && hour <= 14) {
        current = 'rainy';
        temp = 17;
        wind = 16;
        rain = 0.6;
      } else if (hour > 14 && hour < 18) {
        current = 'cloudy';
        temp = 19;
        wind = 10;
        rain = 0.1;
      } else {
        current = 'sunny';
        temp = 21;
      }
    } else if (cycleDay === 3) {
      if (hour >= 5 && hour <= 8) {
        current = 'misty';
        temp = 15;
        wind = 4;
      } else {
        current = 'sunny';
        temp = 23;
        wind = 7;
      }
    }

    return {
      current,
      temperatureCelsius: temp,
      windSpeedKmh: wind,
      rainIntensity: rain,
    };
  }
}
