import { TrafficRoute } from '@/lib/types';

export const trafficRoutes: Record<string, TrafficRoute> = {
  auckland: {
    id: 'akl-default',
    city: 'Auckland',
    from: 'Grey Lynn',
    to: 'Auckland CBD',
    normalDuration: 18,
    currentDuration: 27,
    incidents: [
      { type: 'congestion', location: 'K Road / Ponsonby Road intersection', description: 'Heavy traffic merging onto motorway', delay: 5 },
      { type: 'roadworks', location: 'Grafton Bridge', description: 'Lane closure until March, expect delays', delay: 4 },
    ],
    returnJourney: {
      normalDuration: 22,
      currentDuration: 35,
      incidents: [
        { type: 'congestion', location: 'Spaghetti Junction', description: 'Evening peak — northbound lanes at capacity', delay: 8 },
        { type: 'accident', location: 'Northwestern Motorway near Te Atatu', description: 'Minor fender-bender, right lane blocked', delay: 5 },
      ],
    },
  },
  wellington: {
    id: 'wlg-default',
    city: 'Wellington',
    from: 'Johnsonville',
    to: 'Wellington CBD',
    normalDuration: 15,
    currentDuration: 22,
    incidents: [
      { type: 'roadworks', location: 'Ngauranga Gorge', description: 'Seismic strengthening works — single lane', delay: 7 },
    ],
    returnJourney: {
      normalDuration: 18,
      currentDuration: 25,
      incidents: [
        { type: 'congestion', location: 'Hutt Road', description: 'Heavy traffic heading north from CBD', delay: 7 },
      ],
    },
  },
  christchurch: {
    id: 'chc-default',
    city: 'Christchurch',
    from: 'Riccarton',
    to: 'Christchurch CBD',
    normalDuration: 12,
    currentDuration: 15,
    incidents: [
      { type: 'roadworks', location: 'Riccarton Road', description: 'Cycleway construction — reduced to one lane', delay: 3 },
    ],
    returnJourney: {
      normalDuration: 14,
      currentDuration: 16,
      incidents: [
        { type: 'congestion', location: 'Moorhouse Avenue', description: 'Moderate afternoon traffic', delay: 2 },
      ],
    },
  },
};
