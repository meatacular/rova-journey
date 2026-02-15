'use client';

import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { JourneySegment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { TrafficOverlay } from './TrafficOverlay';
import { WeatherCarousel } from './WeatherCarousel';
import { StoryImages } from './StoryImages';


interface SegmentDisplayProps {
  segment: JourneySegment;
  elapsedTime: number;
  onClose?: () => void;
  progress?: number;
}

export function SegmentDisplay({ segment, elapsedTime, onClose, progress }: SegmentDisplayProps) {
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
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-base font-semibold leading-tight truncate">{segment.title}</h2>
          <p className="text-sm sm:text-xs text-muted-foreground">
            {Math.floor(segment.duration / 60)}:{String(segment.duration % 60).padStart(2, '0')}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        )}
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
        <WeatherCarousel />
      )}
      {(segment.type === 'news' || segment.type === 'sport') && (
        <StoryImages type={segment.type as 'news' | 'sport'} elapsedTime={elapsedTime} />
      )}
    </div>
  );
}
