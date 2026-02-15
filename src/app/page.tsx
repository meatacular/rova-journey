'use client';

import { useRouter } from 'next/navigation';
import { Car, Cloud, Newspaper, Megaphone, Radio, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/layout/AppShell';
import { JourneyHero } from '@/components/journey/JourneyHero';
import { usePreferences } from '@/lib/stores/preferences';
import { useJourney } from '@/lib/stores/journey';
import { stations } from '@/data/mock/stations';
import { podcasts } from '@/data/mock/podcasts';
import { trafficRoutes } from '@/data/mock/traffic';
import { scripts } from '@/data/mock/scripts';
import { JourneySegment } from '@/lib/types';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const segmentPreviewIcons: Record<string, React.ElementType> = {
  traffic: Car,
  weather: Cloud,
  news: Newspaper,
  ad: Megaphone,
  entertainment: Radio,
};

export default function HomePage() {
  const router = useRouter();
  const prefs = usePreferences();
  const { buildJourney, startJourney } = useJourney();

  const cityName =
    prefs.city === 'auckland'
      ? 'Auckland'
      : prefs.city === 'wellington'
        ? 'Wellington'
        : prefs.city === 'christchurch'
          ? 'Christchurch'
          : 'Hamilton';

  const station = stations.find((s) => s.id === prefs.entertainment.stationId);
  const podcast = podcasts.find((p) => p.id === prefs.entertainment.podcastId);
  const entertainmentName =
    prefs.entertainment.type === 'station' ? station?.name || 'The Edge' : podcast?.name || 'Podcast';

  // Build segment preview
  const segmentPreview: { type: string; label: string }[] = [];
  if (prefs.traffic.enabled) {
    segmentPreview.push({ type: 'traffic', label: 'Traffic' });
    segmentPreview.push({ type: 'ad', label: 'Ad' });
  }
  if (prefs.weather.enabled) {
    segmentPreview.push({ type: 'weather', label: 'Weather' });
    segmentPreview.push({ type: 'ad', label: 'Ad' });
  }
  if (prefs.news.enabled) {
    segmentPreview.push({ type: 'news', label: 'News' });
    segmentPreview.push({ type: 'ad', label: 'Ad' });
  }
  segmentPreview.push({ type: 'entertainment', label: entertainmentName });

  // Estimate duration
  const estimatedDuration = segmentPreview.reduce((acc, seg) => {
    if (seg.type === 'ad') return acc + 0.25;
    if (seg.type === 'traffic') return acc + 1.5;
    if (seg.type === 'weather') return acc + 1;
    if (seg.type === 'news') {
      if (prefs.news.length === 'brief') return acc + 0.5;
      if (prefs.news.length === 'detailed') return acc + 1.5;
      return acc + 1;
    }
    return acc + 5;
  }, 0);

  const handleStartJourney = () => {
    const segments: JourneySegment[] = [];
    let id = 0;
    const adScripts = scripts.ad;
    let adIdx = 0;

    const cityKey = prefs.city as keyof typeof scripts.traffic;

    if (prefs.traffic.enabled) {
      segments.push({
        id: String(id++),
        type: 'traffic',
        title: `${cityName} Traffic`,
        duration: 90,
        script: scripts.traffic[cityKey] || scripts.traffic.auckland,
        status: 'upcoming',
      });
      segments.push({
        id: String(id++),
        type: 'ad',
        title: 'Ad Break',
        duration: 15,
        script: adScripts[adIdx++ % adScripts.length],
        status: 'upcoming',
      });
    }

    if (prefs.weather.enabled) {
      segments.push({
        id: String(id++),
        type: 'weather',
        title: `${cityName} Weather`,
        duration: 60,
        script: scripts.weather[cityKey] || scripts.weather.auckland,
        status: 'upcoming',
      });
      segments.push({
        id: String(id++),
        type: 'ad',
        title: 'Ad Break',
        duration: 15,
        script: adScripts[adIdx++ % adScripts.length],
        status: 'upcoming',
      });
    }

    if (prefs.news.enabled) {
      const newsLength = prefs.news.length as keyof typeof scripts.news;
      segments.push({
        id: String(id++),
        type: 'news',
        title: 'News Update',
        duration: prefs.news.length === 'brief' ? 30 : prefs.news.length === 'detailed' ? 90 : 60,
        script: scripts.news[newsLength] || scripts.news.standard,
        status: 'upcoming',
      });
      segments.push({
        id: String(id++),
        type: 'ad',
        title: 'Ad Break',
        duration: 15,
        script: adScripts[adIdx++ % adScripts.length],
        status: 'upcoming',
      });
    }

    segments.push({
      id: String(id++),
      type: 'entertainment',
      title: entertainmentName,
      duration: 300,
      script:
        prefs.entertainment.type === 'station'
          ? `Now playing ${station?.name || 'The Edge'} — ${station?.tagline || 'Hit Music'}`
          : `Now playing ${podcast?.name || 'Podcast'} — ${podcast?.latestEpisode?.title || 'Latest Episode'}`,
      status: 'upcoming',
    });

    buildJourney(segments);
    startJourney();
    router.push('/journey');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {cityName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your personalised audio journey is ready
          </p>
        </div>

        <JourneyHero onStart={handleStartJourney} estimatedDuration={Math.round(estimatedDuration)} />

        {/* Quick settings */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={prefs.traffic.enabled ? 'default' : 'outline'} className="text-xs">
            Traffic {prefs.traffic.enabled ? 'ON' : 'OFF'}
          </Badge>
          <Badge variant={prefs.weather.enabled ? 'default' : 'outline'} className="text-xs">
            Weather {prefs.weather.enabled ? 'ON' : 'OFF'}
          </Badge>
          <Badge variant={prefs.news.enabled ? 'default' : 'outline'} className="text-xs">
            News · {prefs.news.length}
          </Badge>
        </div>

        {/* Segment preview */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Your journey lineup
          </h2>
          <div className="space-y-1">
            {segmentPreview.map((seg, i) => {
              const Icon = segmentPreviewIcons[seg.type] || Radio;
              return (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{seg.label}</span>
                  {i < segmentPreview.length - 1 && (
                    <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic preview for selected city */}
        {prefs.traffic.enabled && trafficRoutes[prefs.city] && (
          <div className="rounded-xl bg-secondary/50 p-4">
            <h2 className="mb-2 text-sm font-semibold">
              Route Preview
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{trafficRoutes[prefs.city].from}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{trafficRoutes[prefs.city].to}</span>
            </div>
            <p className="mt-1 text-sm">
              <span className="font-semibold text-orange-400">
                {trafficRoutes[prefs.city].currentDuration} min
              </span>
              <span className="text-muted-foreground">
                {' '}(usually {trafficRoutes[prefs.city].normalDuration} min)
              </span>
            </p>
            {trafficRoutes[prefs.city].returnJourney && (
              <p className="mt-1 text-xs text-muted-foreground">
                Return tonight: ~{trafficRoutes[prefs.city].returnJourney.currentDuration} min
              </p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
