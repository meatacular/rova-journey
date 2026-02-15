'use client';

import { useRef, useEffect } from 'react';
import { Car, Cloud, Newspaper, Radio, Megaphone, Trophy } from 'lucide-react';
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

const segmentColors: Record<string, string> = {
  traffic: 'text-orange-400',
  weather: 'text-sky-400',
  news: 'text-red-400',
  sport: 'text-green-400',
  entertainment: 'text-purple-400',
  ad: 'text-muted-foreground',
};

interface SegmentDisplayProps {
  segment: JourneySegment;
  elapsedTime: number;
}

export function SegmentDisplay({ segment, elapsedTime }: SegmentDisplayProps) {
  const Icon = segmentIcons[segment.type] || Radio;
  const color = segmentColors[segment.type] || 'text-foreground';
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  const words = segment.script ? segment.script.split(/\s+/) : [];
  const totalWords = words.length;
  // Calculate which word should be highlighted based on elapsed time
  const wordsPerSecond = totalWords / segment.duration;
  const currentWordIndex = Math.min(Math.floor(elapsedTime * wordsPerSecond), totalWords - 1);

  // Auto-scroll to keep current word visible
  useEffect(() => {
    if (activeWordRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const word = activeWordRef.current;
      const containerRect = container.getBoundingClientRect();
      const wordRect = word.getBoundingClientRect();

      // If the word is below the visible area or above, scroll to center it
      if (wordRect.top > containerRect.bottom - 40 || wordRect.top < containerRect.top + 20) {
        word.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentWordIndex]);

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
      {segment.script && words.length > 0 && (
        <div
          ref={scrollRef}
          className="mt-2 max-h-48 w-full overflow-y-auto rounded-xl bg-secondary/50 p-4"
        >
          <p className="text-sm leading-relaxed">
            {words.map((word, i) => (
              <span
                key={i}
                ref={i === currentWordIndex ? activeWordRef : null}
                className={cn(
                  'transition-colors duration-150',
                  i < currentWordIndex
                    ? 'text-muted-foreground/60'
                    : i === currentWordIndex
                      ? 'text-primary font-semibold bg-primary/10 rounded px-0.5'
                      : 'text-muted-foreground/40'
                )}
              >
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
