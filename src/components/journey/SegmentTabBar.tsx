'use client';

import { Car, Cloud, Newspaper, Trophy, Radio } from 'lucide-react';
import { JourneySegment, SegmentType } from '@/lib/types';
import { cn } from '@/lib/utils';

const segmentIcons: Partial<Record<SegmentType, React.ElementType>> = {
  traffic: Car,
  weather: Cloud,
  news: Newspaper,
  sport: Trophy,
  entertainment: Radio,
};

interface SegmentTabBarProps {
  segments: JourneySegment[];
  currentIndex: number;
  onJump: (index: number) => void;
}

export function SegmentTabBar({ segments, currentIndex, onJump }: SegmentTabBarProps) {
  // Only show non-ad segments
  const tabs = segments
    .map((s, i) => ({ segment: s, originalIndex: i }))
    .filter(({ segment }) => segment.type !== 'ad');

  return (
    <div className="flex items-center justify-center gap-1 py-0.5">
      {tabs.map(({ segment, originalIndex }) => {
        const Icon = segmentIcons[segment.type];
        if (!Icon) return null;
        const isActive = originalIndex === currentIndex;

        return (
          <button
            key={segment.id}
            onClick={() => onJump(originalIndex)}
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
              isActive
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
