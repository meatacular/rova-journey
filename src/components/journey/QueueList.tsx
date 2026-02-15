'use client';

import { JourneySegment } from '@/lib/types';
import { QueueItem } from './QueueItem';

interface QueueListProps {
  segments: JourneySegment[];
  currentIndex: number;
}

export function QueueList({ segments, currentIndex }: QueueListProps) {
  // Filter out ad segments for the queue display
  const visibleSegments = segments.filter((s) => s.type !== 'ad');

  return (
    <div className="space-y-1">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Your Journey
      </h3>
      {visibleSegments.map((segment) => {
        const originalIndex = segments.indexOf(segment);
        return (
          <QueueItem
            key={segment.id}
            segment={segment}
            isActive={originalIndex === currentIndex}
          />
        );
      })}
    </div>
  );
}
