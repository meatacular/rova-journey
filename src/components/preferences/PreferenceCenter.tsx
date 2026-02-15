'use client';

import { useState } from 'react';
import { Navigation, Car, Cloud, Newspaper, Trophy, Radio, Mic, Music, Calendar, Settings, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePreferences } from '@/lib/stores/preferences';
import { stations } from '@/data/mock/stations';
import { podcasts } from '@/data/mock/podcasts';
import { voices } from '@/data/mock/voices';
import { musicBeds } from '@/data/mock/music-beds';
import { weatherData } from '@/data/mock/weather';
import { SettingsDrawer, type SettingsSection } from '@/components/settings/SettingsDrawer';

// --- Section header with cog ---
function SectionHeader({ icon: Icon, title, onSettings }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onSettings: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2 pb-1">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <button
        onClick={onSettings}
        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Settings className="h-4 w-4" />
      </button>
    </div>
  );
}

export function PreferenceCenter() {
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null);

  const {
    journeys, homeAddress, workAddress, city, traffic,
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
    <div className="space-y-6">

      {/* ── Journeys ── */}
      <section>
        <SectionHeader icon={Navigation} title="My Journeys" onSettings={() => open('journeys')} />
        <div className="space-y-2">
          {journeys.map((j) => (
            <Card key={j.id} className="border-0 bg-secondary/50 p-4">
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
              <div className="flex flex-wrap gap-1.5 mt-2">
                {j.segments.traffic && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Traffic</Badge>}
                {j.segments.weather && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Weather</Badge>}
                {j.segments.news && <Badge variant="outline" className="text-[10px] px-1.5 py-0">News</Badge>}
                {j.segments.sport && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Sport</Badge>}
                {j.segments.entertainment && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Music</Badge>}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Traffic ── */}
      <section>
        <SectionHeader icon={Car} title="Traffic" onSettings={() => open('traffic')} />
        <Card className="border-0 bg-secondary/50 p-4 space-y-1">
          <p className="text-sm font-medium">{traffic.enabled ? 'Updates on' : 'Updates off'}</p>
          <p className="text-xs text-muted-foreground">{homeAddress} → {workAddress}</p>
          <p className="text-xs text-muted-foreground capitalize">{city}</p>
        </Card>
      </section>

      {/* ── Weather ── */}
      <section>
        <SectionHeader icon={Cloud} title="Weather" onSettings={() => open('weather')} />
        {weather.enabled && data ? (
          <Card className="border-0 bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{data.current.icon}</span>
              <div>
                <p className="text-2xl font-bold">{data.current.temp}°C</p>
                <p className="text-sm text-muted-foreground">{data.current.condition}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">Wind {data.current.wind.speed} km/h</p>
                <p className="text-xs text-muted-foreground">Humidity {data.current.humidity}%</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {data.forecast.map((f) => (
                <div key={f.time} className="rounded-lg bg-background/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">{f.time}</p>
                  <p className="text-sm font-semibold">{f.temp}°</p>
                  <p className="text-[10px] text-muted-foreground">{f.condition}</p>
                </div>
              ))}
            </div>
            {data.returnJourney && (
              <p className="text-xs text-muted-foreground italic mt-2">{data.returnJourney.summary}</p>
            )}
          </Card>
        ) : (
          <Card className="border-0 bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Weather updates off</p>
          </Card>
        )}
      </section>

      {/* ── News ── */}
      <section>
        <SectionHeader icon={Newspaper} title="News" onSettings={() => open('news')} />
        <Card className="border-0 bg-secondary/50 p-4 space-y-2">
          <p className="text-sm font-medium">{news.enabled ? 'Updates on' : 'Updates off'}</p>
          {news.enabled && (
            <>
              <div className="flex flex-wrap gap-1.5">
                {news.categories.map((c) => (
                  <Badge key={c} className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 capitalize">{c}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground capitalize">Length: {news.length}</p>
            </>
          )}
        </Card>
      </section>

      {/* ── Sport ── */}
      <section>
        <SectionHeader icon={Trophy} title="Sport" onSettings={() => open('sport')} />
        <Card className="border-0 bg-secondary/50 p-4 space-y-2">
          <p className="text-sm font-medium">{sport.enabled ? 'Updates on' : 'Updates off'}</p>
          {sport.enabled && (
            <>
              <div className="flex flex-wrap gap-1.5">
                {sport.categories.map((c) => (
                  <Badge key={c} className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 capitalize">{c}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground capitalize">Length: {sport.length}</p>
            </>
          )}
        </Card>
      </section>

      {/* ── Station / Podcast ── */}
      <section>
        <SectionHeader icon={Radio} title={entertainment.type === 'station' ? 'Station' : 'Podcast'} onSettings={() => open('listen')} />
        <Card className="border-0 bg-secondary/50 p-4">
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
            <div>
              <p className="text-sm font-semibold">{podcast.name}</p>
              <p className="text-xs text-muted-foreground">{podcast.host} — {podcast.category}</p>
            </div>
          ) : null}
        </Card>
      </section>

      {/* ── Voice ── */}
      {voice && (
        <section>
          <SectionHeader icon={Mic} title="Voice" onSettings={() => open('listen')} />
          <Card className="border-0 bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{voice.avatar}</span>
              <div>
                <p className="text-sm font-semibold">{voice.name}</p>
                <p className="text-xs text-muted-foreground">{voice.description}</p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* ── Music Bed ── */}
      <section>
        <SectionHeader icon={Music} title="Music Bed" onSettings={() => open('listen')} />
        <Card className="border-0 bg-secondary/50 p-4">
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
        </Card>
      </section>

      {/* ── Calendar ── */}
      <section>
        <SectionHeader icon={Calendar} title="Calendar" onSettings={() => open('calendar')} />
        {calendar.connected ? (
          <Card className="border-0 bg-secondary/50 p-4">
            <p className="text-xs text-muted-foreground mb-2">Today&apos;s Events</p>
            <div className="space-y-2">
              {mockEvents.map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-primary min-w-[55px]">{e.time}</span>
                  <p className="text-sm truncate flex-1">{e.title}</p>
                  <span className="text-xs text-muted-foreground">{e.duration}</span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="border-0 bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">No calendar connected</p>
            <p className="text-xs text-muted-foreground mt-1">Tap the cog to connect.</p>
          </Card>
        )}
      </section>

      <SettingsDrawer
        section={settingsSection}
        onOpenChange={(open) => { if (!open) setSettingsSection(null); }}
      />
    </div>
  );
}
