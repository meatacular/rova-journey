import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences, NewsCategory, SportCategory, JourneyPreset } from '@/lib/types';

interface PreferencesStore extends UserPreferences {
  setHomeAddress: (address: string) => void;
  setWorkAddress: (address: string) => void;
  setCity: (city: string) => void;
  setTrafficEnabled: (enabled: boolean) => void;
  setWeatherEnabled: (enabled: boolean) => void;
  setNewsEnabled: (enabled: boolean) => void;
  setNewsCategories: (categories: NewsCategory[]) => void;
  toggleNewsCategory: (category: NewsCategory) => void;
  setNewsLength: (length: 'brief' | 'standard' | 'detailed') => void;
  setEntertainmentType: (type: 'station' | 'podcast') => void;
  setStationId: (id: string) => void;
  setPodcastId: (id: string) => void;
  setVoiceId: (id: string) => void;
  setMusicBedMode: (mode: 'auto' | 'manual' | 'none') => void;
  setMusicBedStyleId: (id: string) => void;
  setSportEnabled: (enabled: boolean) => void;
  toggleSportCategory: (category: SportCategory) => void;
  setSportLength: (length: 'brief' | 'standard' | 'detailed') => void;
  setCalendarConnected: (connected: boolean) => void;
  setCalendarProvider: (provider: 'google' | 'apple' | 'microsoft' | null) => void;
  setVoiceSpeed: (speed: number) => void;
  setJourneys: (journeys: JourneyPreset[]) => void;
  updateJourney: (id: string, updates: Partial<JourneyPreset>) => void;
  addJourney: (journey: JourneyPreset) => void;
  removeJourney: (id: string) => void;
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      homeAddress: 'Grey Lynn',
      workAddress: 'Auckland CBD',
      city: 'auckland',
      traffic: { enabled: true },
      weather: { enabled: true },
      news: {
        enabled: true,
        categories: ['nz', 'sport'] as NewsCategory[],
        length: 'standard' as const,
      },
      sport: {
        enabled: true,
        categories: ['rugby', 'cricket'] as SportCategory[],
        length: 'standard' as const,
      },
      calendar: {
        connected: false,
        provider: null,
      },
      voiceSpeed: 1.0,
      entertainment: {
        type: 'station' as const,
        stationId: 'the-edge',
        podcastId: 'the-edge-morning',
      },
      voiceId: 'simon-barnett',
      musicBed: {
        mode: 'auto' as const,
        styleId: 'pop',
      },
      journeys: [
        {
          id: 'drive-to-work',
          name: 'Drive to Work',
          icon: '🏢',
          from: 'Grey Lynn',
          to: 'Auckland CBD',
          segments: { traffic: true, weather: true, news: true, sport: true, entertainment: true },
          schedule: { enabled: true, days: [1, 2, 3, 4, 5], time: '07:30' },
          calendarSync: true,
          isDefault: true,
        },
        {
          id: 'drive-home',
          name: 'Drive Home',
          icon: '🏠',
          from: 'Auckland CBD',
          to: 'Grey Lynn',
          segments: { traffic: true, weather: true, news: true, sport: true, entertainment: true },
          schedule: { enabled: true, days: [1, 2, 3, 4, 5], time: '17:00' },
          calendarSync: false,
          isDefault: false,
        },
        {
          id: 'school-run',
          name: 'School Run',
          icon: '🎒',
          from: 'Grey Lynn',
          to: 'Ponsonby Primary',
          segments: { traffic: true, weather: true, news: false, sport: false, entertainment: true },
          schedule: { enabled: true, days: [1, 2, 3, 4, 5], time: '08:15' },
          calendarSync: false,
          isDefault: false,
        },
        {
          id: 'gym',
          name: 'Gym',
          icon: '💪',
          from: 'Grey Lynn',
          to: 'Les Mills Auckland',
          segments: { traffic: true, weather: false, news: false, sport: false, entertainment: true },
          schedule: { enabled: true, days: [1, 3, 5], time: '06:00' },
          calendarSync: false,
          isDefault: false,
        },
        {
          id: 'weekend-drive',
          name: 'Weekend Drive',
          icon: '🏖️',
          from: 'Grey Lynn',
          to: 'Piha Beach',
          segments: { traffic: true, weather: true, news: true, sport: true, entertainment: true },
          schedule: { enabled: true, days: [0, 6], time: '09:00' },
          calendarSync: false,
          isDefault: false,
        },
      ] as JourneyPreset[],

      setHomeAddress: (address) => set({ homeAddress: address }),
      setWorkAddress: (address) => set({ workAddress: address }),
      setCity: (city) => set({ city }),
      setTrafficEnabled: (enabled) => set((s) => ({ traffic: { ...s.traffic, enabled } })),
      setWeatherEnabled: (enabled) => set((s) => ({ weather: { ...s.weather, enabled } })),
      setNewsEnabled: (enabled) => set((s) => ({ news: { ...s.news, enabled } })),
      setNewsCategories: (categories) => set((s) => ({ news: { ...s.news, categories } })),
      toggleNewsCategory: (category) =>
        set((s) => ({
          news: {
            ...s.news,
            categories: s.news.categories.includes(category)
              ? s.news.categories.filter((c) => c !== category)
              : [...s.news.categories, category],
          },
        })),
      setNewsLength: (length) => set((s) => ({ news: { ...s.news, length } })),
      setEntertainmentType: (type) => set((s) => ({ entertainment: { ...s.entertainment, type } })),
      setStationId: (id) => set((s) => ({ entertainment: { ...s.entertainment, stationId: id } })),
      setPodcastId: (id) => set((s) => ({ entertainment: { ...s.entertainment, podcastId: id } })),
      setVoiceId: (id) => set({ voiceId: id }),
      setMusicBedMode: (mode) => set((s) => ({ musicBed: { ...s.musicBed, mode } })),
      setMusicBedStyleId: (id) => set((s) => ({ musicBed: { ...s.musicBed, styleId: id } })),
      setSportEnabled: (enabled) => set((s) => ({ sport: { ...s.sport, enabled } })),
      toggleSportCategory: (category) =>
        set((s) => ({
          sport: {
            ...s.sport,
            categories: s.sport.categories.includes(category)
              ? s.sport.categories.filter((c: SportCategory) => c !== category)
              : [...s.sport.categories, category],
          },
        })),
      setSportLength: (length) => set((s) => ({ sport: { ...s.sport, length } })),
      setCalendarConnected: (connected) => set((s) => ({ calendar: { ...s.calendar, connected } })),
      setCalendarProvider: (provider) => set((s) => ({ calendar: { ...s.calendar, provider } })),
      setVoiceSpeed: (speed) => set({ voiceSpeed: speed }),
      setJourneys: (journeys) => set({ journeys }),
      updateJourney: (id, updates) =>
        set((s) => ({
          journeys: s.journeys.map((j) => (j.id === id ? { ...j, ...updates } : j)),
        })),
      addJourney: (journey) => set((s) => ({ journeys: [...s.journeys, journey] })),
      removeJourney: (id) => set((s) => ({ journeys: s.journeys.filter((j) => j.id !== id) })),
    }),
    { name: 'rova-preferences' }
  )
);
