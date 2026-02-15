'use client';

import { useState } from 'react';
import { Navigation, Newspaper, Radio, Calendar, Car, Cloud, Trophy, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePreferences } from '@/lib/stores/preferences';
import { stations } from '@/data/mock/stations';
import { podcasts } from '@/data/mock/podcasts';
import { voices } from '@/data/mock/voices';
import { musicBeds } from '@/data/mock/music-beds';
import { weatherData } from '@/data/mock/weather';
import { cn } from '@/lib/utils';
import { SettingsDrawer, type SettingsSection } from '@/components/settings/SettingsDrawer';

// --- Tab button ---
function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 flex-col items-center gap-1 rounded-xl py-3 transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// --- Cog button for opening settings ---
function SectionCog({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Settings className="h-4 w-4" />
    </button>
  );
}

// ===================== Content-first views =====================

function JourneysView({ onSettings }: { onSettings: () => void }) {
  const { journeys } = usePreferences();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">My Journeys</h2>
        <SectionCog onClick={onSettings} />
      </div>
      {journeys.map((j) => (
        <Card key={j.id} className="border-0 bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{j.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{j.name}</p>
              <p className="text-xs text-muted-foreground truncate">{j.from} → {j.to}</p>
            </div>
            {j.schedule.enabled && (
              <span className="text-[10px] text-muted-foreground">{j.schedule.time}</span>
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
  );
}

// --- Content tab with sub-tabs ---
type ContentSubTab = 'traffic' | 'weather' | 'news' | 'sport';

function ContentView({ onSettings }: { onSettings: (section: SettingsSection) => void }) {
  const [sub, setSub] = useState<ContentSubTab>('traffic');

  return (
    <div className="space-y-3">
      {/* Sub-tab bar — 4 icons, no scroll */}
      <div className="grid grid-cols-4 gap-1.5">
        <TabButton icon={Car} label="Traffic" active={sub === 'traffic'} onClick={() => setSub('traffic')} />
        <TabButton icon={Cloud} label="Weather" active={sub === 'weather'} onClick={() => setSub('weather')} />
        <TabButton icon={Newspaper} label="News" active={sub === 'news'} onClick={() => setSub('news')} />
        <TabButton icon={Trophy} label="Sport" active={sub === 'sport'} onClick={() => setSub('sport')} />
      </div>

      {sub === 'traffic' && <TrafficSummary onSettings={() => onSettings('traffic')} />}
      {sub === 'weather' && <WeatherSummary onSettings={() => onSettings('weather')} />}
      {sub === 'news' && <NewsSummary onSettings={() => onSettings('news')} />}
      {sub === 'sport' && <SportSummary onSettings={() => onSettings('sport')} />}
    </div>
  );
}

function TrafficSummary({ onSettings }: { onSettings: () => void }) {
  const { homeAddress, workAddress, city, traffic } = usePreferences();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Traffic</h2>
        <SectionCog onClick={onSettings} />
      </div>
      <Card className="border-0 bg-secondary/50 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-medium">
            {traffic.enabled ? 'Updates on' : 'Updates off'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{homeAddress} → {workAddress}</p>
        <p className="text-xs text-muted-foreground capitalize">City: {city}</p>
      </Card>
    </div>
  );
}

function WeatherSummary({ onSettings }: { onSettings: () => void }) {
  const { weather, city } = usePreferences();
  const data = weatherData[city];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Weather</h2>
        <SectionCog onClick={onSettings} />
      </div>
      {weather.enabled && data ? (
        <Card className="border-0 bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.current.icon}</span>
            <div>
              <p className="text-2xl font-bold">{data.current.temp}°C</p>
              <p className="text-sm text-muted-foreground">{data.current.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {data.forecast.map((f) => (
              <div key={f.time} className="rounded-lg bg-background/50 p-2 text-center">
                <p className="text-xs text-muted-foreground">{f.time}</p>
                <p className="text-sm font-semibold">{f.temp}°</p>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="border-0 bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">Weather updates off</p>
        </Card>
      )}
    </div>
  );
}

function NewsSummary({ onSettings }: { onSettings: () => void }) {
  const { news } = usePreferences();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">News</h2>
        <SectionCog onClick={onSettings} />
      </div>
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
    </div>
  );
}

function SportSummary({ onSettings }: { onSettings: () => void }) {
  const { sport } = usePreferences();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Sport</h2>
        <SectionCog onClick={onSettings} />
      </div>
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
    </div>
  );
}

// --- Listen tab ---
function ListenView({ onSettings }: { onSettings: () => void }) {
  const { entertainment, voiceId, musicBed } = usePreferences();
  const station = stations.find((s) => s.id === entertainment.stationId);
  const podcast = podcasts.find((p) => p.id === entertainment.podcastId);
  const voice = voices.find((v) => v.id === voiceId);
  const bed = musicBeds.find((b) => b.id === musicBed.styleId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Listen</h2>
        <SectionCog onClick={onSettings} />
      </div>

      {/* Station / Podcast */}
      <Card className="border-0 bg-secondary/50 p-4">
        <p className="text-xs text-muted-foreground mb-1">
          {entertainment.type === 'station' ? 'Station' : 'Podcast'}
        </p>
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
              <p className="text-xs text-muted-foreground">{station.genre}</p>
            </div>
          </div>
        ) : podcast ? (
          <div>
            <p className="text-sm font-semibold">{podcast.name}</p>
            <p className="text-xs text-muted-foreground">{podcast.host}</p>
          </div>
        ) : null}
      </Card>

      {/* Voice */}
      {voice && (
        <Card className="border-0 bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground mb-1">Voice</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{voice.avatar}</span>
            <div>
              <p className="text-sm font-semibold">{voice.name}</p>
              <p className="text-xs text-muted-foreground">{voice.personality}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Music Bed */}
      <Card className="border-0 bg-secondary/50 p-4">
        <p className="text-xs text-muted-foreground mb-1">Music Bed</p>
        <p className="text-sm font-semibold capitalize">{musicBed.mode}</p>
        {musicBed.mode === 'manual' && bed && (
          <p className="text-xs text-muted-foreground">{bed.name} — {bed.bpm} BPM</p>
        )}
      </Card>
    </div>
  );
}

// --- Calendar tab ---
function CalendarView({ onSettings }: { onSettings: () => void }) {
  const { calendar } = usePreferences();

  const mockEvents = [
    { time: '9:00 AM', title: 'Stand-up', duration: '15 min' },
    { time: '10:30 AM', title: 'Sprint Planning', duration: '1 hr' },
    { time: '12:00 PM', title: 'Lunch with Sarah', duration: '1 hr' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Calendar</h2>
        <SectionCog onClick={onSettings} />
      </div>
      {calendar.connected ? (
        <>
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
        </>
      ) : (
        <Card className="border-0 bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">No calendar connected</p>
          <p className="text-xs text-muted-foreground mt-1">Tap the cog to connect one.</p>
        </Card>
      )}
    </div>
  );
}

// ===================== Main PreferenceCenter =====================

type TopTab = 'journeys' | 'content' | 'listen' | 'calendar';

export function PreferenceCenter() {
  const [tab, setTab] = useState<TopTab>('journeys');
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null);

  const openSettings = (section: SettingsSection) => setSettingsSection(section);

  return (
    <>
      {/* Top-level tabs — 4 icons, no scroll */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        <TabButton icon={Navigation} label="Journeys" active={tab === 'journeys'} onClick={() => setTab('journeys')} />
        <TabButton icon={Newspaper} label="Content" active={tab === 'content'} onClick={() => setTab('content')} />
        <TabButton icon={Radio} label="Listen" active={tab === 'listen'} onClick={() => setTab('listen')} />
        <TabButton icon={Calendar} label="Calendar" active={tab === 'calendar'} onClick={() => setTab('calendar')} />
      </div>

      {tab === 'journeys' && <JourneysView onSettings={() => openSettings('journeys')} />}
      {tab === 'content' && <ContentView onSettings={openSettings} />}
      {tab === 'listen' && <ListenView onSettings={() => openSettings('listen')} />}
      {tab === 'calendar' && <CalendarView onSettings={() => openSettings('calendar')} />}

      <SettingsDrawer
        section={settingsSection}
        onOpenChange={(open) => { if (!open) setSettingsSection(null); }}
      />
    </>
  );
}
