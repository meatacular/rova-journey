'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { JourneySegment, Chapter } from '@/lib/types';
import { cn } from '@/lib/utils';
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

/** Compute current chapter info from elapsed time */
function getChapterInfo(chapters: Chapter[], elapsedTime: number) {
  let accumulated = 0;
  for (let i = 0; i < chapters.length; i++) {
    if (elapsedTime < accumulated + chapters[i].duration) {
      return { index: i, chapterElapsed: elapsedTime - accumulated, chapterStart: accumulated };
    }
    accumulated += chapters[i].duration;
  }
  // Past the end — return last chapter
  const lastStart = chapters.reduce((sum, ch, i) => i < chapters.length - 1 ? sum + ch.duration : sum, 0);
  return { index: chapters.length - 1, chapterElapsed: elapsedTime - lastStart, chapterStart: lastStart };
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds) % 60).padStart(2, '0')}`;
}


interface SegmentDisplayProps {
  segment: JourneySegment;
  elapsedTime: number;
  progress?: number;
  onScrub?: (time: number) => void;
}

export function SegmentDisplay({ segment, elapsedTime, progress, onScrub }: SegmentDisplayProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleOverflows = useOverflow(titleRef);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const chapters = segment.chapters;
  const hasChapters = chapters && chapters.length > 1;
  const totalDuration = segment.duration;

  // Chapter-aware title and script
  let displayTitle = segment.title;
  let displayScript = segment.script || '';
  let chapterDuration = totalDuration;

  if (hasChapters) {
    const info = getChapterInfo(chapters, elapsedTime);
    displayTitle = chapters[info.index].title;
    displayScript = chapters[info.index].script;
    chapterDuration = chapters[info.index].duration;
  }

  // Word highlighting based on current chapter's script
  const words = displayScript ? displayScript.split(/\s+/) : [];
  const totalWords = words.length;
  const chapterElapsed = hasChapters ? getChapterInfo(chapters, elapsedTime).chapterElapsed : elapsedTime;
  const wordsPerSecond = totalWords > 0 ? (totalWords / chapterDuration) * 2 : 0;
  const currentWordIndex = Math.min(Math.floor(chapterElapsed * wordsPerSecond), totalWords - 1);

  // Auto-scroll to active word
  useEffect(() => {
    if (activeWordRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const word = activeWordRef.current;
      container.scrollTo({
        left: word.offsetLeft - container.clientWidth * 0.3,
        behavior: 'smooth',
      });
    }
  }, [currentWordIndex]);

  // Scrubber drag handlers
  const handleScrubberInteraction = useCallback((clientX: number) => {
    if (!scrubberRef.current || !onScrub) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onScrub(Math.floor(ratio * totalDuration));
  }, [onScrub, totalDuration]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    handleScrubberInteraction(e.clientX);
  }, [handleScrubberInteraction]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    handleScrubberInteraction(e.touches[0].clientX);
  }, [handleScrubberInteraction]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => handleScrubberInteraction(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleScrubberInteraction(e.touches[0].clientX);
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handleScrubberInteraction]);

  // Chapter marker positions (as percentages)
  const chapterMarkers: number[] = [];
  if (hasChapters) {
    let acc = 0;
    for (let i = 0; i < chapters.length - 1; i++) {
      acc += chapters[i].duration;
      chapterMarkers.push((acc / totalDuration) * 100);
    }
  }

  const scrubberPosition = totalDuration > 0 ? (elapsedTime / totalDuration) * 100 : 0;

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
            <span>{displayTitle}</span>
            {titleOverflows && <span className="pl-12">{displayTitle}</span>}
          </h2>
        </div>
        <p className="text-sm sm:text-xs text-muted-foreground">
          {formatTime(totalDuration)}
          {hasChapters && (
            <span className="ml-2 text-primary">
              {getChapterInfo(chapters, elapsedTime).index + 1}/{chapters.length}
            </span>
          )}
        </p>
      </div>

      {/* Chaptered progress bar with scrubber */}
      {progress !== undefined && (
        <div className="space-y-1">
          <div
            ref={scrubberRef}
            className="relative h-5 flex items-center cursor-pointer group"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Track background */}
            <div className="absolute inset-x-0 h-1.5 rounded-full bg-primary/20" />
            {/* Fill */}
            <div
              className="absolute left-0 h-1.5 rounded-full bg-primary transition-[width] duration-100"
              style={{ width: `${scrubberPosition}%` }}
            />
            {/* Chapter markers */}
            {chapterMarkers.map((pos, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-background/80 rounded-full z-10"
                style={{ left: `${pos}%` }}
              />
            ))}
            {/* Scrubber thumb */}
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary shadow-md z-20 transition-transform',
                isDragging ? 'h-4 w-4 scale-110' : 'h-3 w-3 group-hover:scale-110'
              )}
              style={{ left: `${scrubberPosition}%` }}
            />
          </div>
          <div className="flex justify-between text-sm sm:text-xs text-muted-foreground">
            <span>{formatTime(elapsedTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>
      )}

      {/* Live captions — single line, horizontal scroll */}
      {displayScript && words.length > 0 && (
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
