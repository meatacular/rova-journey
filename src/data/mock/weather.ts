import { WeatherData } from '@/lib/types';

export const weatherData: Record<string, WeatherData> = {
  auckland: {
    city: 'Auckland',
    current: { temp: 24, condition: 'Partly Cloudy', icon: '⛅', humidity: 68, wind: { speed: 15, direction: 'SW' } },
    forecast: [
      { time: '9am', temp: 22, condition: 'Cloudy' },
      { time: '12pm', temp: 25, condition: 'Partly Cloudy' },
      { time: '3pm', temp: 26, condition: 'Sunny' },
      { time: '6pm', temp: 23, condition: 'Clear' },
    ],
    destination: { city: 'Auckland CBD', temp: 23, condition: 'Partly Cloudy' },
    returnJourney: { temp: 20, condition: 'Clear', summary: 'Fine evening for the drive home. Temperatures dropping to 20 degrees.' },
  },
  wellington: {
    city: 'Wellington',
    current: { temp: 19, condition: 'Windy', icon: '💨', humidity: 72, wind: { speed: 40, direction: 'N' } },
    forecast: [
      { time: '9am', temp: 18, condition: 'Windy' },
      { time: '12pm', temp: 20, condition: 'Partly Cloudy' },
      { time: '3pm', temp: 21, condition: 'Sunny' },
      { time: '6pm', temp: 17, condition: 'Cloudy' },
    ],
    destination: { city: 'Wellington CBD', temp: 18, condition: 'Windy' },
    returnJourney: { temp: 15, condition: 'Cloudy', summary: 'Wind easing this evening. A jacket might be handy for the walk to the car.' },
  },
  christchurch: {
    city: 'Christchurch',
    current: { temp: 27, condition: 'Sunny', icon: '☀️', humidity: 45, wind: { speed: 10, direction: 'NE' } },
    forecast: [
      { time: '9am', temp: 22, condition: 'Sunny' },
      { time: '12pm', temp: 28, condition: 'Sunny' },
      { time: '3pm', temp: 29, condition: 'Sunny' },
      { time: '6pm', temp: 25, condition: 'Clear' },
    ],
    destination: { city: 'Christchurch CBD', temp: 26, condition: 'Sunny' },
    returnJourney: { temp: 23, condition: 'Clear', summary: 'Beautiful Canterbury evening ahead. Still warm for the drive home.' },
  },
  hamilton: {
    city: 'Hamilton',
    current: { temp: 25, condition: 'Humid', icon: '🌤️', humidity: 78, wind: { speed: 8, direction: 'E' } },
    forecast: [
      { time: '9am', temp: 23, condition: 'Cloudy' },
      { time: '12pm', temp: 26, condition: 'Humid' },
      { time: '3pm', temp: 27, condition: 'Thunderstorms' },
      { time: '6pm', temp: 22, condition: 'Showers' },
    ],
    destination: { city: 'Hamilton CBD', temp: 24, condition: 'Humid' },
    returnJourney: { temp: 20, condition: 'Showers', summary: 'Afternoon thunderstorms likely. Keep your wipers ready for the drive home.' },
  },
};
