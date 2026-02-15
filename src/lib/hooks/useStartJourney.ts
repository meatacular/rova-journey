'use client';

import { useRouter } from 'next/navigation';
import { usePreferences } from '@/lib/stores/preferences';
import { useJourney } from '@/lib/stores/journey';
import { stations } from '@/data/mock/stations';
import { podcasts } from '@/data/mock/podcasts';
import { scripts } from '@/data/mock/scripts';
import { JourneySegment, JourneyPreset, SegmentType } from '@/lib/types';

export function useStartJourney() {
  const router = useRouter();
  const prefs = usePreferences();
  const { buildJourney, startJourney, showSplash, setShowSplash } = useJourney();

  const station = stations.find((s) => s.id === prefs.entertainment.stationId);
  const podcast = podcasts.find((p) => p.id === prefs.entertainment.podcastId);
  const entertainmentName =
    prefs.entertainment.type === 'station' ? station?.name || 'The Edge' : podcast?.name || 'Podcast';

  const buildSegments = (preset?: JourneyPreset): JourneySegment[] => {
    const segments: JourneySegment[] = [];
    let id = 0;
    const adScripts = scripts.ad;
    let adIdx = 0;
    const cityKey = prefs.city as keyof typeof scripts.traffic;

    const useTraffic = preset ? preset.segments.traffic : prefs.traffic.enabled;
    const useWeather = preset ? preset.segments.weather : prefs.weather.enabled;
    const useNews = preset ? preset.segments.news : prefs.news.enabled;
    const useSport = preset ? preset.segments.sport : prefs.sport?.enabled;
    const useEntertainment = preset ? preset.segments.entertainment : true;

    const journeyLabel = preset ? preset.name.toLowerCase() : 'your journey to work';

    if (useTraffic) {
      segments.push({
        id: String(id++),
        type: 'traffic',
        title: `Traffic for ${journeyLabel}`,
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
        metadata: { advertiser: 'Countdown', color: '#007837', tagline: 'The fresh food people', url: 'https://www.countdown.co.nz' },
      });
    }

    if (useWeather) {
      segments.push({
        id: String(id++),
        type: 'weather',
        title: `Weather for ${journeyLabel}`,
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
        metadata: { advertiser: 'Z Energy', color: '#FF6900', tagline: 'Feel the good energy', url: 'https://www.z.co.nz' },
      });
    }

    if (useNews) {
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
        metadata: { advertiser: 'ASB', color: '#FFCC00', tagline: 'Here for your ambition', url: 'https://www.asb.co.nz' },
      });
    }

    if (useSport) {
      segments.push({
        id: String(id++),
        type: 'sport' as SegmentType,
        title: 'Sport — Silver Ferns claim Constellation Cup',
        duration: prefs.sport?.length === 'brief' ? 30 : prefs.sport?.length === 'detailed' ? 90 : 60,
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
        metadata: { advertiser: 'Countdown', color: '#007837', tagline: 'The fresh food people', url: 'https://www.countdown.co.nz' },
      });
    }

    if (useEntertainment) {
      const isStation = prefs.entertainment.type === 'station';
      segments.push({
        id: String(id++),
        type: 'entertainment',
        title: isStation
          ? (station?.name || 'The Edge')
          : (podcast?.latestEpisode?.title || podcast?.name || 'Podcast'),
        duration: 300,
        script: isStation
          ? `Now playing ${station?.name || 'The Edge'} — ${station?.tagline || 'Hit Music'}`
          : `Now playing ${podcast?.name || 'Podcast'} — ${podcast?.latestEpisode?.title || 'Latest Episode'}`,
        status: 'upcoming',
        metadata: isStation
          ? { streamUrl: station?.streamUrl, stationColor: station?.color, entertainmentType: 'station' }
          : {
              entertainmentType: 'podcast',
              podcastName: podcast?.name,
              podcastHost: podcast?.host,
              podcastArtwork: podcast?.artwork,
              episodeTitle: podcast?.latestEpisode?.title,
            },
      });
    }

    return segments;
  };

  const handleStartJourney = () => {
    setShowSplash(true);
  };

  const startFromPreset = (preset: JourneyPreset) => {
    const segments = buildSegments(preset);
    buildJourney(segments);
    startJourney();
    setShowSplash(false);
    router.push('/journey');
  };

  const startDefault = () => {
    const segments = buildSegments();
    buildJourney(segments);
    startJourney();
    router.push('/journey');
  };

  const featuredPodcastIds = ['wheres-my-money', 'joe-rogan-experience', 'a-little-bit-extra'];

  const startGeneric = (destination: string) => {
    const segments: JourneySegment[] = [];
    let id = 0;
    const adScripts = scripts.ad;
    let adIdx = 0;
    const cityKey = prefs.city as keyof typeof scripts.traffic;
    const label = destination || 'your destination';

    // Pick a random featured podcast for first-time users
    const randomPodcastId = featuredPodcastIds[Math.floor(Math.random() * featuredPodcastIds.length)];
    const genericPodcast = podcasts.find((p) => p.id === randomPodcastId) || podcasts.find((p) => p.id === 'a-little-bit-extra')!;

    // Traffic
    segments.push({
      id: String(id++),
      type: 'traffic',
      title: `Traffic to ${label}`,
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
      metadata: { advertiser: 'Countdown', color: '#007837', tagline: 'The fresh food people', url: 'https://www.countdown.co.nz' },
    });

    // Weather
    segments.push({
      id: String(id++),
      type: 'weather',
      title: `Weather for ${label}`,
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
      metadata: { advertiser: 'Z Energy', color: '#FF6900', tagline: 'Feel the good energy', url: 'https://www.z.co.nz' },
    });

    // News
    segments.push({
      id: String(id++),
      type: 'news',
      title: 'Your News — Black Caps lineup announced',
      duration: 60,
      script: scripts.news.standard,
      status: 'upcoming',
    });
    segments.push({
      id: String(id++),
      type: 'ad',
      title: 'Ad Break',
      duration: 15,
      script: adScripts[adIdx++ % adScripts.length],
      status: 'upcoming',
      metadata: { advertiser: 'ASB', color: '#FFCC00', tagline: 'Here for your ambition', url: 'https://www.asb.co.nz' },
    });

    // Sport
    segments.push({
      id: String(id++),
      type: 'sport' as SegmentType,
      title: 'Sport — Silver Ferns claim Constellation Cup',
      duration: 60,
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
      metadata: { advertiser: 'Countdown', color: '#007837', tagline: 'The fresh food people', url: 'https://www.countdown.co.nz' },
    });

    // Entertainment — use a featured podcast for first-time generic journeys
    segments.push({
      id: String(id++),
      type: 'entertainment',
      title: genericPodcast.latestEpisode.title,
      duration: 300,
      script: `Now playing ${genericPodcast.name} — ${genericPodcast.latestEpisode.title}`,
      status: 'upcoming',
      metadata: {
        entertainmentType: 'podcast',
        podcastName: genericPodcast.name,
        podcastHost: genericPodcast.host,
        podcastArtwork: genericPodcast.artwork,
        episodeTitle: genericPodcast.latestEpisode.title,
      },
    });

    buildJourney(segments);
    startJourney();
    router.push('/journey');
  };

  return {
    handleStartJourney,
    startFromPreset,
    startDefault,
    startGeneric,
    entertainmentName,
    showSplash,
    setShowSplash,
  };
}
