'use client';

import { Card } from '@/components/ui/card';
import { Radio, Headphones } from 'lucide-react';
import { usePreferences } from '@/lib/stores/preferences';
import { stations } from '@/data/mock/stations';
import { podcasts } from '@/data/mock/podcasts';
import { cn } from '@/lib/utils';

export function EntertainmentPrefs() {
  const { entertainment, setEntertainmentType, setStationId, setPodcastId } = usePreferences();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setEntertainmentType('station')}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg p-3 transition-colors',
            entertainment.type === 'station'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-accent'
          )}
        >
          <Radio className="h-4 w-4" />
          <span className="text-sm font-medium">Station</span>
        </button>
        <button
          onClick={() => setEntertainmentType('podcast')}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg p-3 transition-colors',
            entertainment.type === 'podcast'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-accent'
          )}
        >
          <Headphones className="h-4 w-4" />
          <span className="text-sm font-medium">Podcast</span>
        </button>
      </div>

      {entertainment.type === 'station' ? (
        <div className="grid grid-cols-2 gap-2">
          {stations.map((station) => (
            <Card
              key={station.id}
              className={cn(
                'cursor-pointer border-0 p-3 transition-all',
                entertainment.stationId === station.id
                  ? 'ring-2 ring-primary'
                  : 'bg-secondary/50 hover:bg-secondary'
              )}
              onClick={() => setStationId(station.id)}
            >
              <div
                className="mb-2 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: station.color }}
              >
                {station.name.charAt(0)}
              </div>
              <p className="text-sm font-semibold">{station.name}</p>
              <p className="text-xs text-muted-foreground">{station.genre}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {podcasts.map((podcast) => (
            <Card
              key={podcast.id}
              className={cn(
                'cursor-pointer border-0 p-3 transition-all',
                entertainment.podcastId === podcast.id
                  ? 'ring-2 ring-primary'
                  : 'bg-secondary/50 hover:bg-secondary'
              )}
              onClick={() => setPodcastId(podcast.id)}
            >
              <p className="text-sm font-semibold">{podcast.name}</p>
              <p className="text-xs text-muted-foreground">{podcast.host} · {podcast.category}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
