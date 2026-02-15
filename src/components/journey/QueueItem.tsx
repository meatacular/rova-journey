'use client';

import { Car, Cloud, Newspaper, Radio, Megaphone, Check, Trophy } from 'lucide-react';
import { JourneySegment } from '@/lib/types';
import { cn } from '@/lib/utils';

const segmentIcons: Record<string, React.ElementType> = {
  traffic: Car,
  weather: Cloud,
  news: Newspaper,
  sport: Trophy,
  entertainment: Radio,
  ad: Megaphone,
};

interface QueueItemProps {
  segment: JourneySegment;
  isActive: boolean;
  onClick?: () => void;
}

export function QueueItem({ segment, isActive, onClick }: QueueItemProps) {
  const Icon = segmentIcons[segment.type] || Radio;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left',
        isActive && 'bg-primary/10 ring-1 ring-primary/30',
        segment.status === 'done' && 'opacity-50',
        onClick && 'cursor-pointer hover:bg-secondary/50'
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-lg',
          isActive ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
        )}
      >
        {segment.status === 'done' ? (
          <Check className="h-5 w-5 sm:h-4 sm:w-4" />
        ) : (
          <Icon className="h-5 w-5 sm:h-4 sm:w-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-base sm:text-sm font-medium truncate', isActive && 'text-primary')}>
          {segment.title}
        </p>
      </div>
      <span className="text-sm sm:text-xs text-muted-foreground">
        {segment.duration < 60
          ? `${segment.duration}s`
          : `${Math.floor(segment.duration / 60)}:${String(segment.duration % 60).padStart(2, '0')}`}
      </span>
    </button>
  );
}
