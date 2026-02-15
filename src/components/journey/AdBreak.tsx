'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface AdBreakProps {
  script: string;
  duration: number;
  onComplete: () => void;
  isPaused: boolean;
  metadata?: Record<string, unknown>;
}

export function AdBreak({ script, duration, onComplete, isPaused, metadata }: AdBreakProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    if (elapsed >= duration) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [elapsed, duration, onComplete, isPaused]);

  const remaining = duration - elapsed;
  const progress = (elapsed / duration) * 100;
  const advertiser = metadata?.advertiser as string | undefined;
  const adColor = (metadata?.color as string) || '#666';
  const tagline = (metadata?.tagline as string) || script;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div
        className="rounded-2xl p-6 flex items-center justify-center"
        style={{ backgroundColor: adColor }}
      >
        <span className="text-2xl font-bold text-white">{advertiser || 'Ad'}</span>
      </div>
      <p className="text-center text-sm text-muted-foreground">{tagline}</p>
      <div className="w-full max-w-xs space-y-2">
        <Progress value={progress} className="h-1.5" />
        <p className="text-center text-xs text-muted-foreground">
          Ad · {remaining}s remaining
        </p>
      </div>
    </div>
  );
}
