'use client';

import { JourneySegment } from '@/lib/types';
import { QueueItem } from './QueueItem';

interface QueueListProps {
  segments: JourneySegment[];
  currentIndex: number;
  onJump?: (index: number) => void;
}

export function QueueList({ segments, currentIndex, onJump }: QueueListProps) {
  // Filter out ad segments for the queue display
  const visibleSegments = segments
    .map((s, i) => ({ segment: s, originalIndex: i }))
    .filter(({ segment }) => segment.type !== 'ad');

  // Reorder: currently playing first, then upcoming, then done
  const playing = visibleSegments.filter(({ segment }) => segment.status === 'playing');
  const upcoming = visibleSegments.filter(({ segment }) => segment.status === 'upcoming');
  const done = visibleSegments.filter(({ segment }) => segment.status === 'done');
  const ordered = [...playing, ...upcoming, ...done];

  return (
    <div className="space-y-1">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Your Journey
      </h3>
      {ordered.map(({ segment, originalIndex }) => (
        <QueueItem
          key={segment.id}
          segment={segment}
          isActive={originalIndex === currentIndex}
          onClick={onJump ? () => onJump(originalIndex) : undefined}
        />
      ))}
    </div>
  );
}
