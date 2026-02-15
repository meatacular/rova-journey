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
  const { buildJourney, startJourney, jumpToSegment, showSplash, setShowSplash } = useJourney();

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
        metadata: { advertiser: 'Woolworths', color: '#007837', tagline: 'Everyone deserves quality', logo: '/ads/woolworths.svg', url: 'https://www.woolworths.co.nz' },
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
        metadata: { advertiser: 'Z Energy', color: '#002B5C', tagline: 'Feel the good energy', logo: '/ads/z-energy.svg', url: 'https://www.z.co.nz' },
      });
    }

    if (useNews) {
      const newsLength = prefs.news.length as keyof typeof scripts.newsChapters;
      const newsChapters = scripts.newsChapters[newsLength] || scripts.newsChapters.standard;
      const newsDuration = newsChapters.reduce((sum, ch) => sum + ch.duration, 0);
      segments.push({
        id: String(id++),
        type: 'news',
        title: newsChapters[0].title,
        duration: newsDuration,
        script: newsChapters.map((ch) => ch.script).join(' '),
        chapters: newsChapters,
        status: 'upcoming',
      });
      segments.push({
        id: String(id++),
        type: 'ad',
        title: 'Ad Break',
        duration: 15,
        script: adScripts[adIdx++ % adScripts.length],
        status: 'upcoming',
        metadata: { advertiser: 'ASB', color: '#FFCC00', tagline: 'Here for your ambition', logo: '/ads/asb.svg', url: 'https://www.asb.co.nz' },
      });
    }

    if (useSport) {
      const sportChapters = scripts.sportChapters;
      const sportDuration = sportChapters.reduce((sum, ch) => sum + ch.duration, 0);
      segments.push({
        id: String(id++),
        type: 'sport' as SegmentType,
        title: sportChapters[0].title,
        duration: sportDuration,
        script: sportChapters.map((ch) => ch.script).join(' '),
        chapters: sportChapters,
        status: 'upcoming',
      });
      segments.push({
        id: String(id++),
        type: 'ad',
        title: 'Ad Break',
        duration: 15,
        script: adScripts[adIdx++ % adScripts.length],
        status: 'upcoming',
        metadata: { advertiser: 'Woolworths', color: '#007837', tagline: 'Everyone deserves quality', logo: '/ads/woolworths.svg', url: 'https://www.woolworths.co.nz' },
      });
    }

    if (useEntertainment) {
      const isStation = prefs.entertainment.type === 'station';
      const podcastId = prefs.entertainment.podcastId as keyof typeof scripts.podcastChapters;
      const podChapters = !isStation ? scripts.podcastChapters[podcastId] : undefined;
      const podDuration = podChapters ? podChapters.reduce((sum, ch) => sum + ch.duration, 0) : 300;
      segments.push({
        id: String(id++),
        type: 'entertainment',
        title: isStation
          ? (station?.name || 'The Edge')
          : podChapters ? podChapters[0].title : (podcast?.latestEpisode?.title || podcast?.name || 'Podcast'),
        duration: podDuration,
        script: isStation
          ? `Now playing ${station?.name || 'The Edge'} — ${station?.tagline || 'Hit Music'}`
          : podChapters ? podChapters.map((ch) => ch.script).join(' ') : `Now playing ${podcast?.name || 'Podcast'} — ${podcast?.latestEpisode?.title || 'Latest Episode'}`,
        chapters: podChapters,
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
      metadata: { advertiser: 'Woolworths', color: '#007837', tagline: 'Everyone deserves quality', logo: '/ads/woolworths.svg', url: 'https://www.woolworths.co.nz' },
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
      metadata: { advertiser: 'Z Energy', color: '#002B5C', tagline: 'Feel the good energy', logo: '/ads/z-energy.svg', url: 'https://www.z.co.nz' },
    });

    // News
    const genericNewsChapters = scripts.newsChapters.standard;
    const genericNewsDuration = genericNewsChapters.reduce((sum, ch) => sum + ch.duration, 0);
    segments.push({
      id: String(id++),
      type: 'news',
      title: genericNewsChapters[0].title,
      duration: genericNewsDuration,
      script: genericNewsChapters.map((ch) => ch.script).join(' '),
      chapters: genericNewsChapters,
      status: 'upcoming',
    });
    segments.push({
      id: String(id++),
      type: 'ad',
      title: 'Ad Break',
      duration: 15,
      script: adScripts[adIdx++ % adScripts.length],
      status: 'upcoming',
      metadata: { advertiser: 'ASB', color: '#FFCC00', tagline: 'Here for your ambition', logo: '/ads/asb.svg', url: 'https://www.asb.co.nz' },
    });

    // Sport
    const genericSportChapters = scripts.sportChapters;
    const genericSportDuration = genericSportChapters.reduce((sum, ch) => sum + ch.duration, 0);
    segments.push({
      id: String(id++),
      type: 'sport' as SegmentType,
      title: genericSportChapters[0].title,
      duration: genericSportDuration,
      script: genericSportChapters.map((ch) => ch.script).join(' '),
      chapters: genericSportChapters,
      status: 'upcoming',
    });
    segments.push({
      id: String(id++),
      type: 'ad',
      title: 'Ad Break',
      duration: 15,
      script: adScripts[adIdx++ % adScripts.length],
      status: 'upcoming',
      metadata: { advertiser: 'Woolworths', color: '#007837', tagline: 'Everyone deserves quality', logo: '/ads/woolworths.svg', url: 'https://www.woolworths.co.nz' },
    });

    // Entertainment — use a featured podcast for first-time generic journeys
    const genericPodChapters = scripts.podcastChapters[randomPodcastId as keyof typeof scripts.podcastChapters];
    const genericPodDuration = genericPodChapters ? genericPodChapters.reduce((sum, ch) => sum + ch.duration, 0) : 300;
    segments.push({
      id: String(id++),
      type: 'entertainment',
      title: genericPodChapters ? genericPodChapters[0].title : genericPodcast.latestEpisode.title,
      duration: genericPodDuration,
      script: genericPodChapters ? genericPodChapters.map((ch) => ch.script).join(' ') : `Now playing ${genericPodcast.name} — ${genericPodcast.latestEpisode.title}`,
      chapters: genericPodChapters,
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

  const startAtSegment = (segmentType: SegmentType) => {
    const segments = buildSegments();
    buildJourney(segments);
    startJourney();
    // Find the first segment matching the type and jump to it
    const idx = segments.findIndex((s) => s.type === segmentType);
    if (idx > 0) {
      jumpToSegment(idx);
    }
    router.push('/journey');
  };

  return {
    handleStartJourney,
    startFromPreset,
    startDefault,
    startGeneric,
    startAtSegment,
    entertainmentName,
    showSplash,
    setShowSplash,
  };
}
