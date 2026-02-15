'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WeatherRadar } from './WeatherRadar';
import { usePreferences } from '@/lib/stores/preferences';
import { weatherData } from '@/data/mock/weather';
import { cn } from '@/lib/utils';

export function WeatherCarousel() {
  const [page, setPage] = useState(0);
  const { city } = usePreferences();
  const data = weatherData[city];
  const autoRotatePaused = useRef(false);

  // Auto-rotate between radar and forecast every 3s
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

  const pages = [
    { id: 'radar', label: 'Radar' },
    { id: 'forecast', label: 'Forecast' },
  ];

  return (
    <div className="w-full space-y-2">
      {page === 0 && <WeatherRadar />}

      {page === 1 && data && (
        <div className="w-full rounded-xl bg-secondary/50 p-3 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.current.icon}</span>
            <div>
              <p className="text-2xl font-bold">{data.current.temp}°C</p>
              <p className="text-sm text-muted-foreground">{data.current.condition}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">Wind {data.current.wind.speed} km/h {data.current.wind.direction}</p>
              <p className="text-xs text-muted-foreground">Humidity {data.current.humidity}%</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {data.forecast.map((f) => (
              <div key={f.time} className="rounded-lg bg-background/50 p-2 text-center">
                <p className="text-xs text-muted-foreground">{f.time}</p>
                <p className="text-sm font-semibold">{f.temp}°</p>
                <p className="text-[10px] text-muted-foreground">{f.condition}</p>
              </div>
            ))}
          </div>
          {data.returnJourney && (
            <p className="text-xs text-muted-foreground italic">{data.returnJourney.summary}</p>
          )}
        </div>
      )}

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
