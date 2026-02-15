'use client';

import Image from 'next/image';

interface PodcastPlayerProps {
  podcastName: string;
  host: string;
  episodeTitle: string;
  artwork: string;
}

export function PodcastPlayer({ podcastName, host, episodeTitle, artwork }: PodcastPlayerProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-secondary/50 p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={artwork}
          alt={podcastName}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{podcastName}</p>
        <p className="text-xs text-muted-foreground truncate">{host}</p>
        <p className="text-xs text-primary mt-1 truncate">{episodeTitle}</p>
      </div>
    </div>
  );
}
