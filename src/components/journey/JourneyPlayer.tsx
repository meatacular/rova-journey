'use client';

import { useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useJourney } from '@/lib/stores/journey';
import { SegmentDisplay } from './SegmentDisplay';
import { RadioPlayer } from './RadioPlayer';
import { AdBreak } from './AdBreak';
import { QueueList } from './QueueList';
import { useRouter } from 'next/navigation';

export function JourneyPlayer() {
  const router = useRouter();
  const {
    isActive,
    isPlaying,
    segments,
    currentSegmentIndex,
    elapsedTime,
    pauseJourney,
    resumeJourney,
    skipSegment,
    completeSegment,
    setElapsedTime,
    resetJourney,
  } = useJourney();

  const currentSegment = segments[currentSegmentIndex];

  // Timer for non-ad segments
  useEffect(() => {
    if (!isPlaying || !currentSegment || currentSegment.type === 'ad') return;
    if (elapsedTime >= currentSegment.duration) {
      completeSegment();
      return;
    }
    const timer = setInterval(() => {
      setElapsedTime(elapsedTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, elapsedTime, currentSegment, completeSegment, setElapsedTime]);

  const handleAdComplete = useCallback(() => {
    completeSegment();
  }, [completeSegment]);

  const handleClose = () => {
    resetJourney();
    router.push('/');
  };

  if (!isActive || !currentSegment) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">No active journey</p>
        <Button variant="outline" onClick={() => router.push('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  const progress = currentSegment.type !== 'ad'
    ? (elapsedTime / currentSegment.duration) * 100
    : 0;

  const handlePlayPause = isPlaying ? pauseJourney : resumeJourney;

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-lg font-semibold">Now Playing</h1>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {currentSegment.type === 'ad' ? (
        <AdBreak
          script={currentSegment.script || ''}
          duration={currentSegment.duration}
          onComplete={handleAdComplete}
          isPaused={!isPlaying}
          metadata={currentSegment.metadata}
        />
      ) : (
        <>
          <SegmentDisplay segment={currentSegment} elapsedTime={elapsedTime} />
          {currentSegment.type === 'entertainment' && currentSegment.metadata?.streamUrl && (
            <RadioPlayer
              streamUrl={currentSegment.metadata.streamUrl as string}
              stationColor={(currentSegment.metadata.stationColor as string) || '#6C3AED'}
              isPlaying={isPlaying}
            />
          )}
        </>
      )}

      {/* Progress bar — tight under captions */}
      {currentSegment.type !== 'ad' && (
        <div className="space-y-1">
          <Progress value={progress} className="h-1.5" />
          <div className="flex justify-between text-sm sm:text-xs text-muted-foreground">
            <span>
              {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
            </span>
            <span>
              {Math.floor(currentSegment.duration / 60)}:{String(currentSegment.duration % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      <QueueList segments={segments} currentIndex={currentSegmentIndex} />

      {/* Floating play/pause + skip button — bottom right, skip overlaps top-left */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={skipSegment}
          className="absolute -top-4 -left-4 sm:-top-3 sm:-left-3 flex h-12 w-12 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary/80 text-primary-foreground shadow-md transition-transform active:scale-95"
        >
          <SkipForward className="h-5 w-5 sm:h-3.5 sm:w-3.5" />
        </button>
        <button
          onClick={handlePlayPause}
          className="flex h-[4.5rem] w-[4.5rem] sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="h-8 w-8 sm:h-6 sm:w-6" /> : <Play className="h-8 w-8 sm:h-6 sm:w-6 ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
