'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { JourneySegment, SegmentType } from '@/lib/types';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Featured content with real rova.nz CDN images
const featured = [
  { title: 'Win tickets to see Hilary Duff live in NZ!', type: 'Event', image: 'https://images.ctfassets.net/r65x6q43xsmv/g9ybEC5t4XU80R9gfRLEn/6666da5becd21b1fd650f69d2d1186ea/Hilary-Duff-16x9.jpg' },
  { title: "Lorde's new shows — What you need to know", type: 'Story', image: 'https://images.ctfassets.net/r65x6q43xsmv/6p5FlJdHZJWaAi9oycHNyl/358798253f22bd25ba462ac7278393ca/LordeNZshowsWhatYouNeedToKnow-HERO.jpg' },
  { title: 'Jim Beam Homegrown Plus One Pact', type: 'Event', image: 'https://images.ctfassets.net/r65x6q43xsmv/5oDEfjLmmjl7ykKEoXAidV/d1f54de379b06a55a8c92c39e9b11f9c/RVA-Homegrown-PLus-One-Pact-1920x1080.png' },
];

const shorts = [
  { title: 'Linda on Valentines', image: 'https://images.ctfassets.net/r65x6q43xsmv/2FaCnJfSGRgHvkgZSyfsg4/54056f6323dd87e528172c5b632e4f25/MultiCorder3_-_NDI_Suite5A__Cam6__-_20250213T100032.00_00_12_14.Still001.png' },
  { title: 'Guess the Artist', image: 'https://images.ctfassets.net/r65x6q43xsmv/4GwxCbUfF72DK3XTmd7NI9/cf990c4e3db9c6c7d1e4b4f740338ab0/MultiCorder1_-_NDI_Suite5A__Cam1__-_20250211T152810.00_01_22_09.Still001.jpg' },
  { title: 'ICK ICK ICK', image: 'https://images.ctfassets.net/r65x6q43xsmv/1m6ZbYC8yR5N7oqyjl6mn9/1ea5744942ec56615169d04c3d8ac0db/THUMBNAIL.png' },
  { title: 'Blended Fingers', image: 'https://images.ctfassets.net/r65x6q43xsmv/3pe9PR2LlRr1dU5YjP0rFo/65bb0549b372e2b93409a78692bd844c/EDG_BlendedFingers_4.00_00_31_20.Still001.png' },
  { title: 'Bic Runga', image: 'https://images.ctfassets.net/r65x6q43xsmv/3pmodfUfwOFzrC1fFu7pqV/7349e87e889d99b325a6d41d50da8dc3/bic-runga-social-IMAGE.jpg' },
];

const headlines = [
  { title: 'Splore 2026: Everything you need to know', image: 'https://images.ctfassets.net/r65x6q43xsmv/4kLX9pTYL3seM6pO0WdgRM/7b64353af22fc7a439ea44362b6abd1d/Moonlight-over-Tapapakanga-Splore-2024---Nicole-Brannen-82.jpg' },
  { title: 'Bic Runga back with disco-inspired album', image: 'https://images.ctfassets.net/r65x6q43xsmv/6PIqgMKAazth3yyFWsARx8/a9a1cd257a6c75525fdd4169072bbe2b/bic-runga-rova.jpg' },
  { title: 'Six60 announce Sky Tower show', image: 'https://images.ctfassets.net/r65x6q43xsmv/3MRNaSK6FjGY5VJadlZGhu/9c8d87389a7147eb9cb3095c3a226760/Six60SkyTower-HERO.jpg' },
];

export default function HomePage() {
  const router = useRouter();
  const prefs = usePreferences();
  const { buildJourney, startJourney } = useJourney();
  const [showModal, setShowModal] = useState(false);

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
        title: 'Traffic for your journey to work',
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
        metadata: { advertiser: 'Countdown', color: '#007837', tagline: 'The fresh food people' },
      });
    }

    if (prefs.weather.enabled) {
      segments.push({
        id: String(id++),
        type: 'weather',
        title: 'Weather for your journey to work',
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
        metadata: { advertiser: 'Z Energy', color: '#FF6900', tagline: 'Feel the good energy' },
      });
    }

    if (prefs.news.enabled) {
      const newsLength = prefs.news.length as keyof typeof scripts.news;
      segments.push({
        id: String(id++),
        type: 'news',
        title: 'Your News — Black Caps lineup announced',
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
        metadata: { advertiser: 'ASB', color: '#FFCC00', tagline: 'Here for your ambition' },
      });
    }

    if (prefs.sport?.enabled) {
      segments.push({
        id: String(id++),
        type: 'sport' as SegmentType,
        title: 'Sport — Silver Ferns claim Constellation Cup',
        duration: prefs.sport.length === 'brief' ? 30 : prefs.sport.length === 'detailed' ? 90 : 60,
        script: "Sport now — Cricket New Zealand has named the Black Caps squad for the upcoming test series in England. Kane Williamson returns to captain the side. And the Silver Ferns have claimed the Constellation Cup with a dramatic 58-56 win over Australia in Melbourne.",
        status: 'upcoming',
      });
      segments.push({
        id: String(id++),
        type: 'ad',
        title: 'Ad Break',
        duration: 15,
        script: adScripts[adIdx++ % adScripts.length],
        status: 'upcoming',
        metadata: { advertiser: 'Countdown', color: '#007837', tagline: 'The fresh food people' },
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

  // Show "car connected" modal after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Category tabs
  const tabs = ['For you', 'Radio', 'Podcasts', 'Videos', 'Articles'];
  const [activeTab, setActiveTab] = useState('For you');

  const segmentBadges = [
    prefs.traffic.enabled && 'Traffic',
    prefs.weather.enabled && 'Weather',
    prefs.news.enabled && 'News',
    prefs.sport?.enabled && 'Sport',
    'Entertainment',
  ].filter(Boolean);

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
                <div className="h-40 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
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
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white leading-tight">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Headlines section */}
        <div>
          <h2 className="text-xl font-bold mb-3">Headlines</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {headlines.map((item, i) => (
              <Card
                key={i}
                className="shrink-0 w-[280px] border-0 bg-secondary/50 overflow-hidden cursor-pointer hover:bg-secondary transition-colors"
              >
                <div className="h-40 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">Headline</p>
                  <p className="text-sm font-semibold mt-1 line-clamp-2">{item.title}</p>
                </div>
              </Card>
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

      {/* Full-screen Car Connected Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl bg-card border border-border p-6 text-center animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Car icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold mb-1">Car Connected</h2>
            <p className="text-sm text-muted-foreground mb-5">Your personalised journey is ready</p>

            {/* Route display */}
            <div className="flex items-center justify-center gap-2 mb-5 text-sm text-muted-foreground">
              <span>{prefs.homeAddress}</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>{prefs.workAddress}</span>
            </div>

            {/* Segment badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {segmentBadges.map((label) => (
                <Badge key={label as string} variant="outline" className="text-xs bg-background/50">
                  {label}
                </Badge>
              ))}
            </div>

            {/* Start Journey button */}
            <Button
              onClick={handleStartJourney}
              className="w-full text-base font-semibold bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Journey
            </Button>

            {/* Not now link */}
            <button
              onClick={() => setShowModal(false)}
              className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
