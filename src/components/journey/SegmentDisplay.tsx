'use client';

import { useRef, useEffect } from 'react';
import { Car, Cloud, Newspaper, Radio, Megaphone, Trophy } from 'lucide-react';
import { JourneySegment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TrafficOverlay } from './TrafficOverlay';
import { WeatherRadar } from './WeatherRadar';
import { StoryImages } from './StoryImages';

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
  // Pace words across the full segment duration
  const wordsPerSecond = totalWords > 0 ? totalWords / segment.duration : 0;
  const currentWordIndex = Math.min(Math.floor(elapsedTime * wordsPerSecond), totalWords - 1);

  // Auto-scroll transcript container only (not the page)
  useEffect(() => {
    if (activeWordRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const word = activeWordRef.current;
      const wordTop = word.offsetTop;
      const containerHeight = container.clientHeight;

      // Scroll within the container to keep the word centered
      container.scrollTo({
        top: wordTop - containerHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [currentWordIndex]);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center gap-3">
        <div className={cn('rounded-lg bg-secondary p-2.5 sm:p-2', color)}>
          <Icon className="h-6 w-6 sm:h-5 sm:w-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-base font-semibold leading-tight">{segment.title}</h2>
          <p className="text-sm sm:text-xs text-muted-foreground">
            {Math.floor(segment.duration / 60)}:{String(segment.duration % 60).padStart(2, '0')}
          </p>
        </div>
      </div>
      {/* Live captions — 3 lines visible */}
      {segment.script && words.length > 0 && (
        <div
          ref={scrollRef}
          className="max-h-[4.5rem] w-full overflow-y-auto rounded-xl bg-secondary/50 px-4 py-2"
        >
          <p className="text-base sm:text-sm leading-relaxed">
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
      {/* Visual overlays for each segment type */}
      {segment.type === 'traffic' && (
        <TrafficOverlay elapsedTime={elapsedTime} />
      )}
      {segment.type === 'weather' && (
        <WeatherRadar />
      )}
      {(segment.type === 'news' || segment.type === 'sport') && (
        <StoryImages type={segment.type as 'news' | 'sport'} elapsedTime={elapsedTime} />
      )}
    </div>
  );
}
