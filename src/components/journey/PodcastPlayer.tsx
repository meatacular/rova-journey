'use client';

import Image from 'next/image';
import { Chapter } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PodcastPlayerProps {
  podcastName: string;
  host: string;
  episodeTitle: string;
  artwork: string;
  chapters?: Chapter[];
  elapsedTime?: number;
  onChapterJump?: (time: number) => void;
}

function getChapterIndex(chapters: Chapter[], elapsed: number) {
  let acc = 0;
  for (let i = 0; i < chapters.length; i++) {
    if (elapsed < acc + chapters[i].duration) return i;
    acc += chapters[i].duration;
  }
  return chapters.length - 1;
}

function getChapterStartTime(chapters: Chapter[], index: number) {
  let acc = 0;
  for (let i = 0; i < index; i++) acc += chapters[i].duration;
  return acc;
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds) % 60).padStart(2, '0')}`;
}

export function PodcastPlayer({ podcastName, host, episodeTitle, artwork, chapters, elapsedTime = 0, onChapterJump }: PodcastPlayerProps) {
  const currentChapterIdx = chapters ? getChapterIndex(chapters, elapsedTime) : -1;

  return (
    <div className="space-y-3">
      {/* Artwork + info — left aligned */}
      <div className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={artwork}
            alt={podcastName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold truncate">{podcastName}</p>
          <p className="text-xs text-muted-foreground truncate">{host}</p>
          <p className="text-xs text-primary mt-0.5 truncate">{episodeTitle}</p>
        </div>
      </div>

      {/* Chapter list */}
      {chapters && chapters.length > 1 && (
        <div className="rounded-xl bg-secondary/50 p-3 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Chapters</p>
          {chapters.map((ch, i) => {
            const startTime = getChapterStartTime(chapters, i);
            const isCurrent = i === currentChapterIdx;
            const isDone = i < currentChapterIdx;
            return (
              <button
                key={i}
                onClick={() => onChapterJump?.(startTime)}
                className={cn(
                  'flex items-center gap-3 w-full rounded-lg px-2 py-1.5 text-left transition-colors',
                  isCurrent ? 'bg-primary/10' : 'hover:bg-accent'
                )}
              >
                <span className={cn(
                  'text-xs font-mono min-w-[36px]',
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {formatTime(startTime)}
                </span>
                <span className={cn(
                  'text-sm truncate flex-1',
                  isCurrent ? 'text-primary font-semibold' : isDone ? 'text-muted-foreground/60' : 'text-foreground'
                )}>
                  {ch.title}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatTime(ch.duration)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
