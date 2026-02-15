'use client';

import { Car, Cloud, Newspaper, Radio, Megaphone } from 'lucide-react';
import { JourneySegment } from '@/lib/types';
import { cn } from '@/lib/utils';

const segmentIcons: Record<string, React.ElementType> = {
  traffic: Car,
  weather: Cloud,
  news: Newspaper,
  entertainment: Radio,
  ad: Megaphone,
};

const segmentColors: Record<string, string> = {
  traffic: 'text-orange-400',
  weather: 'text-sky-400',
  news: 'text-red-400',
  entertainment: 'text-purple-400',
  ad: 'text-muted-foreground',
};

interface SegmentDisplayProps {
  segment: JourneySegment;
}

export function SegmentDisplay({ segment }: SegmentDisplayProps) {
  const Icon = segmentIcons[segment.type] || Radio;
  const color = segmentColors[segment.type] || 'text-foreground';

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className={cn('rounded-2xl bg-secondary p-6', color)}>
        <Icon className="h-12 w-12" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{segment.title}</h2>
        <p className="text-sm text-muted-foreground">
          {Math.floor(segment.duration / 60)}:{String(segment.duration % 60).padStart(2, '0')}
        </p>
      </div>
      {segment.script && (
        <div className="mt-2 max-h-40 w-full overflow-y-auto rounded-xl bg-secondary/50 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{segment.script}</p>
        </div>
      )}
    </div>
  );
}
