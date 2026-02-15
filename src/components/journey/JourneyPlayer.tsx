'use client';

import { useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useJourney } from '@/lib/stores/journey';
import { SegmentDisplay } from './SegmentDisplay';
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
    startJourney,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Now Playing</h1>
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
        />
      ) : (
        <SegmentDisplay segment={currentSegment} />
      )}

      {currentSegment.type !== 'ad' && (
        <div className="space-y-2">
          <Progress value={progress} className="h-1.5" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
            </span>
            <span>
              {Math.floor(currentSegment.duration / 60)}:{String(currentSegment.duration % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={isPlaying ? pauseJourney : (segments[currentSegmentIndex]?.status === 'playing' ? resumeJourney : startJourney)}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={skipSegment}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      <QueueList segments={segments} currentIndex={currentSegmentIndex} />
    </div>
  );
}
