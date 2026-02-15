'use client';

import { useState } from 'react';
import { Navigation, Car, Cloud, Newspaper, Trophy, Radio, Mic, Music, Calendar, Settings, Star, Play, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePreferences } from '@/lib/stores/preferences';
import { stations } from '@/data/mock/stations';
import { podcasts } from '@/data/mock/podcasts';
import { voices } from '@/data/mock/voices';
import { musicBeds } from '@/data/mock/music-beds';
import { weatherData } from '@/data/mock/weather';
import { SettingsDrawer, type SettingsSection } from '@/components/settings/SettingsDrawer';
import { trafficRoutes } from '@/data/mock/traffic';
import { useStartJourney } from '@/lib/hooks/useStartJourney';
import Image from 'next/image';

// --- Feed card wrapper: icon + title + play + cog in header, content below ---
function FeedCard({ icon: Icon, title, onSettings, onPlay, children, color }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onSettings: () => void;
  onPlay?: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <Card className="border-0 bg-secondary/50 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
        <Icon className={`h-4 w-4 shrink-0 ${color || 'text-primary'}`} />
        <h2 className="text-sm font-semibold flex-1">{title}</h2>
        {onPlay && (
          <button
            onClick={onPlay}
            className="rounded-full p-1 text-primary transition-colors hover:bg-primary/10"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
          </button>
        )}
        <button
          onClick={onSettings}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="px-4 pb-4">
        {children}
      </div>
    </Card>
  );
}

export function PreferenceCenter() {
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null);
  const { startDefault } = useStartJourney();

  const {
    journeys, city, traffic,
    weather, news, sport, entertainment, voiceId, musicBed, calendar,
  } = usePreferences();

  const data = weatherData[city];
  const station = stations.find((s) => s.id === entertainment.stationId);
  const podcast = podcasts.find((p) => p.id === entertainment.podcastId);
  const voice = voices.find((v) => v.id === voiceId);
  const bed = musicBeds.find((b) => b.id === musicBed.styleId);

  const open = (s: SettingsSection) => setSettingsSection(s);

  const mockEvents = [
    { time: '9:00 AM', title: 'Stand-up', duration: '15 min' },
    { time: '10:30 AM', title: 'Sprint Planning', duration: '1 hr' },
    { time: '12:00 PM', title: 'Lunch with Sarah', duration: '1 hr' },
  ];

  return (
    <div className="space-y-3">

      {/* ── Traffic ── */}
      <FeedCard icon={Car} title="Traffic" color="text-orange-400" onSettings={() => open('traffic')} onPlay={startDefault}>
        {traffic.enabled && trafficRoutes[city] ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span>{trafficRoutes[city].from}</span>
              <span className="text-muted-foreground">→</span>
              <span>{trafficRoutes[city].to}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-orange-400">{trafficRoutes[city].currentDuration} min</span>
              <span className="text-xs text-muted-foreground">usually {trafficRoutes[city].normalDuration} min</span>
            </div>
            {trafficRoutes[city].incidents.length > 0 && (
              <p className="text-xs text-muted-foreground">{trafficRoutes[city].incidents[0].description}</p>
            )}
          </div>
        ) : (
          <button onClick={() => open('traffic')} className="flex items-center gap-2 text-sm text-primary">
            <MapPin className="h-3.5 w-3.5" />
            Set your commute route
          </button>
        )}
      </FeedCard>

      {/* ── Weather ── */}
      <FeedCard icon={Cloud} title="Weather" color="text-sky-400" onSettings={() => open('weather')} onPlay={startDefault}>
        {weather.enabled && data ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{data.current.icon}</span>
              <div>
                <p className="text-2xl font-bold">{data.current.temp}°C</p>
                <p className="text-xs text-muted-foreground">{data.current.condition}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] text-muted-foreground">Wind {data.current.wind.speed} km/h</p>
                <p className="text-[10px] text-muted-foreground">Humidity {data.current.humidity}%</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {data.forecast.map((f) => (
                <div key={f.time} className="rounded-lg bg-background/50 p-1.5 text-center">
                  <p className="text-[10px] text-muted-foreground">{f.time}</p>
                  <p className="text-sm font-semibold">{f.temp}°</p>
                  <p className="text-[10px] text-muted-foreground">{f.condition}</p>
                </div>
              ))}
            </div>
            {data.returnJourney && (
              <p className="text-xs text-muted-foreground italic">{data.returnJourney.summary}</p>
            )}
          </div>
        ) : (
          <button onClick={() => open('weather')} className="flex items-center gap-2 text-sm text-primary">
            <MapPin className="h-3.5 w-3.5" />
            Set your city for local forecasts
          </button>
        )}
      </FeedCard>

      {/* ── News ── */}
      <FeedCard icon={Newspaper} title="News" color="text-red-400" onSettings={() => open('news')} onPlay={startDefault}>
        {news.enabled ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Black Caps lineup announced for England tour</p>
            <div className="flex flex-wrap gap-1.5">
              {news.categories.map((c) => (
                <Badge key={c} className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 capitalize">{c}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{news.length} briefing</p>
          </div>
        ) : (
          <button onClick={() => open('news')} className="flex items-center gap-2 text-sm text-primary">
            <Newspaper className="h-3.5 w-3.5" />
            Choose your news categories
          </button>
        )}
      </FeedCard>

      {/* ── Sport ── */}
      <FeedCard icon={Trophy} title="Sport" color="text-green-400" onSettings={() => open('sport')} onPlay={startDefault}>
        {sport.enabled ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Silver Ferns claim Constellation Cup</p>
            <div className="flex flex-wrap gap-1.5">
              {sport.categories.map((c) => (
                <Badge key={c} className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 capitalize">{c}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{sport.length} update</p>
          </div>
        ) : (
          <button onClick={() => open('sport')} className="flex items-center gap-2 text-sm text-primary">
            <Trophy className="h-3.5 w-3.5" />
            Pick your favourite sports
          </button>
        )}
      </FeedCard>

      {/* ── Station / Podcast ── */}
      <FeedCard
        icon={Radio}
        title={entertainment.type === 'station' ? 'Station' : 'Podcast'}
        color="text-purple-400"
        onSettings={() => open('listen')}
        onPlay={startDefault}
      >
        {entertainment.type === 'station' && station ? (
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: station.color }}
            >
              {station.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{station.name}</p>
              <p className="text-xs text-muted-foreground">{station.genre} — {station.tagline}</p>
            </div>
          </div>
        ) : podcast ? (
          <div className="flex items-center gap-3">
            {podcast.artwork && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image src={podcast.artwork} alt={podcast.name} fill className="object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{podcast.name}</p>
              <p className="text-xs text-muted-foreground truncate">{podcast.host}</p>
              <p className="text-xs text-primary truncate">{podcast.latestEpisode.title}</p>
            </div>
          </div>
        ) : (
          <button onClick={() => open('listen')} className="flex items-center gap-2 text-sm text-primary">
            <Radio className="h-3.5 w-3.5" />
            Choose your station or podcast
          </button>
        )}
      </FeedCard>

      {/* ── Voice ── */}
      {voice && (
        <FeedCard icon={Mic} title="Voice" onSettings={() => open('listen')}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{voice.avatar}</span>
            <div>
              <p className="text-sm font-semibold">{voice.name}</p>
              <p className="text-xs text-muted-foreground">{voice.description}</p>
            </div>
          </div>
        </FeedCard>
      )}

      {/* ── Music Bed ── */}
      <FeedCard icon={Music} title="Music Bed" onSettings={() => open('listen')}>
        <div>
          <p className="text-sm font-semibold capitalize">{musicBed.mode}</p>
          {musicBed.mode === 'manual' && bed && (
            <p className="text-xs text-muted-foreground">{bed.name} — {bed.description}</p>
          )}
          {musicBed.mode === 'auto' && (
            <p className="text-xs text-muted-foreground">Matches your station</p>
          )}
          {musicBed.mode === 'none' && (
            <p className="text-xs text-muted-foreground">No background music</p>
          )}
        </div>
      </FeedCard>

      {/* ── Calendar ── */}
      <FeedCard icon={Calendar} title="Calendar" onSettings={() => open('calendar')}>
        {calendar.connected ? (
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Today</p>
            {mockEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono text-primary min-w-[55px]">{e.time}</span>
                <p className="text-sm truncate flex-1">{e.title}</p>
                <span className="text-xs text-muted-foreground">{e.duration}</span>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={() => open('calendar')} className="flex items-center gap-2 text-sm text-primary">
            <Calendar className="h-3.5 w-3.5" />
            Connect your calendar to see events
          </button>
        )}
      </FeedCard>

      {/* ── My Journeys (bottom) ── */}
      <FeedCard icon={Navigation} title="My Journeys" onSettings={() => open('journeys')}>
        <div className="space-y-2">
          {journeys.map((j) => (
            <div key={j.id} className="rounded-lg bg-background/30 p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{j.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate">{j.name}</p>
                    {j.isDefault && <Star className="h-3 w-3 text-primary fill-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{j.from} → {j.to}</p>
                </div>
                {j.schedule.enabled && (
                  <span className="text-[10px] text-muted-foreground shrink-0">{j.schedule.time}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {j.segments.traffic && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Traffic</Badge>}
                {j.segments.weather && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Weather</Badge>}
                {j.segments.news && <Badge variant="outline" className="text-[10px] px-1.5 py-0">News</Badge>}
                {j.segments.sport && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Sport</Badge>}
                {j.segments.entertainment && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Music</Badge>}
              </div>
            </div>
          ))}
        </div>
      </FeedCard>

      <SettingsDrawer
        section={settingsSection}
        onOpenChange={(open) => { if (!open) setSettingsSection(null); }}
      />
    </div>
  );
}
