'use client';

import { JourneySegment } from '@/lib/types';
import { QueueItem } from './QueueItem';

interface QueueListProps {
  segments: JourneySegment[];
  currentIndex: number;
  onJump?: (index: number) => void;
}

/** Strip category prefixes like "Sport — " or "Your News — " from titles */
function stripPrefix(title: string): string {
  const idx = title.indexOf(' — ');
  return idx !== -1 ? title.slice(idx + 3) : title;
}

export function QueueList({ segments, currentIndex, onJump }: QueueListProps) {
  // Only show upcoming non-ad segments (hide playing + done)
  const upcoming = segments
    .map((s, i) => ({ segment: s, originalIndex: i }))
    .filter(({ segment }) => segment.type !== 'ad' && segment.status === 'upcoming');

  if (upcoming.length === 0) return null;

  return (
    <div className="space-y-1">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Up Next
      </h3>
      {upcoming.map(({ segment, originalIndex }) => (
        <QueueItem
          key={segment.id}
          segment={{ ...segment, title: stripPrefix(segment.title) }}
          isActive={originalIndex === currentIndex}
          onClick={onJump ? () => onJump(originalIndex) : undefined}
        />
      ))}
    </div>
  );
}
