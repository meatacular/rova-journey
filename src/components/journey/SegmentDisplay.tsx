'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { JourneySegment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { TrafficOverlay } from './TrafficOverlay';
import { WeatherCarousel } from './WeatherCarousel';
import { StoryImages } from './StoryImages';

/** Hook: returns true when a text element overflows its container */
function useOverflow(ref: React.RefObject<HTMLElement | null>) {
  const [overflows, setOverflows] = useState(false);
  const check = useCallback(() => {
    if (ref.current) {
      setOverflows(ref.current.scrollWidth > ref.current.clientWidth);
    }
  }, [ref]);
  useEffect(() => {
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [check]);
  return overflows;
}


interface SegmentDisplayProps {
  segment: JourneySegment;
  elapsedTime: number;
  progress?: number;
}

export function SegmentDisplay({ segment, elapsedTime, progress }: SegmentDisplayProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleOverflows = useOverflow(titleRef);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  const words = segment.script ? segment.script.split(/\s+/) : [];
  const totalWords = words.length;
  // Pace words across the full segment duration (2x speed for readability)
  const wordsPerSecond = totalWords > 0 ? (totalWords / segment.duration) * 2 : 0;
  const currentWordIndex = Math.min(Math.floor(elapsedTime * wordsPerSecond), totalWords - 1);

  // Auto-scroll horizontally to keep the active word visible
  useEffect(() => {
    if (activeWordRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const word = activeWordRef.current;
      const wordLeft = word.offsetLeft;
      const containerWidth = container.clientWidth;

      container.scrollTo({
        left: wordLeft - containerWidth * 0.3,
        behavior: 'smooth',
      });
    }
  }, [currentWordIndex]);

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="w-full overflow-hidden">
        <div className="overflow-hidden">
          <h2
            ref={titleRef}
            className={cn(
              'text-lg sm:text-base font-semibold leading-tight whitespace-nowrap inline-flex',
              titleOverflows && 'animate-marquee'
            )}
          >
            <span>{segment.title}</span>
            {titleOverflows && <span className="pl-12">{segment.title}</span>}
          </h2>
        </div>
        <p className="text-sm sm:text-xs text-muted-foreground">
          {Math.floor(segment.duration / 60)}:{String(segment.duration % 60).padStart(2, '0')}
        </p>
      </div>

      {/* Progress bar under header */}
      {progress !== undefined && (
        <div className="space-y-1">
          <Progress value={progress} className="h-1.5" />
          <div className="flex justify-between text-sm sm:text-xs text-muted-foreground">
            <span>
              {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
            </span>
            <span>
              {Math.floor(segment.duration / 60)}:{String(segment.duration % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}
      {/* Live captions — single line, horizontal scroll */}
      {segment.script && words.length > 0 && (
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto overflow-y-hidden rounded-xl bg-secondary/50 px-4 py-2 no-scrollbar"
        >
          <p className="whitespace-nowrap text-base sm:text-sm">
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
        <WeatherCarousel />
      )}
      {(segment.type === 'news' || segment.type === 'sport') && (
        <StoryImages type={segment.type as 'news' | 'sport'} elapsedTime={elapsedTime} />
      )}
    </div>
  );
}
