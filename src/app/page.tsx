'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, ChevronRight, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppShell } from '@/components/layout/AppShell';
import { usePreferences } from '@/lib/stores/preferences';
import { useJourney } from '@/lib/stores/journey';
import { stations } from '@/data/mock/stations';
import { podcasts } from '@/data/mock/podcasts';
import { trafficRoutes } from '@/data/mock/traffic';
import { scripts } from '@/data/mock/scripts';
import { JourneySegment } from '@/lib/types';
import { toast } from 'sonner';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Mock featured content
const featured = [
  { title: 'Win tickets to see Hilary Duff live in NZ!', type: 'Event', image: '🎤' },
  { title: "Lorde's new album — What to know", type: 'Story', image: '🎵' },
];

const shorts = [
  { title: 'Linda on Valentines', color: '#e31937' },
  { title: 'Guess the Artist', color: '#6b2fa0' },
  { title: 'Morning Laughs', color: '#e91e8c' },
];

export default function HomePage() {
  const router = useRouter();
  const prefs = usePreferences();
  const { buildJourney, startJourney } = useJourney();
  const [toastShown, setToastShown] = useState(false);

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

  // Show "car connected" toast on load
  useEffect(() => {
    if (toastShown) return;
    setToastShown(true);
    const timer = setTimeout(() => {
      toast('Car connected — start journey?', {
        duration: 8000,
        action: {
          label: 'Start',
          onClick: () => handleStartJourney(),
        },
      });
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Category tabs
  const tabs = ['For you', 'Radio', 'Podcasts', 'Videos', 'Articles'];
  const [activeTab, setActiveTab] = useState('For you');

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-secondary text-muted-foreground hover:bg-accent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Featured section */}
        <div>
          <h2 className="text-xl font-bold mb-3">Featured</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {featured.map((item, i) => (
              <Card
                key={i}
                className="shrink-0 w-[280px] border-0 bg-secondary/50 overflow-hidden cursor-pointer hover:bg-secondary transition-colors"
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-6xl">
                  {item.image}
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                  <p className="text-sm font-semibold mt-1 line-clamp-2">{item.title}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Start Journey CTA */}
        <Card className="border-0 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/50">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <Car className="h-3.5 w-3.5" />
              <span>{prefs.homeAddress}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{prefs.workAddress}</span>
            </div>
            <h2 className="text-lg font-bold mb-1">{getGreeting()}, {cityName}</h2>
            <p className="text-sm text-muted-foreground mb-4">Your personalised journey is ready</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {prefs.traffic.enabled && (
                <Badge variant="outline" className="text-xs bg-background/50">Traffic</Badge>
              )}
              {prefs.weather.enabled && (
                <Badge variant="outline" className="text-xs bg-background/50">Weather</Badge>
              )}
              {prefs.news.enabled && (
                <Badge variant="outline" className="text-xs bg-background/50">News · {prefs.news.length}</Badge>
              )}
              {prefs.sport?.enabled && (
                <Badge variant="outline" className="text-xs bg-background/50">Sport</Badge>
              )}
              <Badge variant="outline" className="text-xs bg-background/50">{entertainmentName}</Badge>
            </div>

            <Button
              onClick={handleStartJourney}
              className="w-full text-base font-semibold"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Journey
            </Button>
          </div>
        </Card>

        {/* Shorts / Quick content */}
        <div>
          <h2 className="text-xl font-bold mb-3">Shorts</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {shorts.map((item, i) => (
              <div
                key={i}
                className="shrink-0 w-[140px] h-[200px] rounded-2xl overflow-hidden relative cursor-pointer"
                style={{ backgroundColor: item.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white leading-tight">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic preview */}
        {prefs.traffic.enabled && trafficRoutes[prefs.city] && (
          <Card className="border-0 bg-secondary/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Car className="h-4 w-4 text-orange-400" />
              <h2 className="text-sm font-semibold">Route</h2>
            </div>
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
          </Card>
        )}
      </div>
    </AppShell>
  );
}
