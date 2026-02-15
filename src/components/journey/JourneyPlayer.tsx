'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJourney } from '@/lib/stores/journey';
import { SegmentDisplay } from './SegmentDisplay';
import { RadioPlayer } from './RadioPlayer';
import { AdBreak } from './AdBreak';
import { QueueList } from './QueueList';
import { SegmentTabBar } from './SegmentTabBar';
import { PersonalisePrompt } from './PersonalisePrompt';
import { useRouter } from 'next/navigation';
import { SegmentType } from '@/lib/types';

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
    jumpToSegment,
    setElapsedTime,
    resetJourney,
  } = useJourney();

  const currentSegment = segments[currentSegmentIndex];
  const prevIndexRef = useRef(currentSegmentIndex);
  const [completedSegmentType, setCompletedSegmentType] = useState<SegmentType | null>(null);

  // Track segment transitions for personalisation prompts
  useEffect(() => {
    if (prevIndexRef.current !== currentSegmentIndex && prevIndexRef.current < segments.length) {
      const prevSegment = segments[prevIndexRef.current];
      if (prevSegment && prevSegment.type !== 'ad') {
        setCompletedSegmentType(prevSegment.type);
      }
    }
    prevIndexRef.current = currentSegmentIndex;
  }, [currentSegmentIndex, segments]);

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
      {/* Segment tab bar */}
      <SegmentTabBar
        segments={segments}
        currentIndex={currentSegmentIndex}
        onJump={jumpToSegment}
      />

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
          <SegmentDisplay segment={currentSegment} elapsedTime={elapsedTime} onClose={handleClose} progress={progress} />
          {currentSegment.type === 'entertainment' && currentSegment.metadata?.streamUrl && (
            <RadioPlayer
              streamUrl={currentSegment.metadata.streamUrl as string}
              stationColor={(currentSegment.metadata.stationColor as string) || '#6C3AED'}
              isPlaying={isPlaying}
            />
          )}
        </>
      )}

      {/* Personalisation prompt */}
      <PersonalisePrompt segmentType={completedSegmentType} />

      <QueueList segments={segments} currentIndex={currentSegmentIndex} onJump={jumpToSegment} />

      {/* Floating skip + play/pause buttons — bottom right, inline */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-[10%]">
        <button
          onClick={skipSegment}
          className="flex h-[3.75rem] w-[3.75rem] sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/15 text-foreground backdrop-blur-xl border border-white/20 shadow-lg shadow-black/10 transition-transform active:scale-95"
        >
          <SkipForward className="h-6 w-6 sm:h-3.5 sm:w-3.5" />
        </button>
        <button
          onClick={handlePlayPause}
          className="flex h-[5.75rem] w-[5.75rem] sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/15 text-foreground backdrop-blur-xl border border-white/20 shadow-lg shadow-black/10 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="h-10 w-10 sm:h-6 sm:w-6" /> : <Play className="h-10 w-10 sm:h-6 sm:w-6 ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
