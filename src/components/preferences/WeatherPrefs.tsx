'use client';

import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Cloud, Car } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { weatherData } from '@/data/mock/weather';

export function WeatherPrefs() {
  const { weather, city, homeAddress, workAddress, setWeatherEnabled } = usePreferences();
  const data = weatherData[city];

  const sameLocation = homeAddress.toLowerCase() === workAddress.toLowerCase();

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
        <>
          {sameLocation ? (
            <Card className="border-0 bg-secondary/50 p-4">
              <h3 className="mb-3 text-sm font-semibold">{homeAddress}</h3>
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
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-0 bg-secondary/50 p-4">
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Home — {homeAddress}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{data.current.icon}</span>
                  <div>
                    <p className="text-xl font-bold">{data.current.temp}°C</p>
                    <p className="text-xs text-muted-foreground">{data.current.condition}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Wind: {data.current.wind.speed} km/h {data.current.wind.direction}
                </p>
              </Card>

              <Card className="border-0 bg-secondary/50 p-4">
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Work — {workAddress}</h3>
                {data.destination ? (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{data.current.icon}</span>
                    <div>
                      <p className="text-xl font-bold">{data.destination.temp}°C</p>
                      <p className="text-xs text-muted-foreground">{data.destination.condition}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Same as home</p>
                )}
              </Card>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {data.forecast.map((f) => (
              <div key={f.time} className="rounded-lg bg-secondary/30 p-2 text-center">
                <p className="text-xs text-muted-foreground">{f.time}</p>
                <p className="text-sm font-semibold">{f.temp}°</p>
                <p className="text-xs text-muted-foreground">{f.condition}</p>
              </div>
            ))}
          </div>

          {data.returnJourney && (
            <Card className="border-0 bg-secondary/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-4 w-4 text-orange-400" />
                <h3 className="text-sm font-semibold">Drive Home</h3>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xl font-bold">{data.returnJourney.temp}°C</p>
                <p className="text-sm text-muted-foreground">{data.returnJourney.condition}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground italic">
                {data.returnJourney.summary}
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
