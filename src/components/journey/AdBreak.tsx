'use client';

import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AdBreakProps {
  script: string;
  duration: number;
  onComplete: () => void;
  isPaused: boolean;
}

export function AdBreak({ script, duration, onComplete, isPaused }: AdBreakProps) {
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

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="rounded-2xl bg-secondary p-5 text-muted-foreground">
        <Megaphone className="h-10 w-10" />
      </div>
      <p className="text-center text-sm text-muted-foreground">{script}</p>
      <div className="w-full max-w-xs space-y-2">
        <Progress value={progress} className="h-1.5" />
        <p className="text-center text-xs text-muted-foreground">
          Ad · {remaining}s remaining
        </p>
      </div>
    </div>
  );
}
