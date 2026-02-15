import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences, NewsCategory } from '@/lib/types';

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
      entertainment: {
        type: 'station' as const,
        stationId: 'the-edge',
        podcastId: 'zb-mike-hosking',
      },
      voiceId: 'aroha',
      musicBed: {
        mode: 'auto' as const,
        styleId: 'pop',
      },

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
    }),
    { name: 'rova-preferences' }
  )
);
