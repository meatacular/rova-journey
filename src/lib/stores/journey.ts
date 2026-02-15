import { create } from 'zustand';
import { JourneySegment, JourneyState } from '@/lib/types';

interface JourneyStore extends JourneyState {
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  buildJourney: (segments: JourneySegment[]) => void;
  startJourney: () => void;
  pauseJourney: () => void;
  resumeJourney: () => void;
  skipSegment: () => void;
  completeSegment: () => void;
  nextSegment: () => void;
  jumpToSegment: (index: number) => void;
  setElapsedTime: (time: number) => void;
  resetJourney: () => void;
}

export const useJourney = create<JourneyStore>((set, get) => ({
  isActive: false,
  isBuilding: false,
  isPlaying: false,
  segments: [],
  currentSegmentIndex: 0,
  elapsedTime: 0,
  showSplash: false,

  setShowSplash: (show) => set({ showSplash: show }),

  buildJourney: (segments) =>
    set({
      isActive: true,
      isBuilding: false,
      isPlaying: false,
      segments: segments.map((s, i) => ({
        ...s,
        status: i === 0 ? 'playing' : 'upcoming',
      })),
      currentSegmentIndex: 0,
      elapsedTime: 0,
    }),

  startJourney: () => set({ isPlaying: true }),

  pauseJourney: () => set({ isPlaying: false }),

  resumeJourney: () => set({ isPlaying: true }),

  skipSegment: () => {
    const { segments, currentSegmentIndex } = get();
    if (currentSegmentIndex >= segments.length - 1) {
      set({
        isPlaying: false,
        isActive: false,
        segments: segments.map((s) => ({ ...s, status: 'done' as const })),
      });
      return;
    }
    const updated = segments.map((s, i) => ({
      ...s,
      status:
        i < currentSegmentIndex + 1
          ? ('done' as const)
          : i === currentSegmentIndex + 1
            ? ('playing' as const)
            : ('upcoming' as const),
    }));
    set({
      segments: updated,
      currentSegmentIndex: currentSegmentIndex + 1,
      elapsedTime: 0,
    });
  },

  completeSegment: () => {
    const { segments, currentSegmentIndex } = get();
    if (currentSegmentIndex >= segments.length - 1) {
      set({
        isPlaying: false,
        isActive: false,
        segments: segments.map((s) => ({ ...s, status: 'done' as const })),
      });
      return;
    }
    const updated = segments.map((s, i) => ({
      ...s,
      status:
        i <= currentSegmentIndex
          ? ('done' as const)
          : i === currentSegmentIndex + 1
            ? ('playing' as const)
            : ('upcoming' as const),
    }));
    set({
      segments: updated,
      currentSegmentIndex: currentSegmentIndex + 1,
      elapsedTime: 0,
    });
  },

  nextSegment: () => {
    get().completeSegment();
  },

  jumpToSegment: (index) => {
    const { segments } = get();
    if (index < 0 || index >= segments.length) return;
    const updated = segments.map((s, i) => ({
      ...s,
      status:
        i < index
          ? ('done' as const)
          : i === index
            ? ('playing' as const)
            : ('upcoming' as const),
    }));
    set({
      segments: updated,
      currentSegmentIndex: index,
      elapsedTime: 0,
    });
  },

  setElapsedTime: (time) => set({ elapsedTime: time }),

  resetJourney: () =>
    set({
      isActive: false,
      isBuilding: false,
      isPlaying: false,
      segments: [],
      currentSegmentIndex: 0,
      elapsedTime: 0,
    }),
}));
