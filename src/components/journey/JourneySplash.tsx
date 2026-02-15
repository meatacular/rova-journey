'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePreferences } from '@/lib/stores/preferences';
import { JourneyPreset } from '@/lib/types';

interface JourneySplashProps {
  onSelectJourney: (journey: JourneyPreset) => void;
  onDismiss: () => void;
}

export function JourneySplash({ onSelectJourney, onDismiss }: JourneySplashProps) {
  const { journeys } = usePreferences();
  const [progress, setProgress] = useState(0);
  const [autoStarted, setAutoStarted] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const defaultJourney = journeys.find((j) => j.isDefault) || journeys[0];

  // Auto-fill progress bar over 2 seconds for the default journey
  useEffect(() => {
    if (autoStarted) return;

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const pct = Math.min(elapsed / 2000, 1);
      setProgress(pct * 100);

      if (pct >= 1) {
        setAutoStarted(true);
        onSelectJourney(defaultJourney);
        return;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [autoStarted, defaultJourney, onSelectJourney]);

  const handleSelect = (journey: JourneyPreset) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setAutoStarted(true);
    onSelectJourney(journey);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold">Choose your journey</h1>
        <Button variant="ghost" size="icon" onClick={onDismiss}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Journey list — sized so exactly 3.5 cards are visible */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="space-y-3">
          {journeys.map((journey) => {
            const isDefault = journey.id === defaultJourney?.id;

            return (
              <button
                key={journey.id}
                onClick={() => handleSelect(journey)}
                className="relative w-full overflow-hidden rounded-2xl bg-secondary/80 p-5 text-left transition-all active:scale-[0.98] hover:bg-secondary"
              >
                {/* Auto-fill progress bar (only on default) */}
                {isDefault && !autoStarted && (
                  <div
                    className="absolute inset-0 bg-primary/15 transition-none"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-background/60 text-2xl">
                    {journey.icon}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold truncate">{journey.name}</h3>
                      {isDefault && (
                        <span className="shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="truncate">{journey.from}</span>
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <span className="truncate">{journey.to}</span>
                    </div>
                    {journey.schedule.enabled && (
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {journey.schedule.time} · {formatDays(journey.schedule.days)}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>

                {/* Progress bar track for default */}
                {isDefault && !autoStarted && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div
                      className="h-full bg-primary transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatDays(days: number[]): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (days.length === 7) return 'Every day';
  if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Weekdays';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
  return days.map((d) => dayNames[d]).join(', ');
}
