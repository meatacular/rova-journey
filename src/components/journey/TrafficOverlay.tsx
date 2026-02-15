'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Car, AlertTriangle, Construction, Clock } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { trafficRoutes } from '@/data/mock/traffic';
import { cn } from '@/lib/utils';

interface WaitPoint {
  name: string;
  duration: number;
  type: 'clear' | 'slow' | 'congested' | 'incident';
}

const typeColors: Record<string, string> = {
  clear: 'text-green-400',
  slow: 'text-yellow-400',
  congested: 'text-orange-400',
  incident: 'text-red-400',
};

const typeBg: Record<string, string> = {
  clear: 'bg-green-400/10 border-green-400/20',
  slow: 'bg-yellow-400/10 border-yellow-400/20',
  congested: 'bg-orange-400/10 border-orange-400/20',
  incident: 'bg-red-400/10 border-red-400/20',
};

function getDefaultPoints(city: string): WaitPoint[] {
  const route = trafficRoutes[city];
  if (!route) {
    return [
      { name: 'K Road intersection', duration: 5, type: 'congested' },
      { name: 'Grafton Bridge', duration: 4, type: 'incident' },
      { name: 'Spaghetti Junction', duration: 3, type: 'slow' },
      { name: 'Northwestern Motorway', duration: 0, type: 'clear' },
    ];
  }
  // Build wait points from incidents + add a clear point
  const points: WaitPoint[] = route.incidents.map((inc) => ({
    name: inc.location.split(',')[0].split('/')[0].trim(),
    duration: inc.delay,
    type: inc.delay >= 5 ? 'incident' : inc.delay >= 3 ? 'congested' : 'slow',
  }));
  // Add return journey incidents if available
  if (route.returnJourney?.incidents) {
    route.returnJourney.incidents.forEach((inc) => {
      points.push({
        name: inc.location.split(',')[0].split('/')[0].trim(),
        duration: inc.delay,
        type: inc.delay >= 5 ? 'incident' : inc.delay >= 3 ? 'congested' : 'slow',
      });
    });
  }
  // Ensure at least 4 points for the grid
  while (points.length < 4) {
    points.push({ name: 'All clear', duration: 0, type: 'clear' });
  }
  return points.slice(0, 4);
}

export function TrafficOverlay({ elapsedTime }: { elapsedTime: number }) {
  const { city } = usePreferences();
  const route = trafficRoutes[city];
  const [points, setPoints] = useState(() => getDefaultPoints(city));
  const [page, setPage] = useState(0);
  const autoRotatePaused = useRef(false);

  // Auto-rotate between wait times and route every 3s
  useEffect(() => {
    if (autoRotatePaused.current) return;
    const interval = setInterval(() => {
      setPage((p) => (p === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRotatePaused.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleManualToggle = useCallback((i: number) => {
    autoRotatePaused.current = true;
    setPage(i);
  }, []);

  // Simulate live updates — durations fluctuate slightly every few seconds
  useEffect(() => {
    if (elapsedTime > 0 && elapsedTime % 5 === 0) {
      setPoints((prev) =>
        prev.map((p) => {
          const newDuration = Math.max(0, p.duration + Math.floor(Math.random() * 3) - 1);
          return {
            ...p,
            duration: newDuration,
            type:
              newDuration === 0
                ? 'clear'
                : newDuration <= 2
                  ? 'slow'
                  : newDuration <= 4
                    ? 'congested'
                    : 'incident',
          };
        })
      );
    }
  }, [elapsedTime]);

  const totalDelay = points.reduce((sum, p) => sum + p.duration, 0);

  // Build Google Maps embed URL
  const from = route ? `${route.from}, ${route.city}` : 'Grey Lynn, Auckland';
  const to = route ? `${route.to}, ${route.city}` : 'Auckland CBD';
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(from)}+to+${encodeURIComponent(to)}&output=embed&z=13&layer=traffic`;

  const pages = [
    { id: 'waits', label: 'Live Traffic' },
    { id: 'route', label: 'Route' },
  ];

  return (
    <div className="w-full space-y-2">
      {/* Sliding container */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {/* Page 0: Live Wait Times as square cards */}
          <div className="w-full shrink-0">
            <div className="w-full rounded-xl bg-secondary/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Wait Times</span>
                <span className={cn('text-xs font-bold', totalDelay > 6 ? 'text-orange-400' : 'text-green-400')}>
                  +{totalDelay} min
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {points.map((point, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-xl border p-3 flex flex-col items-center justify-center text-center gap-1.5',
                      typeBg[point.type]
                    )}
                  >
                    <div className={cn('shrink-0', typeColors[point.type])}>
                      {point.type === 'incident' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : point.type === 'congested' ? (
                        <Construction className="h-5 w-5" />
                      ) : point.type === 'clear' ? (
                        <Car className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <p className="text-xs font-medium leading-tight line-clamp-2">{point.name}</p>
                    <p className={cn('text-sm font-bold tabular-nums', typeColors[point.type])}>
                      {point.duration > 0 ? `+${point.duration} min` : 'Clear'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Page 1: Route Map */}
          <div className="w-full shrink-0">
            <div className="w-full rounded-xl bg-secondary/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Route</span>
                <span className="text-xs text-muted-foreground">
                  {route ? `${route.currentDuration} min` : '27 min'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="font-medium">{from.split(',')[0]}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{to.split(',')[0]}</span>
              </div>
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <iframe
                  src={mapsUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Route map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page indicator / toggle */}
      <div className="flex items-center justify-center gap-2">
        {pages.map((p, i) => (
          <button
            key={p.id}
            onClick={() => handleManualToggle(i)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              page === i
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
