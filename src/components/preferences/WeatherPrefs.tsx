'use client';

import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Cloud } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { weatherData } from '@/data/mock/weather';

export function WeatherPrefs() {
  const { weather, city, setWeatherEnabled } = usePreferences();
  const data = weatherData[city];

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between border-0 bg-secondary/50 p-4">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-sky-400" />
          <span className="text-sm font-medium">Weather updates</span>
        </div>
        <Switch checked={weather.enabled} onCheckedChange={setWeatherEnabled} />
      </Card>

      {weather.enabled && data && (
        <Card className="border-0 bg-secondary/50 p-4">
          <h3 className="mb-3 text-sm font-semibold">{data.city} — Preview</h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{data.current.icon}</span>
            <div>
              <p className="text-2xl font-bold">{data.current.temp}°C</p>
              <p className="text-sm text-muted-foreground">{data.current.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {data.forecast.map((f) => (
              <div key={f.time} className="rounded-lg bg-background/50 p-2 text-center">
                <p className="text-xs text-muted-foreground">{f.time}</p>
                <p className="text-sm font-semibold">{f.temp}°</p>
                <p className="text-xs text-muted-foreground">{f.condition}</p>
              </div>
            ))}
          </div>
          {data.returnJourney && (
            <p className="mt-3 text-xs text-muted-foreground italic">
              Tonight: {data.returnJourney.summary}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
