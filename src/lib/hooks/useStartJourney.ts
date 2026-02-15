'use client';

import { useRouter } from 'next/navigation';
import { usePreferences } from '@/lib/stores/preferences';
import { useJourney } from '@/lib/stores/journey';
import { stations } from '@/data/mock/stations';
import { podcasts } from '@/data/mock/podcasts';
import { scripts } from '@/data/mock/scripts';
import { JourneySegment, SegmentType } from '@/lib/types';

export function useStartJourney() {
  const router = useRouter();
  const prefs = usePreferences();
  const { buildJourney, startJourney } = useJourney();

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
      metadata: {
        streamUrl: station?.streamUrl,
        stationColor: station?.color,
      },
    });

    buildJourney(segments);
    startJourney();
    router.push('/journey');
  };

  return { handleStartJourney, entertainmentName };
}
