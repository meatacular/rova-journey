'use client';

import { useState, useEffect } from 'react';
import { Car, AlertTriangle, Construction } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WaitPoint {
  name: string;
  duration: number;
  type: 'clear' | 'slow' | 'congested' | 'incident';
}

const defaultPoints: WaitPoint[] = [
  { name: 'K Road intersection', duration: 5, type: 'congested' },
  { name: 'Grafton Bridge', duration: 4, type: 'incident' },
];

const typeColors: Record<string, string> = {
  clear: 'text-green-400',
  slow: 'text-yellow-400',
  congested: 'text-orange-400',
  incident: 'text-red-400',
};

const typeBg: Record<string, string> = {
  clear: 'bg-green-400/10',
  slow: 'bg-yellow-400/10',
  congested: 'bg-orange-400/10',
  incident: 'bg-red-400/10',
};

export function TrafficOverlay({ elapsedTime }: { elapsedTime: number }) {
  const [points, setPoints] = useState(defaultPoints);

  // Simulate live updates — durations fluctuate slightly every few seconds
  useEffect(() => {
    if (elapsedTime > 0 && elapsedTime % 5 === 0) {
      setPoints((prev) =>
        prev.map((p) => ({
          ...p,
          duration: Math.max(0, p.duration + Math.floor(Math.random() * 3) - 1),
          type:
            p.duration <= 1
              ? 'clear'
              : p.duration <= 2
                ? 'slow'
                : p.duration <= 4
                  ? 'congested'
                  : 'incident',
        }))
      );
    }
  }, [elapsedTime]);

  const totalDelay = points.reduce((sum, p) => sum + p.duration, 0);

  return (
    <div className="w-full rounded-xl bg-secondary/50 p-3 space-y-2">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Wait Times</span>
        <span className={cn('text-xs font-bold', totalDelay > 10 ? 'text-orange-400' : 'text-green-400')}>
          +{totalDelay} min
        </span>
      </div>

      {/* Wait points */}
      <div className="space-y-1.5">
        {points.map((point, i) => (
          <div key={i} className={cn('flex items-center gap-2 rounded-lg px-2.5 py-1.5', typeBg[point.type])}>
            <div className={cn('shrink-0', typeColors[point.type])}>
              {point.type === 'incident' ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : point.type === 'congested' ? (
                <Construction className="h-3.5 w-3.5" />
              ) : (
                <Car className="h-3.5 w-3.5" />
              )}
            </div>
            <span className="flex-1 text-xs truncate">{point.name}</span>
            <span className={cn('text-xs font-semibold tabular-nums', typeColors[point.type])}>
              {point.duration > 0 ? `+${point.duration} min` : 'Clear'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
