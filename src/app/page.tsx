'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Car, ChevronRight, Play, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppShell } from '@/components/layout/AppShell';
import { usePreferences } from '@/lib/stores/preferences';
import { trafficRoutes } from '@/data/mock/traffic';
import { useStartJourney } from '@/lib/hooks/useStartJourney';
import { JourneySplash } from '@/components/journey/JourneySplash';

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
  const prefs = usePreferences();
  const { handleStartJourney, startFromPreset, startGeneric, entertainmentName, showSplash, setShowSplash } = useStartJourney();
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'welcome' | 'destination'>('welcome');
  const [destination, setDestination] = useState('');

  const cityName =
    prefs.city === 'auckland'
      ? 'Auckland'
      : prefs.city === 'wellington'
        ? 'Wellington'
        : prefs.city === 'christchurch'
          ? 'Christchurch'
          : 'Hamilton';

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
          onClick={() => { setShowModal(false); setModalStep('welcome'); }}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-2xl bg-card border border-border p-6 text-center animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {modalStep === 'welcome' ? (
              <>
                {/* Car icon */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Car className="h-8 w-8 text-primary" />
                </div>

                <h2 className="text-xl font-bold mb-1">Car Connected</h2>
                <p className="text-sm text-muted-foreground mb-6">Level up your ride with rova journey!</p>

                <Button
                  onClick={() => setModalStep('destination')}
                  className="w-full text-base font-semibold bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Let&apos;s go
                </Button>

                <button
                  onClick={() => { setShowModal(false); setModalStep('welcome'); }}
                  className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Not now
                </button>
              </>
            ) : (
              <>
                {/* Destination icon */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>

                <h2 className="text-xl font-bold mb-1">Where are you heading?</h2>
                <p className="text-sm text-muted-foreground mb-4">We&apos;ll build your first journey</p>

                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Auckland CBD"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && destination.trim()) {
                      setShowModal(false);
                      setModalStep('welcome');
                      startGeneric(destination.trim());
                    }
                  }}
                />

                <Button
                  onClick={() => {
                    if (!destination.trim()) return;
                    setShowModal(false);
                    setModalStep('welcome');
                    startGeneric(destination.trim());
                  }}
                  className="w-full text-base font-semibold bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={!destination.trim()}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </Button>

                <button
                  onClick={() => setModalStep('welcome')}
                  className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showSplash && (
        <JourneySplash
          onSelectJourney={startFromPreset}
          onDismiss={() => setShowSplash(false)}
        />
      )}
    </AppShell>
  );
}
