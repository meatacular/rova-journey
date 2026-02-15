'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface StoryImage {
  url: string;
  caption: string;
  link: string;
}

const newsImages: StoryImage[] = [
  { url: 'https://images.ctfassets.net/r65x6q43xsmv/7bgVWhqeYLAkKDoP4GNUmz/14554e41e1c941c0b6e4a703270b6e60/DGEIC_13022026_Thumbnail2.jpg', caption: 'Transport funding boost announced', link: 'https://www.rova.nz/news' },
  { url: 'https://images.ctfassets.net/r65x6q43xsmv/4kLX9pTYL3seM6pO0WdgRM/7b64353af22fc7a439ea44362b6abd1d/Moonlight-over-Tapapakanga-Splore-2024---Nicole-Brannen-82.jpg', caption: 'Fonterra record half-year profit', link: 'https://www.rova.nz/news' },
  { url: 'https://images.ctfassets.net/r65x6q43xsmv/3MRNaSK6FjGY5VJadlZGhu/9c8d87389a7147eb9cb3095c3a226760/Six60SkyTower-HERO.jpg', caption: 'Six60 announce stadium tour', link: 'https://www.rova.nz/news' },
  { url: 'https://images.ctfassets.net/r65x6q43xsmv/wemTRpphEe31njACn8Mrx/a743584160a6d4862f9b267d1680a360/NzPolicearrestwomanfordatingscam-HERO.jpg', caption: 'NZ Police fraud warning', link: 'https://www.rova.nz/news' },
];

const sportImages: StoryImage[] = [
  { url: 'https://images.ctfassets.net/r65x6q43xsmv/5CcXbfY0gYYjHPfymv60l3/25f36656e072e07e5aa684607eaf4511/DSPN_Jamie_Wall_12_02_THUMBNAIL.jpg', caption: 'Black Caps squad named for England', link: 'https://www.rova.nz/sport' },
  { url: 'https://images.ctfassets.net/r65x6q43xsmv/6nlAyuqoFoAzNCRYhZIDDh/c77f2fc6e339b4d1898faf683dfb3611/DSPN_Angus_Mabey_12_02_THUMBNAIL.jpg', caption: 'Super Rugby preview', link: 'https://www.rova.nz/sport' },
  { url: 'https://images.ctfassets.net/r65x6q43xsmv/6ADGGzy1JI8tNAU1XAHjjh/eecf52f2e6677127c1d7c11d31fdba8e/BenBarclaycelebratesLucaHarringtonBronze-HERO.jpg', caption: 'Silver Ferns claim Constellation Cup', link: 'https://www.rova.nz/sport' },
  { url: 'https://images.ctfassets.net/r65x6q43xsmv/3TJ6Ore7X78HwGNHh8wcYG/f53c0709418e6ccca3b81be805abc6c3/DSPN_Roundtable_11_02_THUMBNAIL.jpg', caption: 'NZ Winter Olympics team named', link: 'https://www.rova.nz/sport' },
];

interface StoryImagesProps {
  type: 'news' | 'sport';
  elapsedTime: number;
}

export function StoryImages({ type, elapsedTime }: StoryImagesProps) {
  const images = type === 'sport' ? sportImages : newsImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);

  // Auto-cycle every 4 seconds unless user has manually navigated
  useEffect(() => {
    if (manualOverride) return;
    const idx = Math.floor(elapsedTime / 4) % images.length;
    setCurrentIndex(idx);
  }, [elapsedTime, images.length, manualOverride]);

  const goTo = useCallback((idx: number) => {
    setManualOverride(true);
    setCurrentIndex(idx);
  }, []);

  const prev = useCallback(() => {
    setManualOverride(true);
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setManualOverride(true);
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const current = images[currentIndex];

  return (
    <div className="block w-full rounded-xl overflow-hidden bg-secondary/50">
      <div className="relative w-full aspect-video">
        <Image
          src={current.url}
          alt={current.caption}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 512px) 100vw, 512px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Left/right skip arrows */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-xs font-semibold text-white leading-tight">{current.caption}</p>
        </div>
        {/* Progress dots — tappable */}
        <div className="absolute top-2 right-2 flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
