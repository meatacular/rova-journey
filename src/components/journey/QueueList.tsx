'use client';

import { JourneySegment } from '@/lib/types';
import { QueueItem } from './QueueItem';

interface QueueListProps {
  segments: JourneySegment[];
  currentIndex: number;
}

export function QueueList({ segments, currentIndex }: QueueListProps) {
  return (
    <div className="space-y-1">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Your Journey
      </h3>
      {segments.map((segment, i) => (
        <QueueItem key={segment.id} segment={segment} isActive={i === currentIndex} />
      ))}
    </div>
  );
}
