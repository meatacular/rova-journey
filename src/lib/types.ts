export interface Station {
  id: string;
  name: string;
  genre: string;
  color: string;
  tagline: string;
  city?: string;
  logo: string;
  streamUrl: string;
}

export interface Podcast {
  id: string;
  name: string;
  host: string;
  description: string;
  category: string;
  episodeCount: number;
  latestEpisode: {
    title: string;
    duration: number;
    date: string;
  };
}

export interface TrafficRoute {
  id: string;
  city: string;
  from: string;
  to: string;
  normalDuration: number;
  currentDuration: number;
  incidents: TrafficIncident[];
  returnJourney: {
    normalDuration: number;
    currentDuration: number;
    incidents: TrafficIncident[];
  };
}

export interface TrafficIncident {
  type: 'accident' | 'roadworks' | 'congestion' | 'event';
  location: string;
  description: string;
  delay: number;
}

export interface WeatherData {
  city: string;
  current: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    wind: { speed: number; direction: string };
  };
  forecast: WeatherForecast[];
  destination?: {
    city: string;
    temp: number;
    condition: string;
  };
  returnJourney?: {
    temp: number;
    condition: string;
    summary: string;
  };
}

export interface WeatherForecast {
  time: string;
  temp: number;
  condition: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  category: NewsCategory;
  source: string;
  timestamp: string;
}

export type NewsCategory = 'nz' | 'sport' | 'politics' | 'entertainment' | 'business' | 'tech' | 'crime' | 'world';

export type SportCategory = 'rugby' | 'cricket' | 'league' | 'football' | 'netball' | 'tennis' | 'motorsport' | 'other';

export interface Voice {
  id: string;
  name: string;
  description: string;
  personality: string;
  station?: string;
  avatar: string;
  photo: string;
}

export interface MusicBed {
  id: string;
  name: string;
  style: string;
  description: string;
  bpm: number;
}

export type SegmentType = 'traffic' | 'weather' | 'news' | 'sport' | 'entertainment' | 'ad';

export interface JourneySegment {
  id: string;
  type: SegmentType;
  title: string;
  duration: number;
  script?: string;
  status: 'upcoming' | 'playing' | 'done';
  metadata?: Record<string, unknown>;
}

export type NewsLength = 'brief' | 'standard' | 'detailed';

export interface JourneyPreset {
  id: string;
  name: string;
  icon: string;
  from: string;
  to: string;
  segments: {
    traffic: boolean;
    weather: boolean;
    news: boolean;
    sport: boolean;
    entertainment: boolean;
  };
  schedule: {
    enabled: boolean;
    days: number[];
    time: string;
  };
  calendarSync: boolean;
  isDefault: boolean;
}

export interface UserPreferences {
  homeAddress: string;
  workAddress: string;
  city: string;
  traffic: {
    enabled: boolean;
  };
  weather: {
    enabled: boolean;
  };
  news: {
    enabled: boolean;
    categories: NewsCategory[];
    length: NewsLength;
  };
  sport: {
    enabled: boolean;
    categories: SportCategory[];
    length: NewsLength;
  };
  calendar: {
    connected: boolean;
    provider: 'google' | 'apple' | 'microsoft' | null;
  };
  voiceSpeed: number;
  entertainment: {
    type: 'station' | 'podcast';
    stationId: string;
    podcastId: string;
  };
  voiceId: string;
  musicBed: {
    mode: 'auto' | 'manual' | 'none';
    styleId: string;
  };
  journeys: JourneyPreset[];
}

export interface JourneyState {
  isActive: boolean;
  isBuilding: boolean;
  isPlaying: boolean;
  segments: JourneySegment[];
  currentSegmentIndex: number;
  elapsedTime: number;
}
