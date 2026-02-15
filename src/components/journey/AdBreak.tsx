'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { useJourney } from '@/lib/stores/journey';

interface AdBreakProps {
  script: string;
  duration: number;
  onComplete: () => void;
  isPaused: boolean;
  metadata?: Record<string, unknown>;
}

export function AdBreak({ script, duration, onComplete, isPaused, metadata }: AdBreakProps) {
  const { elapsedTime, setElapsedTime } = useJourney();

  useEffect(() => {
    if (isPaused) return;
    if (elapsedTime >= duration) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setElapsedTime(elapsedTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [elapsedTime, duration, onComplete, isPaused, setElapsedTime]);

  const remaining = duration - elapsedTime;
  const progress = (elapsedTime / duration) * 100;
  const advertiser = metadata?.advertiser as string | undefined;
  const adColor = (metadata?.color as string) || '#666';
  const tagline = (metadata?.tagline as string) || script;
  const adUrl = metadata?.url as string | undefined;
  const logo = metadata?.logo as string | undefined;

  const brandBlock = (
    <div
      className="rounded-2xl p-6 flex items-center justify-center"
      style={{ backgroundColor: adColor }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={advertiser || 'Ad'}
          width={200}
          height={100}
          className="h-16 w-auto"
        />
      ) : (
        <span className="text-3xl sm:text-2xl font-bold text-white">{advertiser || 'Ad'}</span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {adUrl ? (
        <a href={adUrl} target="_blank" rel="noopener noreferrer">
          {brandBlock}
        </a>
      ) : (
        brandBlock
      )}
      <p className="text-center text-base sm:text-sm text-muted-foreground">{tagline}</p>
      <div className="w-full max-w-xs space-y-2">
        <Progress value={progress} className="h-1.5" />
        <p className="text-center text-sm sm:text-xs text-muted-foreground">
          Ad · {remaining}s remaining
        </p>
      </div>
    </div>
  );
}
